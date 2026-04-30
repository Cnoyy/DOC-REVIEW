// Centralized API configuration
export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://api.docureview.com/api' 
    : 'http://localhost:3000/api',
  
  ENDPOINTS: {
    AI_SUGGESTION: '/ai-suggestion',
    // Add other endpoints as needed
  }
} as const;

// Helper function to get full API URL
export function getApiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}
