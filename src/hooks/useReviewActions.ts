import { useState, useCallback } from 'react';
import { ReviewActionResponse } from '@/types/review-documents';
import { ReviewActionsService } from '@/service/review-actions';

export function useReviewActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<ReviewActionResponse | null>(null);

  const sendSuggestion = useCallback(async (documentId: string, reviewerNotes: string) => {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const result = await ReviewActionsService.sendSuggestion({ documentId, reviewerNotes });
      setResponse(result);
      if (!result.success) setError(result.message);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to send suggestion';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const approveDocument = useCallback(async (documentId: string, reviewerNotes?: string) => {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const result = await ReviewActionsService.approveDocument({ documentId, reviewerNotes });
      setResponse(result);
      if (!result.success) setError(result.message);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to approve document';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const rejectDocument = useCallback(async (documentId: string, reviewerNotes?: string) => {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const result = await ReviewActionsService.rejectDocument({ documentId, reviewerNotes });
      setResponse(result);
      if (!result.success) setError(result.message);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to reject document';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResponse = useCallback(() => {
    setResponse(null);
    setError(null);
  }, []);

  return { loading, error, response, sendSuggestion, approveDocument, rejectDocument, clearResponse };
}
