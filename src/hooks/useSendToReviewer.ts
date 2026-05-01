import { useState, useCallback } from 'react';
import { SendToReviewerResponse, SendToReviewerRequest } from '@/types/send-to-reviewer';
import { SendToReviewerService } from '@/service/send-to-reviewer';

export function useSendToReviewer() {
  const [response, setResponse] = useState<SendToReviewerResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendToReviewer = useCallback(async (emails: string[], documentId?: string, message?: string) => {
    if (!emails || emails.length === 0) {
      setError('Please enter at least one email address');
      return null;
    }

    // Filter out empty emails
    const validEmailInputs = emails.filter(email => email && email.trim() !== '');
    
    if (validEmailInputs.length === 0) {
      setError('Please enter valid email addresses');
      return null;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const request: SendToReviewerRequest = {
        emails: validEmailInputs,
        documentId,
        message
      };

      const result = await SendToReviewerService.sendToReviewer(request);
      setResponse(result);
      
      if (!result.success) {
        setError(result.message);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send document to reviewers';
      setError(errorMessage);
      setResponse(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResponse = useCallback(() => {
    setResponse(null);
    setError(null);
  }, []);

  const validateEmails = useCallback((emails: string[]) => {
    return SendToReviewerService.validateEmails(emails);
  }, []);

  return {
    response,
    loading,
    error,
    sendToReviewer,
    clearResponse,
    validateEmails
  };
}
