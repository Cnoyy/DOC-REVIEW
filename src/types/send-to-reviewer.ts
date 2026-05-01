// Send to Reviewer API Types

export interface SendToReviewerRequest {
  emails: string[];
  documentId?: string;
  message?: string;
}

export interface EmailValidationResult {
  email: string;
  isValid: boolean;
  error?: string;
}

export interface SendToReviewerResponse {
  success: boolean;
  message: string;
  data?: {
    sentEmails: string[];
    failedEmails: EmailValidationResult[];
    documentId?: string;
  };
  errors?: string[];
}

export interface SendToReviewerError {
  code: 'VALIDATION_ERROR' | 'API_ERROR' | 'NETWORK_ERROR';
  message: string;
  details?: EmailValidationResult[];
}
