import { z } from 'zod';
import { ReviewDocumentsResponse, ReviewDocDetailResponse } from '@/types/review-documents';
import { getApiUrl, API_CONFIG } from '@/lib/mockapi';
import { decryptClient } from '@/lib/crypto-client';
import { getReviewDocumentsMock } from '@/mock/data/review-documents';
import { getReviewDocDetailMock } from '@/mock/data/reviewdoc-detail';

// ── Zod schemas ────────────────────────────────────────────────────────────────

const ReviewDocumentSchema = z.object({
  id: z.string(),
  name: z.string(),
  submittedBy: z.string(),
  submittedDate: z.string(),
  status: z.enum(['pending', 'approved', 'rejected', 'sent']),
  documentType: z.enum(['PDF', 'DOCX', 'TXT']),
  fileSize: z.string(),
  description: z.string(),
});

const ReviewDocumentsResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(ReviewDocumentSchema),
  total: z.number(),
  message: z.string().optional(),
});

const ReviewDocContentSchema = z.object({
  section: z.string(),
  text: z.string(),
});

const ReviewDocDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  submittedBy: z.string(),
  submittedDate: z.string(),
  status: z.enum(['pending', 'approved', 'rejected', 'sent']),
  documentType: z.enum(['PDF', 'DOCX', 'TXT']),
  fileSize: z.string(),
  description: z.string(),
  contents: z.array(ReviewDocContentSchema),
  tags: z.array(z.string()),
  reviewerEmail: z.string().optional(),
  reviewedDate: z.string().optional(),
  rejectionReason: z.string().optional(),
  suggestionContent: z.string().optional(),
  suggestionDate: z.string().optional(),
  suggesterEmail: z.string().optional(),
});

const ReviewDocDetailResponseSchema = z.object({
  success: z.boolean(),
  data: ReviewDocDetailSchema,
  message: z.string().optional(),
});

// ── Helpers ────────────────────────────────────────────────────────────────────

async function decryptResponse<T>(response: Response, schema: z.ZodType<T>): Promise<T> {
  const envelope: { data: string } = await response.json();
  const plaintext = await decryptClient(envelope.data);
  return schema.parse(JSON.parse(plaintext));
}

// ── Service ────────────────────────────────────────────────────────────────────

export class ReviewDocumentsService {
  static async getDocuments(): Promise<ReviewDocumentsResponse> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.REVIEW_DOCUMENTS), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
      });

      if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);
      return await decryptResponse(response, ReviewDocumentsResponseSchema);
    } catch (error) {
      console.error('Review Documents Service Error:', error);
      return getReviewDocumentsMock();
    }
  }

  static async getDocumentDetail(documentId: string): Promise<ReviewDocDetailResponse> {
    try {
      const url = `${getApiUrl(API_CONFIG.ENDPOINTS.REVIEWDOC_DETAIL)}?id=${encodeURIComponent(documentId)}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
      });

      if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);
      return await decryptResponse(response, ReviewDocDetailResponseSchema);
    } catch (error) {
      console.error('Review Doc Detail Service Error:', error);
      return getReviewDocDetailMock(documentId);
    }
  }
}

export default ReviewDocumentsService;
