import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { encryptedStorage } from '@/lib/encrypted-storage';

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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },
      logout: () => {
        // Clear all localStorage stores
        if (typeof window !== 'undefined') {
          const storeKeys = [
            'doc-review:auth',
            'doc-review:documents-library',
            'doc-review:review-documents',
            'doc-review:search-history',
            'doc-review:upload-preload',
          ];
          storeKeys.forEach((key) => {
            localStorage.removeItem(key);
          });
        }
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'doc-review:auth',
      storage: createJSONStorage(() => encryptedStorage),
    }
  )
);
