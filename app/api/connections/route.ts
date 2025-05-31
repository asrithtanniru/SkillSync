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
    const { eventId, message, toUserId } = body

    if (!toUserId) {
      return new NextResponse("Missing user ID", { status: 400 })
    }


    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!currentUser) {
      return new NextResponse("User not found", { status: 404 })
    }


    if (currentUser.id === toUserId) {
      return new NextResponse("Cannot connect with yourself", { status: 400 })
    }


    const existingConnection = await prisma.connection.findFirst({
      where: {
        OR: [
          {
            fromUserId: currentUser.id,
            toUserId: toUserId
          },
          {
            fromUserId: toUserId,
            toUserId: currentUser.id
          }
        ]
      }
    })

    if (existingConnection) {
      return new NextResponse("Connection already exists", { status: 400 })
    }


    const connection = await prisma.connection.create({
      data: {
        fromUserId: currentUser.id,
        toUserId: toUserId,
        eventId: eventId || null,
        message: message || "I'd like to connect with you!",
        status: "pending"
      },
      include: {
        fromUser: true,
        toUser: true,
        event: {
          include: {
            skill: true
          }
        }
      }
    })

    return NextResponse.json(connection)
  } catch (error) {
    console.error("[CONNECTIONS_POST]", error)
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
    const status = searchParams.get("status") || "all"


    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!currentUser) {
      return new NextResponse("User not found", { status: 404 })
    }


    const whereClause: any = {
      OR: [
        { fromUserId: currentUser.id },
        { toUserId: currentUser.id }
      ]
    }

    if (status !== "all") {
      whereClause.status = status
    }

    const connections = await prisma.connection.findMany({
      where: whereClause,
      include: {
        fromUser: true,
        toUser: true,
        event: {
          include: {
            skill: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    const connectionsWithCurrentUser = connections.map(conn => ({
      ...conn,
      currentUserId: currentUser.id
    }))

    return NextResponse.json(connectionsWithCurrentUser)
  } catch (error) {
    console.error("[CONNECTIONS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { connectionId, status } = body

    if (!connectionId || !status) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!currentUser) {
      return new NextResponse("User not found", { status: 404 })
    }

    const connection = await prisma.connection.findUnique({
      where: { id: connectionId },
      include: { toUser: true }
    })

    if (!connection) {
      return new NextResponse("Connection not found", { status: 404 })
    }

    if (connection.toUserId !== currentUser.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!["pending", "accepted", "rejected"].includes(status)) {
      return new NextResponse("Invalid status", { status: 400 })
    }

    // If the connection is being accepted, create a chat room
    if (status === "accepted") {
      const existingChatRoom = await prisma.chatRoom.findUnique({
        where: { connectionId }
      })

      if (existingChatRoom) {
        const updatedConnection = await prisma.connection.update({
          where: { id: connectionId },
          data: { status },
          include: {
            fromUser: true,
            toUser: true,
            event: {
              include: {
                skill: true
              }
            },
            chatRoom: true
          }
        })
        return NextResponse.json(updatedConnection)
      }

      const updatedConnection = await prisma.connection.update({
        where: { id: connectionId },
        data: {
          status,
          chatRoom: {
            create: {
              lastMessageAt: new Date()
            }
          }
        },
        include: {
          fromUser: true,
          toUser: true,
          event: {
            include: {
              skill: true
            }
          },
          chatRoom: true
        }
      })

      return NextResponse.json(updatedConnection)
    }

    const updatedConnection = await prisma.connection.update({
      where: { id: connectionId },
      data: { status },
      include: {
        fromUser: true,
        toUser: true,
        event: {
          include: {
            skill: true
          }
        },
        chatRoom: true
      }
    })

    return NextResponse.json(updatedConnection)
  } catch (error) {
    console.error("[CONNECTIONS_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 
