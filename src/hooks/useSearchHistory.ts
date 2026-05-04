import { useState, useCallback } from 'react';
import { SearchHistoryItem } from '@/types/search-history';
import { SearchHistoryService } from '@/service/search-history';
import { useSearchHistoryStore } from '@/store/search-history-store';

export function useSearchHistory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { history, setHistory, clearHistory } = useSearchHistoryStore();

  const fetchHistory = useCallback(async () => {
    // Use cached data if already loaded
    if (history.length > 0) return;

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
  }, [history.length, setHistory]);

  const refreshHistory = useCallback(async () => {
    clearHistory();
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
  }, [clearHistory, setHistory]);

  return {
    history,
    loading,
    error,
    fetchHistory,
    refreshHistory,
  };
}
