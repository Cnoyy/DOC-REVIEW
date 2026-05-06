import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { encryptedStorage } from '@/lib/encrypted-storage';
import { ReviewDocument } from '@/types/review-documents';

interface ReviewDocumentsState {
  documents: ReviewDocument[];
  setDocuments: (documents: ReviewDocument[]) => void;
  clearDocuments: () => void;
}

export const useReviewDocumentsStore = create<ReviewDocumentsState>()(
  persist(
    (set) => ({
      documents: [],
      setDocuments: (documents) => set({ documents }),
      clearDocuments: () => set({ documents: [] }),
    }),
    {
      name: 'doc-review:review-documents',
      storage: createJSONStorage(() => encryptedStorage),
    }
  )
);
