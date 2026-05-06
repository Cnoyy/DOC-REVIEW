import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { encryptedStorage } from '@/lib/encrypted-storage';
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

export const useUploadPreloadStore = create<UploadPreloadState>()(
  persist(
    (set) => ({
      preloadedFile: null,
      preloadedSuggestions: null,
      setPreload: (file, suggestions) =>
        set({ preloadedFile: file, preloadedSuggestions: suggestions }),
      clearPreload: () => set({ preloadedFile: null, preloadedSuggestions: null }),
    }),
    {
      name: 'doc-review:upload-preload',
      storage: createJSONStorage(() => encryptedStorage),
    }
  )
);
