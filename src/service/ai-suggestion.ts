import { z } from 'zod';
import { AISuggestionResponse } from '@/types/ai-suggestion';
import { getApiUrl, API_CONFIG } from '@/lib/mockapi';
import { decryptClient } from '@/lib/crypto-client';
import { getMockAISuggestion } from '@/mock/data/ai-suggestion';

// ── Zod schema ─────────────────────────────────────────────────────────────────

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

// ── Service ────────────────────────────────────────────────────────────────────

export class AISuggestionService {
  static async getAISuggestions(documentName: string): Promise<AISuggestionResponse> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AI_SUGGESTION), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
        body: JSON.stringify({ documentName, requestType: 'ai_suggestion' }),
      });

      if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);

      const envelope: { data: string } = await response.json();
      const plaintext = await decryptClient(envelope.data);
      return AISuggestionResponseSchema.parse(JSON.parse(plaintext));
    } catch (error) {
      console.error('AI Suggestion API Error:', error);
      return getMockAISuggestion(documentName);
    }
  }
}

export default AISuggestionService;
