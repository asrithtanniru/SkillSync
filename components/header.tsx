'use client'

import { useSession } from "next-auth/react"
import { HeaderContent } from "@/components/header-content"

export function Header() {
  const { data: session } = useSession()
  return <HeaderContent session={session} />
} 
