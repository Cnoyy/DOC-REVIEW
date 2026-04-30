import { AISuggestionResponse } from '@/types/ai-suggestion';
import { getApiUrl, API_CONFIG } from '@/lib/mockapi';
import { getMockAISuggestion } from '@/mock/data/ai-suggestion';

export class AISuggestionService {
  /**
   * Get AI suggestions for uploaded document
   */
  static async getAISuggestions(documentName: string): Promise<AISuggestionResponse> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AI_SUGGESTION), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
        body: JSON.stringify({
          documentName,
          requestType: 'ai_suggestion'
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data: AISuggestionResponse = await response.json();
      return data;
    } catch (error) {
      console.error('AI Suggestion API Error:', error);
      // Fallback to mock data if API fails
      return getMockAISuggestion(documentName);
    }
  }
}

export default AISuggestionService;
