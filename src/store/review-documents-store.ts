import { create } from 'zustand';
import { ReviewDocument } from '@/types/review-documents';

interface ReviewDocumentsState {
  documents: ReviewDocument[];
  setDocuments: (documents: ReviewDocument[]) => void;
  clearDocuments: () => void;
}

export const useReviewDocumentsStore = create<ReviewDocumentsState>((set) => ({
  documents: [],
  setDocuments: (documents) => set({ documents }),
  clearDocuments: () => set({ documents: [] }),
}));
