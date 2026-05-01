// Centralized API configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api',
  
  ENDPOINTS: {
    AI_SUGGESTION: '/ai-suggestion',
    SEND_TO_REVIEWER: '/send-to-reviewer',
    // Add other endpoints as needed
  }
} as const;

// Helper function to get full API URL
export function getApiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}
