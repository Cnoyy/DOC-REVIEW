import { z } from 'zod';
import { ReviewActionResponse, ReviewActionRequest } from '@/types/review-documents';
import { getApiUrl, API_CONFIG } from '@/lib/mockapi';
import { decryptClient } from '@/lib/crypto-client';
import { sendSuggestionMock, acceptByReviewerMock, rejectByReviewerMock } from '@/mock/data/review-actions';

// ── Zod schema ─────────────────────────────────────────────────────────────────

const ReviewActionResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z
    .object({
      documentId: z.string(),
      status: z.enum(['pending', 'approved', 'rejected', 'sent']),
      updatedAt: z.string(),
    })
    .optional(),
});

// ── Helpers ────────────────────────────────────────────────────────────────────

async function decryptResponse<T>(response: Response, schema: z.ZodType<T>): Promise<T> {
  const envelope: { data: string } = await response.json();
  const plaintext = await decryptClient(envelope.data);
  return schema.parse(JSON.parse(plaintext));
}

// ── Service ────────────────────────────────────────────────────────────────────

export class ReviewActionsService {
  static async sendSuggestion(request: ReviewActionRequest): Promise<ReviewActionResponse> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.SENT_SUGGESTION), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);
      return await decryptResponse(response, ReviewActionResponseSchema);
    } catch (error) {
      console.error('Send Suggestion Service Error:', error);
      return sendSuggestionMock(request.documentId, request.reviewerNotes || '');
    }
  }

  static async approveDocument(request: ReviewActionRequest): Promise<ReviewActionResponse> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.ACCEPT_BY_REVIEWER), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);
      return await decryptResponse(response, ReviewActionResponseSchema);
    } catch (error) {
      console.error('Approve Document Service Error:', error);
      return acceptByReviewerMock(request.documentId, request.reviewerNotes);
    }
  }

  static async rejectDocument(request: ReviewActionRequest): Promise<ReviewActionResponse> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.REJECT_BY_REVIEWER), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);
      return await decryptResponse(response, ReviewActionResponseSchema);
    } catch (error) {
      console.error('Reject Document Service Error:', error);
      return rejectByReviewerMock(request.documentId, request.reviewerNotes);
    }
  }
}

export default ReviewActionsService;
