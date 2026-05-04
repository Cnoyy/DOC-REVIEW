import { AISuggestionResponse } from '@/types/ai-suggestion';

export const mockAISuggestionData: Record<string, AISuggestionResponse> = {
  'DIPLOMA_CERTIFICATE.pdf': {
    summary: 'This document is a standard Non-Disclosure Agreement (NDA) between two parties regarding a potential software partnership. It outlines strict confidentiality obligations for a period of three years and specifies that all shared proprietary code remains the sole property of the disclosing party. Key clauses include a non-solicitation agreement and a defined dispute resolution process via arbitration.',
    riskFlags: [
      { message: 'Section 7.3 contains an unlimited liability clause exposing the company to uncapped financial risk.', priority: 'high' },
      { message: 'Auto-renewal clause (Section 2.4) requires 90-day advance notice — above industry standard of 30–60 days.', priority: 'medium' },
      { message: 'Governing law set to Delaware — favorable but confirm with legal counsel.', priority: 'low' }
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
    summary: 'This document is a standard Non-Disclosure Agreement (NDA) between two parties regarding a potential software partnership. It outlines strict confidentiality obligations for a period of three years and specifies that all shared proprietary code remains the sole property of the disclosing party. Key clauses include a non-solicitation agreement and a defined dispute resolution process via arbitration.',
    riskFlags: [
      { message: 'Section 7.3 contains an unlimited liability clause exposing the company to uncapped financial risk.', priority: 'high' },
      { message: 'Auto-renewal clause (Section 2.4) requires 90-day advance notice — above industry standard of 30–60 days.', priority: 'medium' },
      { message: 'Governing law set to Delaware — favorable but confirm with legal counsel.', priority: 'low' }
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
    summary: 'This document is a standard Non-Disclosure Agreement (NDA) between two parties regarding a potential software partnership. It outlines strict confidentiality obligations for a period of three years and specifies that all shared proprietary code remains the sole property of the disclosing party. Key clauses include a non-solicitation agreement and a defined dispute resolution process via arbitration.',
    riskFlags: [
      { message: 'Section 7.3 contains an unlimited liability clause exposing the company to uncapped financial risk.', priority: 'high' },
      { message: 'Auto-renewal clause (Section 2.4) requires 90-day advance notice — above industry standard of 30–60 days.', priority: 'medium' },
      { message: 'Governing law set to Delaware — favorable but confirm with legal counsel.', priority: 'low' }
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
    summary: 'This document is a standard Non-Disclosure Agreement (NDA) between two parties regarding a potential software partnership. It outlines strict confidentiality obligations for a period of three years and specifies that all shared proprietary code remains the sole property of the disclosing party. Key clauses include a non-solicitation agreement and a defined dispute resolution process via arbitration.',
    riskFlags: [
      { message: 'Section 7.3 contains an unlimited liability clause exposing the company to uncapped financial risk.', priority: 'high' },
      { message: 'Auto-renewal clause (Section 2.4) requires 90-day advance notice — above industry standard of 30–60 days.', priority: 'medium' },
      { message: 'Governing law set to Delaware — favorable but confirm with legal counsel.', priority: 'low' }
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

export function formatAISuggestionAsReviewNote(suggestion: AISuggestionResponse): string {
  const lines: string[] = [];

  lines.push('=== AI-Generated Review Notes ===\n');
  lines.push(`SUMMARY\n${suggestion.summary}\n`);

  if (suggestion.riskFlags.length > 0) {
    lines.push('RISK FLAGS');
    suggestion.riskFlags.forEach((flag, i) => {
      lines.push(`${i + 1}. [${flag.priority.toUpperCase()}] ${flag.message}`);
    });
    lines.push('');
  }

  if (suggestion.recommendations.length > 0) {
    lines.push('RECOMMENDATIONS');
    suggestion.recommendations.forEach((rec, i) => {
      lines.push(`${i + 1}. ${rec}`);
    });
    lines.push('');
  }

  if (suggestion.moreSuggestions.length > 0) {
    lines.push('ADDITIONAL SUGGESTIONS');
    suggestion.moreSuggestions.forEach((s, i) => {
      lines.push(`${i + 1}. ${s}`);
    });
    lines.push('');
  }

  lines.push('--- Add your manual review notes below ---\n');
  return lines.join('\n');
}

export function getMockAISuggestion(documentName: string): AISuggestionResponse {
  // Extract base name without extension for fallback
  const baseName = documentName.replace(/\.[^/.]+$/, '');
  
  return mockAISuggestionData[documentName as keyof typeof mockAISuggestionData] || {
    summary: 'This document is a standard Non-Disclosure Agreement (NDA) between two parties regarding a potential software partnership. It outlines strict confidentiality obligations for a period of three years and specifies that all shared proprietary code remains the sole property of the disclosing party. Key clauses include a non-solicitation agreement and a defined dispute resolution process via arbitration.',
    riskFlags: [
      { message: 'Section 7.3 contains an unlimited liability clause exposing the company to uncapped financial risk.', priority: 'high' },
      { message: 'Auto-renewal clause (Section 2.4) requires 90-day advance notice — above industry standard of 30–60 days.', priority: 'medium' },
      { message: 'Governing law set to Delaware — favorable but confirm with legal counsel.', priority: 'low' }
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
