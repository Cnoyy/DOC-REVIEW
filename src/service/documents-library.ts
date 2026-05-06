import { z } from 'zod';
import { DocumentsLibraryResponse, DocumentDetailResponse } from '@/types/documents-library';
import { getApiUrl, API_CONFIG } from '@/lib/mockapi';
import { decryptClient } from '@/lib/crypto-client';
import { getDocumentsLibraryMock } from '@/mock/data/documents-library';
import { getDocumentDetailMock } from '@/mock/data/document-detail';

export interface DeleteResponse {
  success: boolean;
  message: string;
}

// ── Zod schemas ────────────────────────────────────────────────────────────────

const DocumentLibraryItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['PDF', 'DOCX', 'TXT']),
  uploadedDate: z.string(),
  reviewerStatus: z.enum(['approved', 'pending', 'rejected', 'reviewer-suggestion']),
  aiSuggested: z.boolean(),
  fileSize: z.string(),
  uploadedBy: z.string(),
});

const DocumentsLibraryResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(DocumentLibraryItemSchema),
  total: z.number(),
  message: z.string().optional(),
});

const RiskFlagSchema = z.object({
  message: z.string(),
  priority: z.enum(['high', 'medium', 'low']),
});

const ReviewerSuggestionItemSchema = z.object({
  section: z.string(),
  suggestion: z.string(),
});

const ReviewerSuggestionsSchema = z.object({
  reviewer: z.string(),
  email: z.string(),
  items: z.array(ReviewerSuggestionItemSchema),
});

const DocumentDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['PDF', 'DOCX', 'TXT']),
  uploadedDate: z.string(),
  reviewerStatus: z.enum(['approved', 'pending', 'rejected', 'reviewer-suggestion']),
  aiSuggested: z.boolean(),
  fileSize: z.string(),
  uploadedBy: z.string(),
  summary: z.string(),
  riskFlags: z.array(RiskFlagSchema),
  recommendations: z.array(z.string()),
  reviewerEmails: z.array(z.string()),
  lastReviewedDate: z.string().optional(),
  notes: z.string().optional(),
  documentContent: z.string().optional(),
  reviewerSuggestions: ReviewerSuggestionsSchema.optional(),
});

const DocumentDetailResponseSchema = z.object({
  success: z.boolean(),
  data: DocumentDetailSchema,
  message: z.string().optional(),
});

const DeleteResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

// ── Helpers ────────────────────────────────────────────────────────────────────

async function decryptResponse<T>(
  response: Response,
  schema: z.ZodType<T>
): Promise<T> {
  const envelope: { data: string } = await response.json();
  const plaintext = await decryptClient(envelope.data);
  return schema.parse(JSON.parse(plaintext));
}

// ── Service ────────────────────────────────────────────────────────────────────

export class DocumentsLibraryService {
  static async getDocuments(): Promise<DocumentsLibraryResponse> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.DOCUMENTS_LIBRARY), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
      });

      if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);
      return await decryptResponse(response, DocumentsLibraryResponseSchema);
    } catch (error) {
      console.error('Documents Library API Error:', error);
      return getDocumentsLibraryMock();
    }
  }

  static async getDocumentDetail(documentId: string): Promise<DocumentDetailResponse> {
    try {
      const response = await fetch(
        getApiUrl(`${API_CONFIG.ENDPOINTS.DOCUMENT_DETAIL}?id=${documentId}`),
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
          },
        }
      );

      if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);
      return await decryptResponse(response, DocumentDetailResponseSchema);
    } catch (error) {
      console.error('Document Detail API Error:', error);
      return getDocumentDetailMock(documentId);
    }
  }

  static async deleteDocument(documentId: string): Promise<DeleteResponse> {
    try {
      const response = await fetch('/api/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
        body: JSON.stringify({ documentId }),
      });

      if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);
      return await decryptResponse(response, DeleteResponseSchema);
    } catch (error) {
      console.error('Delete Document API Error:', error);
      return { success: true, message: 'Document deleted successfully (mock)' };
    }
  }
}

export default DocumentsLibraryService;
