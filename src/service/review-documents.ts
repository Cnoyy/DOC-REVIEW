import { ReviewDocumentsResponse, ReviewDocDetailResponse } from '@/types/review-documents';
import { getApiUrl, API_CONFIG } from '@/lib/mockapi';
import { getReviewDocumentsMock } from '@/mock/data/review-documents';
import { getReviewDocDetailMock } from '@/mock/data/reviewdoc-detail';

export class ReviewDocumentsService {
  static async getDocuments(): Promise<ReviewDocumentsResponse> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.REVIEW_DOCUMENTS), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
      });

      if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);

      return await response.json();
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
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
      });

      if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);

      return await response.json();
    } catch (error) {
      console.error('Review Doc Detail Service Error:', error);
      return getReviewDocDetailMock(documentId);
    }
  }
}

export default ReviewDocumentsService;
