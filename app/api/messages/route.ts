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
    const { chatRoomId, content } = body

    if (!chatRoomId || !content) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!currentUser) {
      return new NextResponse("User not found", { status: 404 })
    }

    const chatRoom = await prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
      include: {
        connection: true
      }
    })

    if (!chatRoom) {
      return new NextResponse("Chat room not found", { status: 404 })
    }

    if (chatRoom.connection.fromUserId !== currentUser.id &&
      chatRoom.connection.toUserId !== currentUser.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId: currentUser.id,
        chatRoomId
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    // Update lastMessageAt
    await prisma.chatRoom.update({
      where: { id: chatRoomId },
      data: { lastMessageAt: new Date() }
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error("[MESSAGES_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const chatRoomId = searchParams.get("chatRoomId")

    if (!chatRoomId) {
      return new NextResponse("Missing chat room ID", { status: 400 })
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!currentUser) {
      return new NextResponse("User not found", { status: 404 })
    }

    // Verify user has access to this chat room
    const chatRoom = await prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
      include: {
        connection: true
      }
    })

    if (!chatRoom) {
      return new NextResponse("Chat room not found", { status: 404 })
    }

    if (chatRoom.connection.fromUserId !== currentUser.id &&
      chatRoom.connection.toUserId !== currentUser.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const messages = await prisma.message.findMany({
      where: { chatRoomId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: "asc"
      }
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error("[MESSAGES_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 
