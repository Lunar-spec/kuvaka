import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Protected routes - require authentication
    const protectedRoutes = ['/dashboard', '/chat']
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route)
    )

    // Auth routes - should redirect if already logged in  
    const authRoutes = ['/login', '/signup']
    const isAuthRoute = authRoutes.some(route =>
        pathname.startsWith(route)
    )

    // For protected routes, we'll handle auth check on client side
    // This middleware just ensures proper routing structure
    if (isProtectedRoute || isAuthRoute) {
        return NextResponse.next()
    }

    // Redirect root to login by default
    if (pathname === '/') {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        // Match all routes except static files and API routes
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}