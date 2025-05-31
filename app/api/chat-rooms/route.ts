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

    const body = await req.json()
    const { connectionId } = body

    if (!connectionId) {
      return new NextResponse("Missing connection ID", { status: 400 })
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!currentUser) {
      return new NextResponse("User not found", { status: 404 })
    }

    const connection = await prisma.connection.findUnique({
      where: { id: connectionId },
      include: {
        fromUser: true,
        toUser: true
      }
    })

    if (!connection) {
      return new NextResponse("Connection not found", { status: 404 })
    }

    if (connection.fromUserId !== currentUser.id &&
      connection.toUserId !== currentUser.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (connection.status !== "accepted") {
      return new NextResponse("Connection must be accepted first", { status: 400 })
    }

    const existingChatRoom = await prisma.chatRoom.findUnique({
      where: { connectionId }
    })

    if (existingChatRoom) {
      return NextResponse.json(existingChatRoom)
    }

    const chatRoom = await prisma.chatRoom.create({
      data: {
        connectionId,
        lastMessageAt: new Date()
      }
    })

    return NextResponse.json(chatRoom)
  } catch (error) {
    console.error("[CHAT_ROOMS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 
