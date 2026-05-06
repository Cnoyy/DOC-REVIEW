import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { encryptedStorage } from '@/lib/encrypted-storage';
import { DocumentLibraryItem } from '@/types/documents-library';

interface DocumentsLibraryState {
  documents: DocumentLibraryItem[];
  setDocuments: (documents: DocumentLibraryItem[]) => void;
  clearDocuments: () => void;
}

export const useDocumentsLibraryStore = create<DocumentsLibraryState>()(
  persist(
    (set) => ({
      documents: [],
      setDocuments: (documents) => set({ documents }),
      clearDocuments: () => set({ documents: [] }),
    }),
    {
      name: 'doc-review:documents-library',
      storage: createJSONStorage(() => encryptedStorage),
    }
  )
);
