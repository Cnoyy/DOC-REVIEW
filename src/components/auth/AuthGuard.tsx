"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NotFound } from "@/components/ui/404";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check localStorage for authentication status
    const checkAuth = () => {
      try {
        const authData = localStorage.getItem("auth-storage");
        if (authData) {
          const parsed = JSON.parse(authData);
          const isAuth = parsed.state?.isAuthenticated || false;
          setIsAuthenticated(isAuth);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    // Listen for storage changes (for cross-tab sync)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show 404 page if not authenticated
  if (!isAuthenticated) {
    return <NotFound />;
  }

  // Render children if authenticated
  return <>{children}</>;
}
