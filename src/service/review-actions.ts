import { ReviewActionResponse, ReviewActionRequest } from '@/types/review-documents';
import { getApiUrl, API_CONFIG } from '@/lib/mockapi';
import { sendSuggestionMock, acceptByReviewerMock, rejectByReviewerMock } from '@/mock/data/review-actions';

export class ReviewActionsService {
  static async sendSuggestion(request: ReviewActionRequest): Promise<ReviewActionResponse> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.SENT_SUGGESTION), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);
      return await response.json();
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
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);
      return await response.json();
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
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Reject Document Service Error:', error);
      return rejectByReviewerMock(request.documentId, request.reviewerNotes);
    }
  }
}

export default ReviewActionsService;
