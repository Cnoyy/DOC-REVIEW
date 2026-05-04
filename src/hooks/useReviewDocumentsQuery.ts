import { useQuery } from "@tanstack/react-query";
import { ReviewDocumentsService } from "@/service/review-documents";
import { REVIEW_DOCUMENTS_KEY, REVIEWDOC_DETAIL_KEY } from "@/types/review-documents";

export function useReviewDocumentsQuery() {
  const { data, isLoading, error } = useQuery({
    queryKey: REVIEW_DOCUMENTS_KEY,
    queryFn: () => ReviewDocumentsService.getDocuments(),
    select: (res) => res.data,
  });

  return {
    documents: data ?? [],
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
  };
}

export function useReviewDocDetailQuery(id: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: REVIEWDOC_DETAIL_KEY(id),
    queryFn: () => ReviewDocumentsService.getDocumentDetail(id),
    select: (res) => res.data,
    enabled: !!id,
  });

  return {
    detail: data,
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
  };
}
