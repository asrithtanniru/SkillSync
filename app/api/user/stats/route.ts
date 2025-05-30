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
        learningSkills: true,
        teachingSkills: true,
        sentConnections: true,
        receivedConnections: true
      }
    })

    if (!currentUser) {
      return new NextResponse("User not found", { status: 404 })
    }

    //  stats
    const stats = {
      totalTokens: 1000, // This should be calculated based on your token system
      skillsLearned: currentUser.learningSkills.length,
      skillsTaught: currentUser.teachingSkills.length,
      activeConnections: currentUser.sentConnections.filter(c => c.status === "accepted").length +
        currentUser.receivedConnections.filter(c => c.status === "accepted").length
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("[USER_STATS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 
