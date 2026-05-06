import { z } from 'zod';
import { SearchHistoryResponse } from '@/types/search-history';
import { getApiUrl, API_CONFIG } from '@/lib/mockapi';
import { decryptClient } from '@/lib/crypto-client';
import { getSearchHistoryMock } from '@/mock/data/search-history';

// ── Zod schemas ────────────────────────────────────────────────────────────────

const RiskFlagSchema = z.object({
  message: z.string(),
  priority: z.enum(['high', 'medium', 'low']),
});

const AISuggestionResponseSchema = z.object({
  summary: z.string(),
  riskFlags: z.array(RiskFlagSchema),
  recommendations: z.array(z.string()),
  moreSuggestions: z.array(z.string()),
});

const SearchHistoryItemSchema = z.object({
  id: z.string(),
  documentName: z.string(),
  documentSize: z.number(),
  documentType: z.string(),
  searchedAt: z.string(),
  aiSuggestion: AISuggestionResponseSchema,
});

const SearchHistoryResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(SearchHistoryItemSchema),
  total: z.number(),
  message: z.string().optional(),
});

// ── Helpers ────────────────────────────────────────────────────────────────────

async function decryptResponse<T>(response: Response, schema: z.ZodType<T>): Promise<T> {
  const envelope: { data: string } = await response.json();
  const plaintext = await decryptClient(envelope.data);
  return schema.parse(JSON.parse(plaintext));
}

// ── Service ────────────────────────────────────────────────────────────────────

export class SearchHistoryService {
  static async getSearchHistory(): Promise<SearchHistoryResponse> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.SEARCH_HISTORY), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
      });

      if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);
      return await decryptResponse(response, SearchHistoryResponseSchema);
    } catch (error) {
      console.error('Search History API Error:', error);
      return getSearchHistoryMock();
    }
  }
}

export default SearchHistoryService;
