'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import { SignOutButton } from "@/components/sign-out-button"
import { Session } from "next-auth"

interface HeaderContentProps {
  session: Session | null
}

export function HeaderContent({ session }: HeaderContentProps) {
  return (
    <header className="border-b border-[#E6DDC4] bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#678983] rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#181D31]">Skill Sync</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/explore" className="text-[#181D31] hover:text-[#678983] transition-colors">
            Explore
          </Link>
          {session ? (
            <>
              <Link href="/wallet" className="text-[#181D31] hover:text-[#678983] transition-colors">
                Wallet
              </Link>
            </>
          ) : null}
        </nav>

        <div className="flex items-center space-x-3">
          {session ? (
            <>
              <Link href="/profile">
                <Button variant="outline" className="border-[#678983] text-[#678983] hover:bg-[#678983] hover:text-white">
                  Profile
                </Button>
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button variant="outline" className="border-[#678983] text-[#678983] hover:bg-[#678983] hover:text-white">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button className="bg-[#678983] hover:bg-[#678983]/90 text-white">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
} 
