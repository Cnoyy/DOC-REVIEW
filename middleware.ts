import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected dashboard routes
const protectedRoutes = ["/dashboard"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is a protected dashboard route
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    // Check for authentication token in cookies
    const token = request.cookies.get("auth-token");
    
    if (!token) {
      // Redirect to 404 page if no auth token
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
