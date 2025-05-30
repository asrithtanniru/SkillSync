import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    console.log('Middleware running:', {
      pathname,
      token,
      onboardingCompleted: token?.onboardingCompleted
    })

    // If user hasn't completed onboarding and tries to access protected routes
    if (!token?.onboardingCompleted &&
      (pathname.startsWith('/dashboard') ||
        pathname.startsWith('/profile') ||
        pathname.startsWith('/wallet') ||
        pathname.startsWith('/explore'))) {
      console.log('Redirecting to onboarding - user not completed')
      const url = new URL('/onboarding', req.url)
      return NextResponse.redirect(url)
    }

    // If user has completed onboarding and tries to access onboarding page
    if (token?.onboardingCompleted && pathname === '/onboarding') {
      console.log('Redirecting to dashboard - user completed onboarding')
      const url = new URL('/dashboard', req.url)
      return NextResponse.redirect(url)
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        console.log('Authorized callback:', {
          pathname: req.nextUrl.pathname,
          hasToken: !!token,
          onboardingCompleted: token?.onboardingCompleted
        })
        // Always allow access to onboarding page
        if (req.nextUrl.pathname === '/onboarding') return true
        // For other routes, require a valid token
        return !!token
      }
    },
    pages: {
      signIn: '/auth/signin',
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/wallet/:path*',
    '/explore/:path*',
    '/onboarding',
    '/dashboard'
  ]
} 
