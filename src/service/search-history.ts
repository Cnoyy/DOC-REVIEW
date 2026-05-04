import { SearchHistoryResponse } from '@/types/search-history';
import { getApiUrl, API_CONFIG } from '@/lib/mockapi';
import { getSearchHistoryMock } from '@/mock/data/search-history';

export class SearchHistoryService {
  static async getSearchHistory(): Promise<SearchHistoryResponse> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.SEARCH_HISTORY), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data: SearchHistoryResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Search History API Error:', error);
      return getSearchHistoryMock();
    }
  }
}

export default SearchHistoryService;
