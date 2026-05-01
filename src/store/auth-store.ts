import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

// Helper functions to manage cookies
const setAuthCookie = (user: User | null) => {
  if (user && typeof window !== 'undefined') {
    document.cookie = `auth-token=${user.id}; path=/; max-age=${60 * 60 * 24 * 7}; secure; samesite=strict`;
  }
};

const removeAuthCookie = () => {
  if (typeof window !== 'undefined') {
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => {
        setAuthCookie(user);
        set({ user, isAuthenticated: !!user });
      },
      logout: () => {
        removeAuthCookie();
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage", // name of the item in the storage (must be unique)
    }
  )
);
