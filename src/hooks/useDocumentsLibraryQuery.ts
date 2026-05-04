import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DocumentsLibraryService } from "@/service/documents-library";
import { DOCUMENTS_LIBRARY_KEY } from "@/types/documents-library";

export function useDocumentsLibraryQuery() {
  const { data, isLoading, error } = useQuery({
    queryKey: DOCUMENTS_LIBRARY_KEY,
    queryFn: () => DocumentsLibraryService.getDocuments(),
    select: (res) => res.data,
  });

  return {
    documents: data ?? [],
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
  };
}

export function useDeleteDocumentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) =>
      DocumentsLibraryService.deleteDocument(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_LIBRARY_KEY });
    },
  });
}
