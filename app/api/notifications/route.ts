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
    const { connectionId, message } = body

    if (!connectionId || !message) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const connection = await prisma.connection.findUnique({
      where: { id: connectionId },
      include: {
        fromUser: true,
        toUser: true,
      }
    })

    if (!connection) {
      return new NextResponse("Connection not found", { status: 404 })
    }

    // Determine the recipient (the other user in the connection)
    const recipient = connection.fromUser.email === session.user.email
      ? connection.toUser
      : connection.fromUser

    // Here you would typically integrate with a push notification service
    // For now, we'll just return success
    return NextResponse.json({
      success: true,
      recipient: {
        id: recipient.id,
        name: recipient.name,
        email: recipient.email
      }
    })
  } catch (error) {
    console.error("[NOTIFICATIONS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 
