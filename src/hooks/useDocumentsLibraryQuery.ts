import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DocumentsLibraryService } from '@/service/documents-library';
import { useDocumentsLibraryStore } from '@/store/documents-library-store';
import { DOCUMENTS_LIBRARY_KEY } from '@/types/documents-library';

export function useDocumentsLibraryQuery() {
  const documents = useDocumentsLibraryStore((s) => s.documents);
  const setDocuments = useDocumentsLibraryStore((s) => s.setDocuments);

  const { data, isLoading, error } = useQuery({
    queryKey: DOCUMENTS_LIBRARY_KEY,
    queryFn: async () => {
      // Cache-first: skip API if store already has data
      const cached = useDocumentsLibraryStore.getState().documents;
      if (cached.length > 0) {
        return { success: true as const, data: cached, total: cached.length };
      }
      const result = await DocumentsLibraryService.getDocuments();
      setDocuments(result.data);
      return result;
    },
    // If store already has data provide it as initial data so no loading state
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

export function useDeleteDocumentMutation() {
  const queryClient = useQueryClient();
  const clearDocuments = useDocumentsLibraryStore((s) => s.clearDocuments);

  return useMutation({
    mutationFn: (documentId: string) => DocumentsLibraryService.deleteDocument(documentId),
    onSuccess: () => {
      // Clear cache so the next visit re-fetches
      clearDocuments();
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_LIBRARY_KEY });
    },
  });
}
