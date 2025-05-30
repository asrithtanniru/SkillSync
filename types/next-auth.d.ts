import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      onboardingCompleted?: boolean
    }
  }

  interface User {
    onboardingCompleted: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    onboardingCompleted?: boolean
  }
} 
