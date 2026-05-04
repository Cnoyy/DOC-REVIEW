import { useState, useCallback } from 'react';
import { AISuggestionResponse } from '@/types/ai-suggestion';
import { AISuggestionService } from '@/service/ai-suggestion';

export function useAISuggestions() {
  const [suggestions, setSuggestions] = useState<AISuggestionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAISuggestions = useCallback(async (documentName: string) => {
    if (!documentName.trim()) {
      setError('Please select a document first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await AISuggestionService.getAISuggestions(documentName);
      setSuggestions(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch AI suggestions');
      setSuggestions(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions(null);
    setError(null);
  }, []);

  const preloadSuggestions = useCallback((data: AISuggestionResponse) => {
    setSuggestions(data);
    setError(null);
  }, []);

  return {
    suggestions,
    loading,
    error,
    fetchAISuggestions,
    clearSuggestions,
    preloadSuggestions,
  };
}
