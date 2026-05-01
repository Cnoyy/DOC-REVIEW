export interface AISuggestionResponse {
  summary: string;
  riskFlags: RiskFlag[];
  recommendations: string[];
  moreSuggestions: string[];
}

export interface RiskFlag {
  message: string;
  priority: 'high' | 'medium' | 'low';
}

export interface AISuggestionRequest {
  documentName: string;
  requestType: 'ai_suggestion';
}
