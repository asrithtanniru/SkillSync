import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type") || "all"
    const level = searchParams.get("level") || "all"
    const search = searchParams.get("search") || ""

    const whereClause: any = {}

    if (type !== "all") {
      whereClause.type = type
    }

    if (level !== "all") {
      whereClause.level = level
    }

    if (search) {
      whereClause.OR = [
        { description: { contains: search, mode: "insensitive" } },
        { skill: { name: { contains: search, mode: "insensitive" } } }
      ]
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            location: true
          }
        },
        skill: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error("[EVENTS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { type, skill, description, date, time, duration, level } = body

    if (!type || !skill || !description || !date || !time || !duration || !level) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!currentUser) {
      return new NextResponse("User not found", { status: 404 })
    }

    const skillRecord = await prisma.skill.upsert({
      where: { name: skill },
      update: {},
      create: { name: skill }
    })

    const event = await prisma.event.create({
      data: {
        type,
        description,
        date: new Date(date),
        time,
        duration,
        level,
        userId: currentUser.id,
        skillId: skillRecord.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            location: true
          }
        },
        skill: true
      }
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error("[EVENTS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 
