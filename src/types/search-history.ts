import { AISuggestionResponse } from './ai-suggestion';

export interface SearchHistoryItem {
  id: string;
  documentName: string;
  documentSize: number;
  documentType: string;
  searchedAt: string;
  aiSuggestion: AISuggestionResponse;
}

export interface SearchHistoryResponse {
  success: boolean;
  data: SearchHistoryItem[];
  total: number;
  message?: string;
}

// TanStack Query keys
export const SEARCH_HISTORY_KEY = ["search-history"] as const;
