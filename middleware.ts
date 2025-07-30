import { authMiddleware } from './src/lib/auth-middleware';

export default authMiddleware;

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/onboarding/:path*',
    '/login',
    '/signup'
  ]
};