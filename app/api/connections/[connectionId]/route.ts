import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function GET(
  req: Request,
  context: { params: { connectionId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!currentUser) {
      return new NextResponse("User not found", { status: 404 })
    }

    const params = await context.params
    const connectionId = params.connectionId

    const connection = await prisma.connection.findUnique({
      where: { id: connectionId },
      include: {
        fromUser: true,
        toUser: true,
        chatRoom: true,
        event: {
          include: {
            skill: true
          }
        }
      }
    })

    if (!connection) {
      return new NextResponse("Connection not found", { status: 404 })
    }

    if (connection.fromUserId !== currentUser.id &&
      connection.toUserId !== currentUser.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    return NextResponse.json(connection)
  } catch (error) {
    console.error("[CONNECTION_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 
