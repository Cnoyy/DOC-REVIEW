import { SearchHistoryItem, SearchHistoryResponse } from '@/types/search-history';

export const mockSearchHistory: SearchHistoryItem[] = [
  {
    id: 'sh-001',
    documentName: 'NDA_Software_Partnership_2024.pdf',
    documentSize: 1258291,
    documentType: 'application/pdf',
    searchedAt: '2024-12-10T09:30:00Z',
    aiSuggestion: {
      summary:
        'This document is a standard Non-Disclosure Agreement (NDA) between two parties regarding a potential software partnership. It outlines strict confidentiality obligations for a period of three years and specifies that all shared proprietary code remains the sole property of the disclosing party. Key clauses include a non-solicitation agreement and a defined dispute resolution process via arbitration.',
      riskFlags: [
        {
          message:
            'Section 7.3 contains an unlimited liability clause exposing the company to uncapped financial risk.',
          priority: 'high',
        },
        {
          message:
            'Auto-renewal clause (Section 2.4) requires 90-day advance notice — above industry standard of 30–60 days.',
          priority: 'medium',
        },
        {
          message: 'Governing law set to Delaware — favorable but confirm with legal counsel.',
          priority: 'low',
        },
      ],
      recommendations: [
        'Cap liability exposure in Section 7.3 to a defined maximum amount',
        'Reduce auto-renewal notice period to 30 days',
        'Add a mutual termination clause for cleaner exit options',
        'Clarify IP ownership for jointly developed work',
      ],
      moreSuggestions: [
        'Consider adding digital signatures for remote signing compliance',
        'Include a data breach notification clause',
        'Add a force majeure provision',
        'Implement a version control mechanism for future amendments',
      ],
    },
  },
  {
    id: 'sh-002',
    documentName: 'Employment_Contract_Senior_Dev.pdf',
    documentSize: 874320,
    documentType: 'application/pdf',
    searchedAt: '2024-12-08T14:15:00Z',
    aiSuggestion: {
      summary:
        'This is a standard employment contract for a senior software developer role. It includes compensation, benefits, intellectual property assignment, and a 6-month non-compete clause. The contract is generally well-structured but contains several clauses that may be overly restrictive compared to current market standards. The IP assignment clause is particularly broad and may affect the employee\'s personal projects.',
      riskFlags: [
        {
          message:
            'The non-compete clause (Section 12) spans 2 years post-employment — likely unenforceable in several jurisdictions.',
          priority: 'high',
        },
        {
          message:
            'IP assignment clause covers all inventions including those developed outside work hours — overly broad.',
          priority: 'medium',
        },
        {
          message:
            'At-will termination clause lacks a minimum notice period for senior roles.',
          priority: 'low',
        },
      ],
      recommendations: [
        'Reduce non-compete period to 6 months and narrow geographic scope',
        'Exclude personal projects from IP assignment unless they use company resources',
        'Add a minimum 30-day notice period for termination without cause',
        'Include severance terms for involuntary termination',
      ],
      moreSuggestions: [
        'Add a clear remote work policy section',
        'Include an annual performance review clause',
        'Specify equity vesting schedule if applicable',
        'Add a professional development budget clause',
      ],
    },
  },
  {
    id: 'sh-003',
    documentName: 'Vendor_Service_Agreement_Q4.docx',
    documentSize: 543210,
    documentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    searchedAt: '2024-12-05T11:00:00Z',
    aiSuggestion: {
      summary:
        'This vendor service agreement covers a 12-month engagement for cloud infrastructure management services. The contract includes SLA commitments, data handling responsibilities, and payment terms. While the scope of work is clearly defined, the liability and indemnification sections are imbalanced in favor of the vendor. The data processing addendum requires updates to align with current GDPR and CCPA requirements.',
      riskFlags: [
        {
          message:
            'Indemnification clause (Section 9) is one-sided — vendor bears no liability for service outages exceeding SLA thresholds.',
          priority: 'high',
        },
        {
          message:
            'Data processing addendum does not reference CCPA compliance — potential legal exposure for California operations.',
          priority: 'medium',
        },
        {
          message:
            'Payment terms (Net-60) are longer than typical — may cause cash flow concerns.',
          priority: 'low',
        },
      ],
      recommendations: [
        'Negotiate balanced indemnification with vendor liability caps for SLA breaches',
        'Update data processing addendum to include CCPA and GDPR Article 28 requirements',
        'Negotiate payment terms to Net-30',
        'Add a service credit mechanism for SLA violations',
      ],
      moreSuggestions: [
        'Include a disaster recovery and business continuity requirement',
        'Add a right-to-audit clause for security compliance',
        'Define escalation procedures for critical incidents',
        'Include a technology refresh obligation for outdated tooling',
      ],
    },
  },
];

export async function getSearchHistoryMock(): Promise<SearchHistoryResponse> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return {
    success: true,
    data: mockSearchHistory,
    total: mockSearchHistory.length,
  };
}
