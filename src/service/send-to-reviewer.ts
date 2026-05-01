import { SendToReviewerResponse, SendToReviewerRequest } from '@/types/send-to-reviewer';
import { getApiUrl, API_CONFIG } from '@/lib/mockapi';
import { sendToReviewerMock } from '@/mock/data/send-to-reviewer';

export class SendToReviewerService {
  /**
   * Send document to reviewers via email
   */
  static async sendToReviewer(request: SendToReviewerRequest): Promise<SendToReviewerResponse> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.SEND_TO_REVIEWER), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data: SendToReviewerResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Send to Reviewer API Error:', error);
      // Fallback to mock data if API fails
      return sendToReviewerMock(request.emails, request.documentId);
    }
  }

  /**
   * Validate email addresses locally (optional client-side validation)
   */
  static validateEmails(emails: string[]): Array<{ email: string; isValid: boolean; error?: string }> {
    return emails.map(email => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!email || email.trim() === '') {
        return {
          email,
          isValid: false,
          error: 'Email address is required'
        };
      }
      
      if (!emailRegex.test(email)) {
        return {
          email,
          isValid: false,
          error: 'Invalid email format'
        };
      }
      
      return {
        email,
        isValid: true
      };
    });
  }
}

export default SendToReviewerService;
