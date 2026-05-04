import { ReviewDocDetail, ReviewDocDetailResponse } from '@/types/review-documents';
import { mockReviewDocuments } from './review-documents';

const mockReviewDocDetails: Record<string, ReviewDocDetail> = {
  'rev-001': {
    id: 'rev-001',
    name: 'Employment_Contract_2024.pdf',
    submittedBy: 'Shinoy',
    submittedDate: '2024-11-15',
    status: 'pending',
    documentType: 'PDF',
    fileSize: '1.2 MB',
    description: 'Employment contract for new software engineer hire. Requires legal review of non-compete and IP clauses.',
    tags: ['HR', 'Legal', 'Employment', 'Urgent'],
    contents: [
      {
        section: 'Parties',
        text: 'This Employment Agreement ("Agreement") is entered into as of January 1, 2025, between TechCorp Inc., a Delaware corporation ("Company"), and the individual named on the signature page ("Employee").',
      },
      {
        section: 'Position and Duties',
        text: 'Employee is hired as a Senior Software Engineer and will report to the VP of Engineering. Employee agrees to devote their full business time and effort to performing duties as reasonably assigned. The role may require occasional travel not exceeding 10% of working time.',
      },
      {
        section: 'Compensation',
        text: 'Base salary of $145,000 per year, paid bi-weekly. Employee is eligible for an annual performance bonus of up to 15% of base salary, subject to company and individual performance targets. Equity grant of 10,000 RSUs vesting over 4 years with a 1-year cliff.',
      },
      {
        section: 'Non-Compete Clause (Section 8.2)',
        text: 'For a period of twenty-four (24) months following termination of employment, Employee agrees not to engage in any business activity that competes directly with the Company within a fifty (50) mile radius of any Company office location or in any market where the Company conducts business.',
      },
      {
        section: 'Intellectual Property',
        text: 'Employee assigns to the Company all right, title, and interest in any inventions, works of authorship, or other intellectual property developed during employment, including work performed outside of business hours using Company resources or information.',
      },
      {
        section: 'Dispute Resolution',
        text: 'Any dispute arising out of or related to this Agreement shall be resolved through binding arbitration under the rules of the American Arbitration Association. Employee waives the right to participate in class-action proceedings.',
      },
    ],
  },
  'rev-002': {
    id: 'rev-002',
    name: 'NDA_Partnership_Agreement.docx',
    submittedBy: 'Sarah Johnson',
    submittedDate: '2024-11-20',
    status: 'pending',
    documentType: 'DOCX',
    fileSize: '845 KB',
    description: 'Non-disclosure agreement for the upcoming TechCorp partnership. Urgent review requested.',
    tags: ['Legal', 'NDA', 'Partnership', 'Confidential'],
    contents: [
      {
        section: 'Purpose',
        text: 'This Non-Disclosure Agreement ("Agreement") is entered into between TechCorp Inc. ("Disclosing Party") and PartnerVentures LLC ("Receiving Party") to protect confidential information shared during evaluation of a potential joint venture opportunity.',
      },
      {
        section: 'Definition of Confidential Information',
        text: 'Confidential Information includes all technical, financial, business, and operational data disclosed in any form, including but not limited to: source code, product roadmaps, financial projections, customer lists, pricing models, and proprietary algorithms.',
      },
      {
        section: 'Confidentiality Obligations',
        text: 'The Receiving Party agrees to: (a) maintain strict confidentiality; (b) use information solely for evaluation purposes; (c) not disclose to third parties without written consent; (d) implement security measures at least equivalent to those used for its own confidential information.',
      },
      {
        section: 'Term (Section 2.4)',
        text: 'This Agreement shall remain in effect for three (3) years from the Effective Date. Either party may terminate by providing ninety (90) days written notice. Confidentiality obligations survive termination for an additional two (2) years.',
      },
      {
        section: 'Liability (Section 7.3)',
        text: 'In the event of a breach, the breaching party shall be liable for all direct, indirect, and consequential damages without limitation. This includes lost profits, reputational damage, and costs of remediation, regardless of whether such damages were foreseeable at the time of agreement.',
      },
    ],
  },
  'rev-003': {
    id: 'rev-003',
    name: 'Vendor_Agreement_CloudServices.pdf',
    submittedBy: 'Michael Chen',
    submittedDate: '2024-11-25',
    status: 'pending',
    documentType: 'PDF',
    fileSize: '2.1 MB',
    description: 'Cloud infrastructure vendor agreement. Key SLA and GDPR compliance sections need attention.',
    tags: ['Vendor', 'Cloud', 'SLA', 'GDPR', 'Infrastructure'],
    contents: [
      {
        section: 'Services',
        text: 'CloudServices Ltd agrees to provide managed cloud infrastructure services including compute resources, object storage, managed databases, and 24/7 monitoring. Services will be provisioned within the EU-West-1 and US-East-1 regions.',
      },
      {
        section: 'Service Level Agreement (Section 5.1)',
        text: "Vendor guarantees 99.9% uptime measured monthly. In the event of downtime exceeding the SLA, TechCorp is entitled to service credits of 10% of the monthly fee per hour of excess downtime, capped at one month's total fees. Credits are the sole remedy for SLA breaches.",
      },
      {
        section: 'Data Processing (GDPR)',
        text: 'Vendor acts as a Data Processor on behalf of TechCorp as Data Controller. Vendor will process personal data only on documented instructions. Vendor currently employs the following sub-processors: [List to be provided upon request].',
      },
      {
        section: 'Payment Terms',
        text: 'Monthly fees of $12,500 are due within 30 days of invoice. Vendor reserves the right to suspend service with 5 business days notice for invoices unpaid beyond 30 days. A 1.5% monthly late fee applies to overdue balances.',
      },
      {
        section: 'Term and Termination',
        text: 'Initial term of twenty-four (24) months. Auto-renews for 12-month periods unless terminated with 60 days written notice. Early termination by TechCorp incurs a fee equal to 3 months of remaining contract value.',
      },
    ],
  },
  'rev-004': {
    id: 'rev-004',
    name: 'Q3_Financial_Report.pdf',
    submittedBy: 'Emily Davis',
    submittedDate: '2024-10-30',
    status: 'approved',
    documentType: 'PDF',
    fileSize: '3.4 MB',
    description: 'Q3 financial summary report approved after reconciliation of revenue recognition methodology.',
    tags: ['Finance', 'Report', 'Q3', 'Approved'],
    reviewerEmail: 'finance-lead@techcorp.com',
    reviewedDate: '2024-11-05T14:30:00',
    contents: [
      {
        section: 'Revenue Summary',
        text: 'Total revenue for Q3 2024 reached $8.4M, representing a 12% year-over-year increase. SaaS subscriptions contributed $6.1M (73%) and professional services contributed $2.3M (27%).',
      },
      {
        section: 'Expense Analysis',
        text: 'Operating expenses totalled $5.9M for the quarter, in line with budget. R&D spend increased by 18% due to new product development initiatives. Sales and marketing expense grew by 9% driven by expansion into new geographic markets.',
      },
      {
        section: 'Cash Flow',
        text: 'Operating cash flow was $2.1M positive. The company maintained a cash reserve of $11.2M at quarter end, providing approximately 14 months of runway at current burn rate.',
      },
      {
        section: 'Year-over-Year Comparison',
        text: 'Compared to Q3 2023, revenue grew 12%, gross margin improved from 68% to 71%, and EBITDA margin improved from 14% to 19%. Customer count increased from 340 to 412 enterprise accounts.',
      },
    ],
  },
  'rev-005': {
    id: 'rev-005',
    name: 'Compliance_Policy_2024.txt',
    submittedBy: 'Robert Wilson',
    submittedDate: '2024-11-01',
    status: 'approved',
    documentType: 'TXT',
    fileSize: '128 KB',
    description: 'Updated compliance policy covering GDPR and SOC 2 Type II requirements. Approved with minor notes.',
    tags: ['Compliance', 'GDPR', 'SOC2', 'Policy'],
    reviewerEmail: 'compliance-lead@techcorp.com',
    reviewedDate: '2024-11-08T10:15:00',
    contents: [
      {
        section: 'Data Protection',
        text: 'TechCorp maintains a comprehensive data protection programme aligned with GDPR requirements. All personal data is processed lawfully, fairly, and transparently. Data subjects may exercise their rights including access, rectification, erasure, and portability.',
      },
      {
        section: 'SOC 2 Type II Controls',
        text: 'TechCorp has implemented and maintains controls across the Trust Service Criteria: Security, Availability, Processing Integrity, Confidentiality, and Privacy. Annual third-party audits confirm continued compliance.',
      },
      {
        section: 'Employee Obligations',
        text: 'All employees must complete annual compliance training. Violations of this policy may result in disciplinary action up to and including termination. Employees should report concerns through the ethics hotline.',
      },
      {
        section: 'Review Schedule',
        text: 'This policy is reviewed annually by the Compliance Team and updated as necessary to reflect changes in applicable law and business practices.',
      },
    ],
  },
  'rev-006': {
    id: 'rev-006',
    name: 'IP_Assignment_Agreement.docx',
    submittedBy: 'David Thompson',
    submittedDate: '2024-11-10',
    status: 'rejected',
    documentType: 'DOCX',
    fileSize: '678 KB',
    description: 'IP assignment agreement rejected due to missing moral rights waiver and inadequate consideration clause.',
    tags: ['Legal', 'IP', 'Assignment'],
    reviewerEmail: 'legal-lead@techcorp.com',
    reviewedDate: '2024-11-14T16:45:00',
    rejectionReason: 'Document rejected due to two critical deficiencies: (1) No moral rights waiver is included — this is required in several jurisdictions for a valid IP transfer; (2) Consideration of $1.00 is legally inadequate and may render the assignment voidable. Additionally, there is no carve-out for contractor pre-existing IP, creating overreach risk. Resubmit with these items addressed.',
    contents: [
      {
        section: 'Assignment',
        text: 'Contractor hereby assigns to TechCorp all right, title, and interest in and to all Deliverables, including all intellectual property rights therein, in perpetuity throughout the universe.',
      },
      {
        section: 'Consideration',
        text: 'In consideration of the mutual covenants set forth herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged (the sum of ONE DOLLAR ($1.00)), Contractor assigns all IP rights to TechCorp.',
      },
      {
        section: 'Pre-Existing IP',
        text: 'This agreement covers all work created during the engagement period. No carve-out is provided for contractor pre-existing intellectual property or tools.',
      },
    ],
  },
  'rev-007': {
    id: 'rev-007',
    name: 'Project_Proposal_v2.docx',
    submittedBy: 'Lisa Martinez',
    submittedDate: '2024-11-28',
    status: 'rejected',
    documentType: 'DOCX',
    fileSize: '512 KB',
    description: 'Project proposal rejected — missing contingency budget and milestone buffers. Revision requested.',
    tags: ['Project', 'Proposal', 'Budget'],
    reviewerEmail: 'pmo@techcorp.com',
    reviewedDate: '2024-12-02T11:00:00',
    rejectionReason: 'The proposal lacks a contingency budget (industry standard is 10–15% of total project cost) and milestone timelines have no buffer for delays. The success metrics are vague and do not include measurable KPIs. Please revise and resubmit with a contingency reserve, realistic milestone buffers, and clearly defined success criteria.',
    contents: [
      {
        section: 'Project Overview',
        text: 'This proposal outlines the development of a new client-facing analytics dashboard for the enterprise segment. The project scope includes data ingestion pipelines, visualisation layer, and a self-service reporting module.',
      },
      {
        section: 'Budget',
        text: 'Total project budget requested: $150,000 over 6 months. Breakdown: Engineering — $90,000; Design — $20,000; QA and Testing — $15,000; Infrastructure — $10,000; Project Management — $15,000.',
      },
      {
        section: 'Timeline',
        text: 'Month 1–2: Requirements and architecture. Month 3–4: Core development. Month 5: Testing and QA. Month 6: Deployment and handover. All milestones assume full resource availability.',
      },
      {
        section: 'Success Metrics',
        text: 'The project will be considered successful when the dashboard is live and users can generate reports. Adoption targets will be confirmed post-launch.',
      },
    ],
  },
  'rev-008': {
    id: 'rev-008',
    name: 'Service_Level_Agreement_v3.pdf',
    submittedBy: 'James Anderson',
    submittedDate: '2024-11-05',
    status: 'sent',
    documentType: 'PDF',
    fileSize: '1.8 MB',
    description: 'SLA for managed IT services. Review feedback sent back to submitter with suggested amendments.',
    tags: ['SLA', 'IT Services', 'Operations'],
    suggesterEmail: 'reviewer@techcorp.com',
    suggestionDate: '2024-11-10T09:30:00',
    suggestionContent: `After reviewing the SLA document, I have identified the following key points for consideration:

1. UPTIME GUARANTEE — Section 2: The current 99.5% monthly uptime commitment translates to approximately 3.6 hours of permitted downtime per month. For a production environment, I recommend negotiating this to 99.9%, which reduces permitted downtime to 43 minutes per month. This is now the industry standard for managed IT services.

2. TIER 1 RESPONSE TIME — Section 4.1: A 4-hour initial response for a complete system outage is too slow for a business-critical service. Best practice is 30–60 minutes. I strongly recommend requesting a revision to a 1-hour response SLA with a named on-call escalation matrix.

3. SERVICE CREDITS — Section 5: The credit structure caps at 30% of monthly fees, which is insufficient to offset business impact from prolonged outages. Consider requesting credits up to 50% or a right to terminate for persistent SLA breaches.

4. REPORTING — Section 6: Monthly reports are standard but consider requesting weekly dashboards during the first 90 days to establish baseline performance metrics.

Please review these suggestions and resubmit with the vendor's responses to each point.`,
    contents: [
      {
        section: 'Scope of Services',
        text: "ManagedIT Corp will provide Level 1, 2, and 3 helpdesk support, network monitoring, patch management, and quarterly security assessments for TechCorp's entire IT infrastructure across 3 office locations and remote workforce.",
      },
      {
        section: 'Response Times',
        text: 'Critical incidents (P1): 30-minute response, 4-hour resolution. High (P2): 2-hour response, 8-hour resolution. Medium (P3): 4-hour response, 24-hour resolution. Low (P4): next business day response, 5-day resolution.',
      },
      {
        section: 'Reporting',
        text: 'Monthly service reports will be delivered by the 5th of each month covering: ticket volume, resolution rates, SLA compliance, recurring issues, and recommendations. Quarterly business reviews will be conducted in person.',
      },
    ],
  },
  'rev-009': {
    id: 'rev-009',
    name: 'Data_Processing_Agreement.pdf',
    submittedBy: 'Priya Nair',
    submittedDate: '2024-11-12',
    status: 'sent',
    documentType: 'PDF',
    fileSize: '950 KB',
    description: 'GDPR data processing agreement. Detailed review notes sent with sub-processor disclosure requirements.',
    tags: ['GDPR', 'Data Processing', 'Compliance', 'Legal'],
    suggesterEmail: 'legal-reviewer@techcorp.com',
    suggestionDate: '2024-11-18T14:00:00',
    suggestionContent: `Detailed review of the Data Processing Agreement is complete. The following amendments are recommended before execution:

1. SUB-PROCESSOR DISCLOSURE: The agreement references sub-processors but does not include a complete list. Under GDPR Article 28(2), the data controller must authorise sub-processors in advance. Request a full list of sub-processors with their roles, locations, and data access scope as an addendum.

2. DATA SUBJECT RIGHTS: The current clause on handling data subject requests (Section 6) gives the processor 30 days to respond. GDPR requires responses within 30 calendar days from receipt, with the possibility of a 2-month extension — ensure the language reflects this accurately.

3. BREACH NOTIFICATION: Section 8 sets a 72-hour breach notification window, which aligns with GDPR Article 33. However, the clause should also specify the format and content of breach notifications to ensure compliance with Article 33(3) requirements.

4. DATA TRANSFER MECHANISMS: The agreement does not specify the legal basis for any international transfers. If sub-processors are located outside the EEA, Standard Contractual Clauses (SCCs) or Binding Corporate Rules must be referenced and attached.

5. AUDIT RIGHTS: The current audit clause requires 30 days advance notice and limits audits to once per year. While reasonable, consider negotiating the right to conduct unannounced audits in the event of a material breach.

Please address these points with the processor before signing.`,
    contents: [
      {
        section: 'Scope and Purpose',
        text: 'This Data Processing Agreement ("DPA") is entered into pursuant to GDPR Article 28 between TechCorp Inc. as Data Controller and DataVault Ltd. as Data Processor. The Processor will process personal data solely on documented instructions from the Controller.',
      },
      {
        section: 'Data Subject Categories',
        text: 'The categories of data subjects include: employees, contractors, and clients of TechCorp Inc. Personal data processed includes: names, email addresses, employment records, and transactional data as detailed in Schedule 1.',
      },
      {
        section: 'Security Measures',
        text: 'Processor shall implement technical and organisational measures including: AES-256 encryption at rest and in transit, multi-factor authentication, regular penetration testing, and ISO 27001 certification maintenance.',
      },
    ],
  },
};

export async function getReviewDocDetailMock(documentId: string): Promise<ReviewDocDetailResponse> {
  await new Promise(resolve => setTimeout(resolve, 600));

  const detail = mockReviewDocDetails[documentId];
  if (detail) {
    return { success: true, data: detail };
  }

  // Fallback from list data
  const listItem = mockReviewDocuments.find(d => d.id === documentId);
  if (listItem) {
    return {
      success: true,
      data: {
        ...listItem,
        tags: ['Document', listItem.documentType],
        contents: [
          {
            section: 'Document Overview',
            text: listItem.description,
          },
          {
            section: 'Content',
            text: 'This document has been submitted for review. Full content parsing is pending. Please review the attached file for complete details.',
          },
        ],
      },
    };
  }

  return {
    success: false,
    data: {} as ReviewDocDetail,
    message: 'Document not found',
  };
}
