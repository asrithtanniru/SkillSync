'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function SignIn() {
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user?.onboardingCompleted) {
      router.push('/dashboard')
    }
  }, [session, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F0E9D2]">
      <Card className="w-[350px] bg-white border-[#E6DDC4]">
        <CardHeader>
          <CardTitle className="text-[#181D31]">Welcome to SkillSwap</CardTitle>
          <CardDescription className="text-[#181D31]/70">Sign in to start learning and teaching skills</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full bg-[#678983] hover:bg-[#678983]/90 text-white"
            onClick={() => signIn("google", { callbackUrl: "/onboarding" })}
          >
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 
