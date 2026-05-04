// Centralized API configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api',
  
  ENDPOINTS: {
    AI_SUGGESTION: '/ai-suggestion',
    SEND_TO_REVIEWER: '/send-to-reviewer',
    DOCUMENTS_LIBRARY: '/documents-library',
    DOCUMENT_DETAIL: '/document-detail',
    REVIEW_DOCUMENTS: '/Review-documents',
    REVIEWDOC_DETAIL: '/reviewdoc-detail',
    SENT_SUGGESTION: '/sent-suggestion',
    ACCEPT_BY_REVIEWER: '/accept-byreviewer',
    REJECT_BY_REVIEWER: '/reject-by-reviewer',
    SEARCH_HISTORY: '/search-history',
  }
} as const;

// Helper function to get full API URL
export function getApiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}
