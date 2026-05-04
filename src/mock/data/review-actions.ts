import { ReviewActionResponse } from '@/types/review-documents';

export async function sendSuggestionMock(documentId: string, reviewerNotes: string): Promise<ReviewActionResponse> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    success: true,
    message: 'Review suggestion sent successfully to the document submitter.',
    data: {
      documentId,
      status: 'sent',
      updatedAt: new Date().toISOString(),
    },
  };
}

export async function acceptByReviewerMock(documentId: string, reviewerNotes?: string): Promise<ReviewActionResponse> {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    success: true,
    message: 'Document has been approved successfully.',
    data: {
      documentId,
      status: 'approved',
      updatedAt: new Date().toISOString(),
    },
  };
}

export async function rejectByReviewerMock(documentId: string, reviewerNotes?: string): Promise<ReviewActionResponse> {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    success: true,
    message: 'Document has been rejected. The submitter will be notified.',
    data: {
      documentId,
      status: 'rejected',
      updatedAt: new Date().toISOString(),
    },
  };
}
