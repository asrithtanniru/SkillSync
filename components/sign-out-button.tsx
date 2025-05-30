'use client'

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

export function SignOutButton() {
  return (
    <Button
      variant="outline"
      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
      onClick={() => signOut({ callbackUrl: '/auth/signin' })}
    >
      <LogOut className="w-4 h-4 mr-2" />
      Sign Out
    </Button>
  )
} 
