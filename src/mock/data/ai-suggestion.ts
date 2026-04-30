import { AISuggestionResponse } from '@/types/ai-suggestion';

export const mockAISuggestionData: Record<string, AISuggestionResponse> = {
  'DIPLOMA_CERTIFICATE.pdf': {
    summary: 'This document appears to be a DIPLOMA CERTIFICATE with standard formatting. The content includes educational credentials and professional achievements.',
    riskFlags: [
      'Document contains personal information',
      'Missing verification elements',
      'Standard formatting inconsistencies'
    ],
    recommendations: [
      'Verify document authenticity',
      'Add watermark for security',
      'Standardize formatting',
      'Include verification QR code'
    ],
    moreSuggestions: [
      'Consider adding digital signature',
      'Include blockchain verification',
      'Add timestamp metadata',
      'Implement multi-factor verification'
    ]
  },
  'TRANSCRIPT.pdf': {
    summary: 'Academic transcript showing course completion and grades. Document contains official university branding.',
    riskFlags: [
      'Contains sensitive student information',
      'Potential grade manipulation'
    ],
    recommendations: [
      'Verify with university registrar',
      'Add official seal',
      'Implement secure verification system'
    ],
    moreSuggestions: [
      'Add digital watermark',
      'Include blockchain verification',
      'Create secure sharing mechanism'
    ]
  },
  'CONTRACT.pdf': {
    summary: 'Legal contract between parties. Document contains signatures and legal terms.',
    riskFlags: [
      'Contains legal binding terms',
      'Requires careful review'
    ],
    recommendations: [
      'Legal verification recommended',
      'Add digital signatures',
      'Implement version control'
    ],
    moreSuggestions: [
      'Add timestamp verification',
      'Include witness signatures',
      'Create audit trail'
    ]
  },
  'REPORT.pdf': {
    summary: 'Business report with financial data and analysis. Contains company confidential information.',
    riskFlags: [
      'Contains sensitive business data',
      'Competitive information'
    ],
    recommendations: [
      'Implement access controls',
      'Add encryption',
      'Create secure distribution method'
    ],
    moreSuggestions: [
      'Add executive summary',
      'Include data visualization',
      'Implement approval workflow'
    ]
  }
};

export function getMockAISuggestion(documentName: string): AISuggestionResponse {
  // Extract base name without extension for fallback
  const baseName = documentName.replace(/\.[^/.]+$/, '');
  
  return mockAISuggestionData[documentName as keyof typeof mockAISuggestionData] || {
    summary: `${baseName} analysis completed successfully.`,
    riskFlags: [
      'Document requires verification',
      'Standard formatting needed'
    ],
    recommendations: [
      'Verify document authenticity',
      'Add security features'
    ],
    moreSuggestions: [
      'Consider digital verification',
      'Add watermark protection'
    ]
  };
}
