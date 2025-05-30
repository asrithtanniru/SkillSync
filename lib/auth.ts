import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@/lib/generated/prisma"

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        session.user.onboardingCompleted = token.onboardingCompleted as boolean
      }
      return session
    },
    async jwt({ token, user, trigger, session }) {
      // When user first signs in, get their onboarding status from database
      if (user) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { onboardingCompleted: true }
          })
          token.onboardingCompleted = dbUser?.onboardingCompleted || false
        } catch (error) {
          console.error('Error fetching user onboarding status:', error)
          token.onboardingCompleted = false
        }
      }

      // Update token when session is updated
      if (trigger === "update" && session) {
        if (session.user?.id && typeof session.user.onboardingCompleted === 'boolean') {
          try {
            await prisma.user.update({
              where: { id: session.user.id },
              data: { onboardingCompleted: session.user.onboardingCompleted }
            })
            token.onboardingCompleted = session.user.onboardingCompleted
          } catch (error) {
            console.error('Error updating user onboarding status:', error)
          }
        }
      }

      // Always fetch the latest onboarding status from the database
      if (token.sub) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { onboardingCompleted: true }
          })
          if (dbUser) {
            token.onboardingCompleted = dbUser.onboardingCompleted
          }
        } catch (error) {
          console.error('Error refreshing token from database:', error)
        }
      }

      return token
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signin',
    error: '/auth/error',
  },
} 
