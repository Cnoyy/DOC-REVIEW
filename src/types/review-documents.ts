export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'sent';

export interface ReviewDocument {
  id: string;
  name: string;
  submittedBy: string;
  submittedDate: string;
  status: ReviewStatus;
  documentType: 'PDF' | 'DOCX' | 'TXT';
  fileSize: string;
  description: string;
}

export interface ReviewDocumentsResponse {
  success: boolean;
  data: ReviewDocument[];
  total: number;
  message?: string;
}

export interface ReviewDocContent {
  section: string;
  text: string;
}

export interface ReviewDocDetail {
  id: string;
  name: string;
  submittedBy: string;
  submittedDate: string;
  status: ReviewStatus;
  documentType: 'PDF' | 'DOCX' | 'TXT';
  fileSize: string;
  description: string;
  contents: ReviewDocContent[];
  tags: string[];
  reviewerEmail?: string;
  reviewedDate?: string;
  rejectionReason?: string;
  suggestionContent?: string;
  suggestionDate?: string;
  suggesterEmail?: string;
}

export interface ReviewDocDetailResponse {
  success: boolean;
  data: ReviewDocDetail;
  message?: string;
}

export interface ReviewActionRequest {
  documentId: string;
  reviewerNotes?: string;
}

export interface ReviewActionResponse {
  success: boolean;
  message: string;
  data?: {
    documentId: string;
    status: ReviewStatus;
    updatedAt: string;
  };
}
