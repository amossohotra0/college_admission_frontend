import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('access_token')?.value;
  const userStr = request.cookies.get('user')?.value;
  
  let user = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      // Invalid user JSON
    }
  }

  // Public paths that don't require authentication
  const publicPaths = ['/auth/login', '/auth/register', '/landing'];
  
  // Check if the path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // If user is not authenticated and trying to access a protected route
  // Allow access to the root path and landing page
  if (!token && !isPublicPath && pathname !== '/') {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // If user is authenticated but trying to access auth pages
  if (token && isPublicPath) {
    // Redirect based on role
    if (user?.role?.role === 'applicant') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // Role-based access control
  if (token && user) {
    // Admin routes
    if (pathname.startsWith('/admin') && user.role.role === 'applicant') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    // Student routes
    if ((pathname.startsWith('/dashboard') || 
         pathname.startsWith('/profile') || 
         pathname.startsWith('/applications') || 
         pathname.startsWith('/payments') || 
         pathname.startsWith('/programs')) && 
        user.role.role !== 'applicant') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};