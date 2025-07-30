import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

export async function authMiddleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);
    const pathname = request.nextUrl.pathname;
    
    const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/onboarding');

    // Only redirect users without session to login for protected routes
    // Let the pages handle onboarding logic themselves
    if (!sessionCookie && isProtectedRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/onboarding/:path*',
        
    ]
};