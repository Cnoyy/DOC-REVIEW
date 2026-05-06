"use client";

import { NotFound } from "@/components/ui/404";
import { useAuthStore } from "@/store/auth-store";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated } = useAuthStore();

  // Show 404 page if not authenticated
  if (!isAuthenticated) {
    return <NotFound />;
  }

  // Render children if authenticated
  return <>{children}</>;
}
