import { useQuery } from '@tanstack/react-query';
import { ReviewDocumentsService } from '@/service/review-documents';
import { useReviewDocumentsStore } from '@/store/review-documents-store';
import { REVIEW_DOCUMENTS_KEY, REVIEWDOC_DETAIL_KEY } from '@/types/review-documents';

export function useReviewDocumentsQuery() {
  const documents = useReviewDocumentsStore((s) => s.documents);
  const setDocuments = useReviewDocumentsStore((s) => s.setDocuments);

  const { data, isLoading, error } = useQuery({
    queryKey: REVIEW_DOCUMENTS_KEY,
    queryFn: async () => {
      // Cache-first: skip API if store already has data
      const cached = useReviewDocumentsStore.getState().documents;
      if (cached.length > 0) {
        return { success: true as const, data: cached, total: cached.length };
      }
      const result = await ReviewDocumentsService.getDocuments();
      setDocuments(result.data);
      return result;
    },
    initialData:
      documents.length > 0
        ? { success: true as const, data: documents, total: documents.length }
        : undefined,
    enabled: documents.length === 0,
    staleTime: Infinity,
    select: (res) => res.data,
  });

  return {
    documents: data ?? documents,
    loading: isLoading && documents.length === 0,
    error: error instanceof Error ? error.message : null,
  };
}

export function useReviewDocDetailQuery(id: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: REVIEWDOC_DETAIL_KEY(id),
    queryFn: () => ReviewDocumentsService.getDocumentDetail(id),
    select: (res) => res.data,
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  return {
    detail: data,
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
  };
}
