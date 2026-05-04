import { create } from 'zustand';
import { AISuggestionResponse } from '@/types/ai-suggestion';

export interface PreloadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploaded: boolean;
}

interface UploadPreloadState {
  preloadedFile: PreloadedFile | null;
  preloadedSuggestions: AISuggestionResponse | null;
  setPreload: (file: PreloadedFile, suggestions: AISuggestionResponse) => void;
  clearPreload: () => void;
}

export const useUploadPreloadStore = create<UploadPreloadState>((set) => ({
  preloadedFile: null,
  preloadedSuggestions: null,
  setPreload: (file, suggestions) =>
    set({ preloadedFile: file, preloadedSuggestions: suggestions }),
  clearPreload: () => set({ preloadedFile: null, preloadedSuggestions: null }),
}));
