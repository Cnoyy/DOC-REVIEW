'use client';

import type { StateStorage } from 'zustand/middleware';
import { encryptClient, decryptClient } from './crypto-client';

export const encryptedStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (typeof window === 'undefined') return null;
    const encrypted = localStorage.getItem(name);
    if (!encrypted) return null;
    try {
      return await decryptClient(encrypted);
    } catch {
      // Corrupted or unencrypted entry — clear it
      localStorage.removeItem(name);
      return null;
    }
  },

  setItem: async (name: string, value: string): Promise<void> => {
    if (typeof window === 'undefined') return;
    const encrypted = await encryptClient(value);
    localStorage.setItem(name, encrypted);
  },

  removeItem: (name: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(name);
  },
};
