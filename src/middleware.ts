import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define the paths that require authentication
const protectedPaths = ['/dashboard'];

export function middleware(request: NextRequest) {
  // Check if the requested path is a protected route
  if (protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
    // Check for an authentication token (replace 'authToken' with your token name)
    const token = request.cookies.get('authToken');

    // If token is missing, redirect to sign-in page
    if (!token) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }

  // Allow the request to proceed if token is present or path is not protected
  return NextResponse.next();
}

// Define which paths should trigger the middleware
export const config = {
  matcher: ['/dashboard/:path*'],
};
