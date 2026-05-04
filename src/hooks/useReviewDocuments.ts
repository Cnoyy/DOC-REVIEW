import { useState, useCallback } from 'react';
import { ReviewDocDetail } from '@/types/review-documents';
import { ReviewDocumentsService } from '@/service/review-documents';
import { useReviewDocumentsStore } from '@/store/review-documents-store';

export function useReviewDocuments() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { documents, setDocuments, clearDocuments } = useReviewDocumentsStore();

  const fetchDocuments = useCallback(async () => {
    // Use cached data if already loaded
    if (documents.length > 0) return;

    setLoading(true);
    setError(null);

    try {
      const result = await ReviewDocumentsService.getDocuments();
      if (result.success) {
        setDocuments(result.data);
      } else {
        setError(result.message || 'Failed to load review documents');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load review documents');
    } finally {
      setLoading(false);
    }
  }, [documents.length, setDocuments]);

  const refreshDocuments = useCallback(async () => {
    clearDocuments();
    setLoading(true);
    setError(null);

    try {
      const result = await ReviewDocumentsService.getDocuments();
      if (result.success) {
        setDocuments(result.data);
      } else {
        setError(result.message || 'Failed to load review documents');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load review documents');
    } finally {
      setLoading(false);
    }
  }, [clearDocuments, setDocuments]);

  return { documents, loading, error, fetchDocuments, refreshDocuments };
}

export function useReviewDocDetail() {
  const [detail, setDetail] = useState<ReviewDocDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async (documentId: string) => {
    setLoading(true);
    setError(null);
    setDetail(null);

    try {
      const result = await ReviewDocumentsService.getDocumentDetail(documentId);
      if (result.success && result.data) {
        setDetail(result.data);
      } else {
        setError(result.message || 'Failed to load document detail');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load document detail');
    } finally {
      setLoading(false);
    }
  }, []);

  return { detail, loading, error, fetchDetail };
}
