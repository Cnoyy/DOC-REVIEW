import { useState, useCallback } from 'react';
import { DocumentLibraryItem } from '@/types/documents-library';
import { DocumentsLibraryService } from '@/service/documents-library';
import { useDocumentsLibraryStore } from '@/store/documents-library-store';

export function useDocumentsLibrary() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { documents, setDocuments, clearDocuments } = useDocumentsLibraryStore();

  const fetchDocuments = useCallback(async () => {
    // Use cached data if already loaded
    if (documents.length > 0) return;

    setLoading(true);
    setError(null);

    try {
      const result = await DocumentsLibraryService.getDocuments();

      if (result.success) {
        setDocuments(result.data);
      } else {
        setError(result.message || 'Failed to load documents');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load documents library';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [documents.length, setDocuments]);

  const deleteDocument = useCallback(
    async (documentId: string) => {
      setLoading(true);
      setError(null);

      try {
        const result = await DocumentsLibraryService.deleteDocument(documentId);
        
        if (result.success) {
          const updated = documents.filter((d: DocumentLibraryItem) => d.id !== documentId);
          setDocuments(updated);
          return { success: true, message: result.message };
        } else {
          setError(result.message || 'Failed to delete document');
          return { success: false, message: result.message || 'Failed to delete document' };
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete document';
        setError(message);
        return { success: false, message };
      } finally {
        setLoading(false);
      }
    },
    [documents, setDocuments]
  );

  const refreshDocuments = useCallback(async () => {
    clearDocuments();
    setLoading(true);
    setError(null);

    try {
      const result = await DocumentsLibraryService.getDocuments();
      if (result.success) {
        setDocuments(result.data);
      } else {
        setError(result.message || 'Failed to load documents');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load documents library';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [clearDocuments, setDocuments]);

  return {
    documents,
    loading,
    error,
    fetchDocuments,
    deleteDocument,
    refreshDocuments,
  };
}
