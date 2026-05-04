import { create } from 'zustand';
import { SearchHistoryItem } from '@/types/search-history';

interface SearchHistoryState {
  history: SearchHistoryItem[];
  setHistory: (history: SearchHistoryItem[]) => void;
  clearHistory: () => void;
}

export const useSearchHistoryStore = create<SearchHistoryState>((set) => ({
  history: [],
  setHistory: (history) => set({ history }),
  clearHistory: () => set({ history: [] }),
}));
