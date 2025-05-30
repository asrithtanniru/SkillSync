'use client'

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function SignOutButton() {
  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
      window.location.href = '/auth/signin'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <Button
      variant="outline"
      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
      onClick={handleSignOut}
    >
      <LogOut className="w-4 h-4 mr-2" />
      Sign Out
    </Button>
  )
} 
