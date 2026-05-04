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
