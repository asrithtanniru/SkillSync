import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"
import { getToken } from "next-auth/jwt"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession()
    return NextResponse.json(session)
  } catch (error) {
    console.error("Error getting session:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    console.log('Updating session with data:', data)

    // Update the user in the database
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        onboardingCompleted: data.onboardingCompleted,
      },
    })

    // Get the updated user data
    const updatedUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { onboardingCompleted: true }
    })

    console.log('Updated user data:', updatedUser)

    return NextResponse.json({
      success: true,
      onboardingCompleted: updatedUser?.onboardingCompleted
    })
  } catch (error) {
    console.error("Error updating session:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
} 
