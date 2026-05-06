import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { encryptedStorage } from '@/lib/encrypted-storage';
import { SearchHistoryItem } from '@/types/search-history';

interface SearchHistoryState {
  history: SearchHistoryItem[];
  setHistory: (history: SearchHistoryItem[]) => void;
  clearHistory: () => void;
}

export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set) => ({
      history: [],
      setHistory: (history) => set({ history }),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'doc-review:search-history',
      storage: createJSONStorage(() => encryptedStorage),
    }
  )
);
