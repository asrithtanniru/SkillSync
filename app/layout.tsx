import type { Metadata } from 'next'
import './globals.css'
import { Poppins } from 'next/font/google'

export const metadata: Metadata = {
  title: 'SkillSync',
  description: 'A platform where you exchange skills.',
}

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        {children}
      </body>
    </html>
  )
}
