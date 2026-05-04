import { useState, useCallback } from 'react';
import { DocumentDetail } from '@/types/documents-library';
import { DocumentDetailService } from '@/service/document-detail';

export function useDocumentDetail() {
  const [detail, setDetail] = useState<DocumentDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocumentDetail = useCallback(async (documentId: string) => {
    setLoading(true);
    setError(null);
    setDetail(null);

    try {
      const result = await DocumentDetailService.getDocumentDetail(documentId);

      if (result.success && result.data) {
        setDetail(result.data);
      } else {
        setError(result.message || 'Failed to load document detail');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load document detail';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearDetail = useCallback(() => {
    setDetail(null);
    setError(null);
  }, []);

  return {
    detail,
    loading,
    error,
    fetchDocumentDetail,
    clearDetail,
  };
}
