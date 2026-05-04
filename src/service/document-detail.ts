import { DocumentDetailResponse } from '@/types/documents-library';
import { getApiUrl, API_CONFIG } from '@/lib/mockapi';
import { getDocumentDetailMock } from '@/mock/data/document-detail';

export class DocumentDetailService {
  static async getDocumentDetail(documentId: string): Promise<DocumentDetailResponse> {
    try {
      const url = `${getApiUrl(API_CONFIG.ENDPOINTS.DOCUMENT_DETAIL)}?id=${encodeURIComponent(documentId)}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data: DocumentDetailResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Document Detail API Error:', error);
      return getDocumentDetailMock(documentId);
    }
  }
}

export default DocumentDetailService;
