'use client'

import { SessionProvider } from "next-auth/react"
import { ThirdwebProvider } from "@thirdweb-dev/react"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider
      activeChain="mumbai"
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
    >
      <SessionProvider>{children}</SessionProvider>
    </ThirdwebProvider>
  )
} 
