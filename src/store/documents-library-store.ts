import { create } from 'zustand';
import { DocumentLibraryItem } from '@/types/documents-library';

interface DocumentsLibraryState {
  documents: DocumentLibraryItem[];
  setDocuments: (documents: DocumentLibraryItem[]) => void;
  clearDocuments: () => void;
}

export const useDocumentsLibraryStore = create<DocumentsLibraryState>((set) => ({
  documents: [],
  setDocuments: (documents) => set({ documents }),
  clearDocuments: () => set({ documents: [] }),
}));
