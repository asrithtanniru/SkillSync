import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, location, image, teachingSkills, learningSkills } = await req.json()

    // First, create or update the user's basic info
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        location,
        image,
        onboardingCompleted: true,
      },
    })

    // Then, handle the skills
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

    // Get all the skills from the database
    const skills = await prisma.skill.findMany({
      where: {
        name: {
          in: allSkills,
        },
      },
    })

    // Update the user's teaching and learning skills
    await prisma.user.update({
      where: { id: user.id },
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
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in onboarding:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
} 
