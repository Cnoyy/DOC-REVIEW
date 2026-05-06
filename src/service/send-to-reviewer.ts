import { z } from 'zod';
import { SendToReviewerResponse, SendToReviewerRequest } from '@/types/send-to-reviewer';
import { getApiUrl, API_CONFIG } from '@/lib/mockapi';
import { decryptClient } from '@/lib/crypto-client';
import { sendToReviewerMock } from '@/mock/data/send-to-reviewer';

// ── Zod schema ─────────────────────────────────────────────────────────────────

const EmailValidationResultSchema = z.object({
  email: z.string(),
  isValid: z.boolean(),
  error: z.string().optional(),
});

const SendToReviewerResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z
    .object({
      sentEmails: z.array(z.string()),
      failedEmails: z.array(EmailValidationResultSchema),
      documentId: z.string().optional(),
    })
    .optional(),
  errors: z.array(z.string()).optional(),
});

// ── Service ────────────────────────────────────────────────────────────────────

export class SendToReviewerService {
  static async sendToReviewer(request: SendToReviewerRequest): Promise<SendToReviewerResponse> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.SEND_TO_REVIEWER), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);

      const envelope: { data: string } = await response.json();
      const plaintext = await decryptClient(envelope.data);
      return SendToReviewerResponseSchema.parse(JSON.parse(plaintext));
    } catch (error) {
      console.error('Send to Reviewer API Error:', error);
      return sendToReviewerMock(request.emails, request.documentId);
    }
  }

  static validateEmails(emails: string[]): Array<{ email: string; isValid: boolean; error?: string }> {
    return emails.map((email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || email.trim() === '') {
        return { email, isValid: false, error: 'Email address is required' };
      }
      if (!emailRegex.test(email)) {
        return { email, isValid: false, error: 'Invalid email format' };
      }
      return { email, isValid: true };
    });
  }
}

export default SendToReviewerService;
