import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        teachingSkills: true,
        learningSkills: true
      }
    })

    if (!currentUser) {
      return new NextResponse("User not found", { status: 404 })
    }

    console.log("Current user skills:", {
      teaching: currentUser.teachingSkills.map(s => s.name),
      learning: currentUser.learningSkills.map(s => s.name)
    })
    const potentialMatches = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: currentUser.id } },
          {
            OR: [
              {
                learningSkills: {
                  some: {
                    id: {
                      in: currentUser.teachingSkills.map(skill => skill.id)
                    }
                  }
                }
              },
              {
                teachingSkills: {
                  some: {
                    id: {
                      in: currentUser.learningSkills.map(skill => skill.id)
                    }
                  }
                }
              }
            ]
          }
        ]
      },
      include: {
        teachingSkills: true,
        learningSkills: true,
        events: {
          include: {
            skill: true
          }
        }
      }
    })

    console.log("Potential matches found:", potentialMatches.length)
    potentialMatches.forEach(match => {
      console.log("Match:", {
        name: match.name,
        teaching: match.teachingSkills.map(s => s.name),
        learning: match.learningSkills.map(s => s.name)
      })
    })

    const existingConnections = await prisma.connection.findMany({
      where: {
        OR: [
          { fromUserId: currentUser.id },
          { toUserId: currentUser.id }
        ]
      }
    })

    console.log("Existing connections:", existingConnections.length)


    const filteredMatches = potentialMatches.filter(match => {
      return !existingConnections.some(conn =>
        (conn.fromUserId === currentUser.id && conn.toUserId === match.id) ||
        (conn.fromUserId === match.id && conn.toUserId === currentUser.id)
      )
    })

    console.log("Matches after filtering connections:", filteredMatches.length)
    const matchesWithScore = filteredMatches.map(match => {
      const teachingMatches = match.learningSkills.filter(skill =>
        currentUser.teachingSkills.some(ts => ts.id === skill.id)
      ).length

      const learningMatches = match.teachingSkills.filter(skill =>
        currentUser.learningSkills.some(ls => ls.id === skill.id)
      ).length

      const totalMatches = teachingMatches + learningMatches

      console.log("Match score for", match.name, {
        teachingMatches,
        learningMatches,
        totalMatches
      })

      return {
        ...match,
        matchScore: totalMatches,
        matchingSkills: {
          teaching: teachingMatches,
          learning: learningMatches
        }
      }
    })

    const sortedMatches = matchesWithScore.sort((a, b) => b.matchScore - a.matchScore)

    console.log("Final matches:", sortedMatches.length)

    return NextResponse.json(sortedMatches)
  } catch (error) {
    console.error("[MATCHES_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 
