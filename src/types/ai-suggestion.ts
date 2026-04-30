export interface AISuggestionResponse {
  summary: string;
  riskFlags: string[];
  recommendations: string[];
  moreSuggestions: string[];
}

export interface AISuggestionRequest {
  documentName: string;
  requestType: 'ai_suggestion';
}
