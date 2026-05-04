import { useQuery } from "@tanstack/react-query";
import { DocumentsLibraryService } from "@/service/documents-library";
import { DOCUMENT_DETAIL_KEY } from "@/types/documents-library";

export function useDocumentDetailQuery(id: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: DOCUMENT_DETAIL_KEY(id),
    queryFn: () => DocumentsLibraryService.getDocumentDetail(id),
    select: (res) => res.data,
    enabled: !!id,
  });

  return {
    detail: data,
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
  };
}
