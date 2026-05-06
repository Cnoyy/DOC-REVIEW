import { useQuery } from '@tanstack/react-query';
import { SearchHistoryService } from '@/service/search-history';
import { useSearchHistoryStore } from '@/store/search-history-store';
import { SEARCH_HISTORY_KEY } from '@/types/search-history';

export function useSearchHistoryQuery() {
  const history = useSearchHistoryStore((s) => s.history);
  const setHistory = useSearchHistoryStore((s) => s.setHistory);

  const { data, isLoading, error } = useQuery({
    queryKey: SEARCH_HISTORY_KEY,
    queryFn: async () => {
      // Cache-first: skip API if store already has data
      const cached = useSearchHistoryStore.getState().history;
      if (cached.length > 0) {
        return { success: true as const, data: cached, total: cached.length };
      }
      const result = await SearchHistoryService.getSearchHistory();
      setHistory(result.data);
      return result;
    },
    initialData:
      history.length > 0
        ? { success: true as const, data: history, total: history.length }
        : undefined,
    enabled: history.length === 0,
    staleTime: Infinity,
    select: (res) => res.data,
  });

  return {
    searchHistory: data ?? history,
    loading: isLoading && history.length === 0,
    error: error instanceof Error ? error.message : null,
  };
}
