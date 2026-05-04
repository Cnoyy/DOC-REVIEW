export type ReviewerStatus = 'approved' | 'pending' | 'rejected' | 'reviewer-suggestion';

export interface DocumentLibraryItem {
  id: string;
  name: string;
  type: 'PDF' | 'DOCX' | 'TXT';
  uploadedDate: string;
  reviewerStatus: ReviewerStatus;
  aiSuggested: boolean;
  fileSize: string;
  uploadedBy: string;
}

export interface DocumentsLibraryResponse {
  success: boolean;
  data: DocumentLibraryItem[];
  total: number;
  message?: string;
}

export interface DocumentDetailRiskFlag {
  message: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ReviewerSuggestionItem {
  section: string;
  suggestion: string;
}

export interface ReviewerSuggestions {
  reviewer: string;
  email: string;
  items: ReviewerSuggestionItem[];
}

export interface DocumentDetail {
  id: string;
  name: string;
  type: 'PDF' | 'DOCX' | 'TXT';
  uploadedDate: string;
  reviewerStatus: ReviewerStatus;
  aiSuggested: boolean;
  fileSize: string;
  uploadedBy: string;
  summary: string;
  riskFlags: DocumentDetailRiskFlag[];
  recommendations: string[];
  reviewerEmails: string[];
  lastReviewedDate?: string;
  notes?: string;
  documentContent?: string;
  reviewerSuggestions?: ReviewerSuggestions;
}

export interface DocumentDetailResponse {
  success: boolean;
  data: DocumentDetail;
  message?: string;
}

// TanStack Query keys
export const DOCUMENTS_LIBRARY_KEY = ["documents-library"] as const;
export const DOCUMENT_DETAIL_KEY = (id: string) => ["document-detail", id] as const;
