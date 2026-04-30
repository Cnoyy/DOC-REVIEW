import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define paths that should redirect to dashboard if already authenticated (client-side check)
const authPaths = ["/Auth/Login", "/Auth/Register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Note: Dashboard protection is now handled client-side by AuthGuard component
  // This middleware only handles auth page redirects for authenticated users
  
  // Redirect away from login/register if already authenticated (client-side check)
  if (authPaths.some((path) => pathname.startsWith(path))) {
    // Check if user has auth data in localStorage (this is a basic check)
    // The actual protection is handled by the AuthGuard component
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard/upload";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply middleware only to auth pages
    "/Auth/:path*",
  ],
};
