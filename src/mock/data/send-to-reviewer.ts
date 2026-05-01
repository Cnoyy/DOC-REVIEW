import { SendToReviewerResponse, EmailValidationResult } from '@/types/send-to-reviewer';

// Email validation helper
const validateEmail = (email: string): EmailValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email || email.trim() === '') {
    return {
      email,
      isValid: false,
      error: 'Email address is required'
    };
  }
  
  if (!emailRegex.test(email)) {
    return {
      email,
      isValid: false,
      error: 'Invalid email format'
    };
  }
  
  // Mock some specific email validation scenarios
  const invalidDomains = ['tempmail.com', 'fake.com', 'test.invalid'];
  const domain = email.split('@')[1];
  
  if (invalidDomains.some(invalidDomain => domain?.includes(invalidDomain))) {
    return {
      email,
      isValid: false,
      error: 'Email domain is not supported'
    };
  }
  
  return {
    email,
    isValid: true
  };
};

// Mock send to reviewer function
export const sendToReviewerMock = async (emails: string[], documentId?: string): Promise<SendToReviewerResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Validate all emails
  const validationResults = emails.map(email => validateEmail(email));
  const validEmails = validationResults.filter(result => result.isValid);
  const invalidEmails = validationResults.filter(result => !result.isValid);
  
  // If all emails are invalid, return error
  if (validEmails.length === 0) {
    return {
      success: false,
      message: 'No valid email addresses provided',
      errors: ['All email addresses failed validation'],
      data: {
        sentEmails: [],
        failedEmails: invalidEmails
      }
    };
  }
  
  // If some emails are invalid, return partial success
  if (invalidEmails.length > 0) {
    return {
      success: true,
      message: `Document sent to ${validEmails.length} reviewer(s). ${invalidEmails.length} email(s) failed validation.`,
      data: {
        sentEmails: validEmails.map(result => result.email),
        failedEmails: invalidEmails,
        documentId
      }
    };
  }
  
  // All emails are valid - return success
  return {
    success: true,
    message: `Document successfully sent to ${validEmails.length} reviewer(s)`,
    data: {
      sentEmails: validEmails.map(result => result.email),
      failedEmails: [],
      documentId
    }
  };
};

// Mock API error scenarios for testing
export const mockSendToReviewerErrors = {
  networkError: async (): Promise<SendToReviewerResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: false,
      message: 'Network error: Unable to connect to server',
      errors: ['Network connection failed']
    };
  },
  
  serverError: async (): Promise<SendToReviewerResponse> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      success: false,
      message: 'Server error: Internal server error occurred',
      errors: ['Internal server error']
    };
  }
};
