import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { teachingSkills, learningSkills } = await req.json()

    // First, create any new skills that don't exist
    const allSkills = [...teachingSkills, ...learningSkills]
    await Promise.all(
      allSkills.map(skillName =>
        prisma.skill.upsert({
          where: { name: skillName },
          create: { name: skillName },
          update: {},
        })
      )
    )
    const skills = await prisma.skill.findMany({
      where: {
        name: {
          in: allSkills,
        },
      },
    })

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        teachingSkills: {
          set: skills
            .filter(skill => teachingSkills.includes(skill.name))
            .map(skill => ({ id: skill.id })),
        },
        learningSkills: {
          set: skills
            .filter(skill => learningSkills.includes(skill.name))
            .map(skill => ({ id: skill.id })),
        },
      },
      include: {
        teachingSkills: true,
        learningSkills: true
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("[USER_SKILLS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 
