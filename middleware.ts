import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define paths that require authentication
const protectedPaths = ["/dashboard"];
// Define paths that should redirect to dashboard if already authenticated
const authPaths = ["/Auth/Login", "/Auth/Register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the user has our secure HTTP-only cookie set by the Server Action
  const hasAuthSession = request.cookies.has("auth_session");

  // Protect dashboard routes
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!hasAuthSession) {
      const url = request.nextUrl.clone();
      url.pathname = "/Auth/Login";
      return NextResponse.redirect(url);
    }
  }

  // Redirect away from login/register if already authenticated
  if (authPaths.some((path) => pathname.startsWith(path))) {
    if (hasAuthSession) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply middleware to these specific paths
    "/dashboard/:path*",
    "/Auth/:path*",
  ],
};
