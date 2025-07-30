import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

export async function authMiddleware(request: NextRequest) {
    console.log('🔒 Middleware called for:', request.nextUrl.pathname);
    
    const sessionCookie = getSessionCookie(request);
    console.log('🍪 Session cookie:', sessionCookie ? 'EXISTS' : 'NONE');

    const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/signup');
    const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') ||
        request.nextUrl.pathname.startsWith('/onboarding');

    console.log('📄 Page type:', { isAuthPage, isProtectedRoute });

    // Redirect users with session cookie away from auth pages (optimistic)
    if (sessionCookie && isAuthPage) {
        console.log('🔄 Redirecting user with session cookie away from auth page');
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Redirect users without session cookie to login (optimistic)
    if (!sessionCookie && isProtectedRoute) {
        console.log('🔄 Redirecting user without session cookie to login');
        return NextResponse.redirect(new URL('/login', request.url));
    }

    console.log('✅ Allowing request to proceed');
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/onboarding/:path*',
        '/login',
        '/signup'
    ]
};