import { useState, useCallback } from 'react';
import { SearchHistoryItem } from '@/types/search-history';
import { SearchHistoryService } from '@/service/search-history';

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await SearchHistoryService.getSearchHistory();

      if (result.success) {
        setHistory(result.data);
      } else {
        setError(result.message || 'Failed to load search history');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load search history');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    history,
    loading,
    error,
    fetchHistory,
  };
}
