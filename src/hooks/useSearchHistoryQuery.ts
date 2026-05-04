import { useQuery } from "@tanstack/react-query";
import { SearchHistoryService } from "@/service/search-history";
import { SEARCH_HISTORY_KEY } from "@/types/search-history";

export function useSearchHistoryQuery() {
  const { data, isLoading, error } = useQuery({
    queryKey: SEARCH_HISTORY_KEY,
    queryFn: () => SearchHistoryService.getSearchHistory(),
    select: (res) => res.data,
  });

  return {
    searchHistory: data ?? [],
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
  };
}
