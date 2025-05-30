import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { PrismaClient } from "@/lib/generated/prisma"

const prisma = new PrismaClient()

export async function POST() {
  try {
    // Clear the session cookie
    const response = NextResponse.json({ success: true })
    response.cookies.delete('next-auth.session-token')
    response.cookies.delete('next-auth.callback-url')
    response.cookies.delete('next-auth.csrf-token')

    return response
  } catch (error) {
    console.error("Error signing out:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
} 
