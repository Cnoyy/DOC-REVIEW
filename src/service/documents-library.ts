import { DocumentsLibraryResponse } from '@/types/documents-library';
import { getApiUrl, API_CONFIG } from '@/lib/mockapi';
import { getDocumentsLibraryMock } from '@/mock/data/documents-library';

export class DocumentsLibraryService {
  static async getDocuments(): Promise<DocumentsLibraryResponse> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.DOCUMENTS_LIBRARY), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data: DocumentsLibraryResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Documents Library API Error:', error);
      return getDocumentsLibraryMock();
    }
  }
}

export default DocumentsLibraryService;
