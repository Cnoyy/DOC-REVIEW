import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected dashboard routes
const protectedRoutes = ["/dashboard"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is a protected dashboard route
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    // Check for WorkOS auth_session cookie
    const authSession = request.cookies.get("auth_session");
    
    if (!authSession) {
      // Show 404 page if no WorkOS session
      const url = request.nextUrl.clone();
      url.pathname = "/404";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply middleware to dashboard routes
    "/dashboard/:path*",
  ],
};
