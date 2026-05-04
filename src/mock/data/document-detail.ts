import { DocumentDetail, DocumentDetailResponse } from '@/types/documents-library';
import { mockDocumentsList } from './documents-library';

const mockDocumentDetails: Record<string, DocumentDetail> = {
  'doc-001': {
    id: 'doc-001',
    name: 'Employment_Contract_2024.pdf',
    type: 'PDF',
    uploadedDate: '2024-11-15',
    reviewerStatus: 'approved',
    aiSuggested: true,
    fileSize: '1.2 MB',
    uploadedBy: 'John Smith',
    summary:
      'This Employment Contract outlines the terms of employment between TechCorp Inc. and the employee. It covers compensation, benefits, non-compete clauses, and termination conditions for a full-time software engineering position. The contract includes a 3-month probationary period and annual performance review cycle.',
    riskFlags: [
      {
        message: 'Non-compete clause (Section 8.2) spans 24 months and 50-mile radius — may be overly broad and unenforceable in some jurisdictions.',
        priority: 'high',
      },
      {
        message: 'Arbitration clause requires employee to waive class-action rights — review with legal counsel.',
        priority: 'medium',
      },
      {
        message: 'IP assignment clause covers inventions made outside working hours — standard but worth noting.',
        priority: 'low',
      },
    ],
    recommendations: [
      'Narrow the non-compete clause to 12 months and specific geographic areas',
      'Add explicit remote work policy provisions',
      'Include a severance pay schedule for clarity',
      'Verify compliance with local employment laws',
    ],
    reviewerEmails: ['hr@techcorp.com', 'legal@techcorp.com'],
    lastReviewedDate: '2024-11-18',
    notes: 'Approved after minor revisions to IP assignment section.',
  },
  'doc-002': {
    id: 'doc-002',
    name: 'NDA_Partnership_Agreement.docx',
    type: 'DOCX',
    uploadedDate: '2024-11-20',
    reviewerStatus: 'pending',
    aiSuggested: true,
    fileSize: '845 KB',
    uploadedBy: 'Sarah Johnson',
    summary:
      'This Non-Disclosure Agreement (NDA) governs the sharing of confidential information between TechCorp and PartnerVentures LLC as part of a potential joint venture. The agreement specifies a 3-year confidentiality period, defines protected information categories, and establishes penalties for unauthorized disclosure.',
    riskFlags: [
      {
        message: 'Section 7.3 contains an unlimited liability clause exposing the company to uncapped financial risk.',
        priority: 'high',
      },
      {
        message: 'Auto-renewal clause (Section 2.4) requires 90-day advance notice — above industry standard of 30–60 days.',
        priority: 'medium',
      },
      {
        message: 'Governing law set to Delaware — favorable but confirm with legal counsel.',
        priority: 'low',
      },
    ],
    recommendations: [
      'Cap liability to a defined monetary amount',
      'Reduce auto-renewal notice period to 30 days',
      'Add explicit data destruction/return provisions at agreement end',
      'Include mutual confidentiality obligations',
    ],
    reviewerEmails: ['legal@techcorp.com'],
    notes: 'Awaiting legal team review.',
  },
  'doc-003': {
    id: 'doc-003',
    name: 'Q3_Financial_Report.pdf',
    type: 'PDF',
    uploadedDate: '2024-11-22',
    reviewerStatus: 'rejected',
    aiSuggested: false,
    fileSize: '3.4 MB',
    uploadedBy: 'Michael Chen',
    summary:
      "This Q3 Financial Report summarizes TechCorp's financial performance for the third quarter of 2024. It includes revenue breakdowns by division, expense analysis, cash flow statements, and year-over-year comparison metrics. The report also highlights key risk factors affecting future projections.",
    riskFlags: [
      {
        message: 'Revenue recognition methodology inconsistent with Q2 report — requires reconciliation.',
        priority: 'high',
      },
      {
        message: 'Outstanding liabilities section (Appendix C) appears incomplete — several line items missing.',
        priority: 'high',
      },
      {
        message: 'Year-over-year comparison uses different accounting periods — may mislead stakeholders.',
        priority: 'medium',
      },
    ],
    recommendations: [
      'Reconcile revenue recognition methodology with previous quarters',
      'Complete the outstanding liabilities section',
      'Standardize comparison periods across all financial metrics',
      'Have CFO sign-off before redistribution',
    ],
    reviewerEmails: ['finance@techcorp.com', 'audit@techcorp.com'],
    lastReviewedDate: '2024-11-25',
    notes: 'Rejected due to incomplete liabilities section and inconsistent revenue recognition. Requires revision.',
  },
  'doc-004': {
    id: 'doc-004',
    name: 'Project_Proposal_v2.docx',
    type: 'DOCX',
    uploadedDate: '2024-11-28',
    reviewerStatus: 'pending',
    aiSuggested: true,
    fileSize: '512 KB',
    uploadedBy: 'Emily Davis',
    summary:
      'This project proposal outlines the development of a new client-facing analytics dashboard. It covers project scope, timeline, budget estimates, resource allocation, and success metrics. The proposal requests approval for a $150,000 budget over 6 months.',
    riskFlags: [
      {
        message: 'Budget estimate lacks contingency reserve — industry standard is 10–15% of total project cost.',
        priority: 'medium',
      },
      {
        message: 'Timeline assumes uninterrupted resource availability — no buffer for holidays or sick leave.',
        priority: 'low',
      },
    ],
    recommendations: [
      'Add 12% contingency reserve to budget',
      'Build 2-week buffer into each project milestone',
      'Define clear success metrics with measurable KPIs',
      'Include risk mitigation plan for key dependencies',
    ],
    reviewerEmails: ['pm@techcorp.com', 'director@techcorp.com'],
    notes: 'Under review by project management office.',
  },
  'doc-005': {
    id: 'doc-005',
    name: 'Compliance_Policy_2024.txt',
    type: 'TXT',
    uploadedDate: '2024-12-01',
    reviewerStatus: 'approved',
    aiSuggested: false,
    fileSize: '128 KB',
    uploadedBy: 'Robert Wilson',
    summary:
      'This Compliance Policy document establishes organizational guidelines for data protection, employee conduct, anti-bribery measures, and regulatory adherence. It has been updated to reflect GDPR amendments and new SOC 2 Type II requirements effective January 2025.',
    riskFlags: [
      {
        message: 'Data retention schedule (Section 4) does not align with updated GDPR right-to-erasure requirements.',
        priority: 'medium',
      },
      {
        message: 'Whistleblower protection clause references outdated internal reporting channels.',
        priority: 'low',
      },
    ],
    recommendations: [
      'Update data retention schedule to comply with GDPR Article 17',
      'Update whistleblower reporting channels to new HR portal',
      'Add section covering AI-generated content compliance',
      'Schedule annual review cycle for policy updates',
    ],
    reviewerEmails: ['compliance@techcorp.com', 'legal@techcorp.com'],
    lastReviewedDate: '2024-12-03',
    notes: 'Approved with minor comments. Follow-up review scheduled for Q1 2025.',
  },
  'doc-006': {
    id: 'doc-006',
    name: 'Vendor_Agreement_TechCorp.pdf',
    type: 'PDF',
    uploadedDate: '2024-12-05',
    reviewerStatus: 'pending',
    aiSuggested: true,
    fileSize: '2.1 MB',
    uploadedBy: 'Lisa Martinez',
    summary:
      'This Vendor Agreement formalizes the partnership between TechCorp and CloudServices Ltd for cloud infrastructure provisioning. It covers SLA commitments (99.9% uptime), data processing terms, payment schedules, and termination conditions for a 2-year engagement.',
    riskFlags: [
      {
        message: 'SLA penalty structure (Section 5.1) caps reimbursements at 10% of monthly fees — insufficient for critical outages.',
        priority: 'high',
      },
      {
        message: 'Data processing terms do not explicitly address sub-processor notifications — GDPR compliance risk.',
        priority: 'high',
      },
      {
        message: 'Payment terms allow vendor to suspend service with only 5-day notice for late payment.',
        priority: 'medium',
      },
    ],
    recommendations: [
      'Negotiate SLA penalties to better reflect business impact of outages',
      'Add explicit sub-processor notification requirements per GDPR Article 28',
      'Extend payment grace period to 15 business days',
      'Include data portability provisions for contract exit',
    ],
    reviewerEmails: ['procurement@techcorp.com', 'legal@techcorp.com'],
    notes: 'High-priority review — contract signing deadline December 20, 2024.',
  },
  'doc-007': {
    id: 'doc-007',
    name: 'IP_Assignment_Agreement.docx',
    type: 'DOCX',
    uploadedDate: '2024-12-10',
    reviewerStatus: 'rejected',
    aiSuggested: true,
    fileSize: '678 KB',
    uploadedBy: 'David Thompson',
    summary:
      'This IP Assignment Agreement transfers intellectual property rights from a contracted developer to TechCorp for software developed under a consulting engagement. It covers source code, documentation, and derivative works created during the contract period.',
    riskFlags: [
      {
        message: 'IP assignment clause does not specify which pre-existing IP is excluded — risk of overreach.',
        priority: 'high',
      },
      {
        message: 'No moral rights waiver included — required in several jurisdictions for full IP transfer.',
        priority: 'high',
      },
      {
        message: 'Consideration for assignment is listed as $1 — courts may void assignment for lack of adequate consideration.',
        priority: 'medium',
      },
    ],
    recommendations: [
      'Add explicit carve-out schedule for contractor pre-existing IP',
      'Include moral rights waiver applicable to all relevant jurisdictions',
      'Replace nominal consideration with fair market value payment',
      'Have contractor sign before commencing work, not after',
    ],
    reviewerEmails: ['legal@techcorp.com'],
    lastReviewedDate: '2024-12-12',
    notes: 'Rejected — critical IP protection gaps identified. Must be revised before execution.',
    documentContent: `IP ASSIGNMENT AGREEMENT

This Intellectual Property Assignment Agreement is entered into as of December 8, 2024,
between TechCorp Inc. ("Company") and Alex Rivera ("Contractor").

1. ASSIGNMENT OF INTELLECTUAL PROPERTY

Contractor hereby irrevocably assigns to Company all right, title, and interest in and
to all Intellectual Property created, conceived, or reduced to practice by Contractor
in connection with the consulting engagement under Contract No. TC-2024-089.

2. SCOPE OF ASSIGNED IP

Assigned IP includes:
  - All source code, scripts, and software components
  - Technical documentation and specifications
  - Design documents and architecture diagrams
  - Derivative works and improvements

3. CONSIDERATION

In consideration for this assignment, Company shall pay Contractor the sum of one dollar
($1.00), receipt of which is hereby acknowledged.

4. REPRESENTATIONS AND WARRANTIES

Contractor represents that:
(a) Contractor is the sole owner of the Assigned IP;
(b) The Assigned IP does not infringe any third-party rights;
(c) Contractor has full authority to make this assignment.

5. FURTHER ASSURANCES

Contractor agrees to execute any additional documents reasonably requested by Company
to perfect or record this assignment.

6. GOVERNING LAW

This Agreement shall be governed by the laws of the State of California.

TECHCORP INC.                       CONTRACTOR
_______________________             _______________________
Authorized Signature                Alex Rivera
Date: ________________              Date: ________________`,
  },
  'doc-008': {
    id: 'doc-008',
    name: 'NDA_Partnership_v3.pdf',
    type: 'PDF',
    uploadedDate: '2024-12-12',
    reviewerStatus: 'reviewer-suggestion',
    aiSuggested: false,
    fileSize: '920 KB',
    uploadedBy: 'Sarah Johnson',
    summary: 'NDA reviewed with suggestions from legal team.',
    riskFlags: [],
    recommendations: [],
    reviewerEmails: [],
    documentContent: `NON-DISCLOSURE AGREEMENT — VERSION 3

This Non-Disclosure Agreement ("Agreement") is entered into as of December 10, 2024,
between TechCorp Inc. ("Disclosing Party") and PartnerVentures LLC ("Receiving Party").

1. DEFINITION OF CONFIDENTIAL INFORMATION

"Confidential Information" means any data or information that is proprietary to the
Disclosing Party and not generally known to the public, including but not limited to:
  - Technical specifications and source code
  - Business plans and financial projections
  - Customer lists and pricing strategies
  - Proprietary processes and methodologies

2. OBLIGATIONS OF RECEIVING PARTY

The Receiving Party agrees to:
(a) Hold the Confidential Information in strict confidence;
(b) Not disclose to any third parties without prior written consent;
(c) Use the information solely for evaluating a potential joint venture;
(d) Notify promptly of any unauthorized disclosure.

3. CONFIDENTIALITY PERIOD

This Agreement shall remain in effect for two (2) years from the Effective Date.

4. PERMITTED DISCLOSURES

Disclosure is permitted to employees on a strict need-to-know basis, provided they
are bound by confidentiality obligations no less stringent than this Agreement.

5. EXCLUSIONS

Obligations do not apply to information that:
(a) Was already publicly known at time of disclosure;
(b) Becomes public through no fault of Receiving Party;
(c) Is independently developed without use of Confidential Information.

6. REMEDIES

Both parties acknowledge that breach may cause irreparable harm and that monetary
damages may be inadequate. Injunctive relief may be sought without bond.

7. GENERAL PROVISIONS

7.1 This Agreement constitutes the entire agreement on the subject matter.
7.2 Modifications must be in writing signed by both parties.
7.3 Liability for breach shall be unlimited.

8. GOVERNING LAW

This Agreement is governed by the laws of the State of Delaware.

TECHCORP INC.
_______________________
Authorized Signature
Date: ________________

PARTNERVENTURES LLC
_______________________
Authorized Signature
Date: ________________`,
    reviewerSuggestions: {
      reviewer: 'Sarah Johnson',
      email: 'sarah.j@legal.com',
      items: [
        {
          section: 'Section 3 — Confidentiality Period',
          suggestion: 'Two years is below the industry standard for technology NDAs. Recommend extending to three years, particularly given the scope of technical information being shared in this partnership.',
        },
        {
          section: 'Section 7.3 — Unlimited Liability',
          suggestion: 'An unlimited liability clause is highly unusual and creates significant financial exposure. Strongly recommend capping liability at a defined monetary amount, such as the total fees paid under the associated agreement.',
        },
        {
          section: 'Section 4 — Permitted Disclosures',
          suggestion: 'The "need-to-know" provision should explicitly include a list of permitted roles (e.g., legal counsel, finance) to avoid ambiguity and potential over-disclosure.',
        },
      ],
    },
  },
  'doc-009': {
    id: 'doc-009',
    name: 'Service_Level_Agreement_Q1.docx',
    type: 'DOCX',
    uploadedDate: '2024-12-14',
    reviewerStatus: 'reviewer-suggestion',
    aiSuggested: false,
    fileSize: '1.1 MB',
    uploadedBy: 'Michael Chen',
    summary: 'SLA reviewed with uptime and response time suggestions.',
    riskFlags: [],
    recommendations: [],
    reviewerEmails: [],
    documentContent: `SERVICE LEVEL AGREEMENT — Q1 2025

Effective Date: January 1, 2025
Client: TechCorp Inc.
Service Provider: CloudServe Solutions

1. SCOPE OF SERVICES

CloudServe Solutions ("Provider") shall provide cloud infrastructure, managed hosting,
and 24/7 monitoring services to TechCorp Inc. ("Client") as detailed in Schedule A.

2. UPTIME GUARANTEE

Provider guarantees a minimum service availability of 99.5% measured monthly, excluding:
  - Scheduled maintenance windows (max 4 hours/month)
  - Force majeure events
  - Client-caused outages

3. SUPPORT TIERS

Tier 1 — Critical: Complete system outage or data breach
Tier 2 — High: Core functionality unavailable, no workaround
Tier 3 — Medium: Feature degradation, workaround available
Tier 4 — Low: Minor issues, cosmetic problems

4. RESPONSE AND RESOLUTION TIMES

4.1 Tier 1: Response within 4 hours, resolution target 8 hours
4.2 Tier 2: Response within 8 hours, resolution target 24 hours
4.3 Tier 3: Response within 24 hours, resolution target 72 hours
4.4 Tier 4: Response within 72 hours, resolution target 7 days

5. SERVICE CREDITS

If monthly uptime falls below guarantee:
  - 99.0–99.5%: 5% monthly credit
  - 98.0–99.0%: 10% monthly credit
  - Below 98.0%: 25% monthly credit
  Maximum credit: 30% of monthly fee

6. MONITORING AND REPORTING

Provider shall deliver monthly performance reports by the 5th business day of each month,
including uptime statistics, incident summaries, and capacity metrics.

7. TERM

This Agreement is effective January 1, 2025 and continues for 12 months, auto-renewing
unless terminated with 60 days written notice.`,
    reviewerSuggestions: {
      reviewer: 'Michael Chen',
      email: 'm.chen@techcorp.com',
      items: [
        {
          section: 'Section 2 — Uptime Guarantee',
          suggestion: 'The 99.5% uptime guarantee is below current market standards of 99.9%. For a production environment, this difference translates to approximately 3.6 hours of permitted downtime per month versus 43 minutes. Recommend negotiating to 99.9% before signing.',
        },
        {
          section: 'Section 4.1 — Tier 1 Response Time',
          suggestion: 'A 4-hour initial response for a critical outage is too slow. Industry best practice for Tier 1 is 30–60 minutes. Request revision to 1-hour response with an escalation matrix and named on-call contacts.',
        },
      ],
    },
  },
  'doc-010': {
    id: 'doc-010',
    name: 'Employment_Contract_Senior.pdf',
    type: 'PDF',
    uploadedDate: '2024-12-15',
    reviewerStatus: 'reviewer-suggestion',
    aiSuggested: false,
    fileSize: '750 KB',
    uploadedBy: 'Emily Davis',
    summary: 'Senior employment contract reviewed with non-compete and IP clause suggestions.',
    riskFlags: [],
    recommendations: [],
    reviewerEmails: [],
    documentContent: `EMPLOYMENT AGREEMENT — SENIOR SOFTWARE ENGINEER

This Employment Agreement is entered into as of December 15, 2024, between
TechCorp Inc. ("Company") and Jordan Martinez ("Employee").

1. POSITION AND DUTIES

Employee is engaged as Senior Software Engineer (Principal Level) and shall:
  - Lead architectural design for core platform services
  - Mentor junior and mid-level engineers
  - Collaborate with product management on technical roadmaps
  - Report to the VP of Engineering

2. START DATE

Employment commences January 15, 2025.

3. COMPENSATION

Base Salary: $165,000 per year, paid bi-weekly.
Performance Bonus: Up to 20% of base salary, evaluated annually.
Equity Grant: 0.25% stock options with 4-year vesting and 1-year cliff.
Signing Bonus: $15,000, subject to 12-month clawback.

4. BENEFITS

  - Comprehensive health, dental, and vision (Employee + family)
  - 25 days paid time off per year
  - 10 days sick leave
  - $3,000 annual learning and development budget
  - Home office stipend: $1,500 one-time setup + $100/month

5. CONFIDENTIALITY

Employee shall maintain strict confidentiality of all proprietary information,
trade secrets, and business data during and for 3 years after employment ends.

6. WORK HOURS

Standard hours are 40 per week. Flexible scheduling is available subject to
team coordination requirements.

7. PROBATIONARY PERIOD

The first 90 days are a probationary period with simplified termination provisions.

8. NON-COMPETE CLAUSE

For 24 months following termination, Employee shall not work for or consult with
any direct competitor within a 100-mile radius of the Company's headquarters.

9. NON-SOLICITATION

For 18 months post-employment, Employee shall not solicit Company employees, clients,
or contractors.

10. INTELLECTUAL PROPERTY

All work product, inventions, and improvements created during employment, whether
during work hours or personal time, using Company resources or otherwise, shall be
the exclusive property of the Company.

11. TERMINATION

Employment is at-will. Either party may terminate at any time without cause.

12. GOVERNING LAW

This Agreement is governed by the laws of California.`,
    reviewerSuggestions: {
      reviewer: 'Emily Davis',
      email: 'e.davis@hr.techcorp.com',
      items: [
        {
          section: 'Section 8 — Non-Compete Clause',
          suggestion: 'The 24-month non-compete with 100-mile geographic restriction is likely unenforceable under California law (Business & Professions Code § 16600). Recommend removing entirely or replacing with a narrow non-solicitation clause targeting only direct clients.',
        },
        {
          section: 'Section 10 — Intellectual Property',
          suggestion: 'The IP clause as written captures inventions made outside work hours without Company resources, which is prohibited under California Labor Code § 2870. Must be revised to exclude personal projects to comply with state law.',
        },
        {
          section: 'Section 11 — Termination',
          suggestion: 'The at-will clause lacks a severance structure for senior hires, which is unusual at this compensation level and increases flight risk. Consider adding a tiered severance: 4 weeks for under 1 year, 8 weeks for 1–3 years, 12 weeks for 3+ years.',
        },
      ],
    },
  },
  'doc-011': {
    id: 'doc-011',
    name: 'Annual_Leave_Policy_2025.pdf',
    type: 'PDF',
    uploadedDate: '2025-01-05',
    reviewerStatus: 'pending',
    aiSuggested: false,
    fileSize: '340 KB',
    uploadedBy: 'Robert Wilson',
    summary: '',
    riskFlags: [],
    recommendations: [],
    reviewerEmails: ['hr@techcorp.com', 'compliance@techcorp.com'],
    documentContent: `ANNUAL LEAVE POLICY 2025

Effective Date: January 1, 2025
Issued by: Human Resources Department, TechCorp Inc.

1. PURPOSE

This policy establishes the annual leave entitlements and procedures for all full-time
and part-time employees of TechCorp Inc. effective from January 1, 2025.

2. LEAVE ENTITLEMENT

2.1 Full-Time Employees
All full-time employees are entitled to 20 working days of paid annual leave per
calendar year. Employees who have completed five or more years of continuous service
are entitled to 25 working days.

2.2 Part-Time Employees
Part-time employees are entitled to annual leave on a pro-rata basis, calculated
according to the number of hours worked relative to a standard full-time schedule.

3. ACCRUAL AND CARRY-OVER

Annual leave accrues monthly at a rate of 1.67 days per month for standard entitlement.
Unused leave may be carried over to the following calendar year up to a maximum of 5 days.
Carried-over leave must be used by March 31 of the following year or it will be forfeited.

4. APPLICATION PROCEDURE

Employees must submit leave requests through the HR portal at least 5 working days in
advance for leave of 3 days or less, and at least 14 days in advance for longer periods.
Approval is at the discretion of the line manager, subject to business requirements.

5. PUBLIC HOLIDAYS

Public holidays falling within a leave period are not counted as annual leave days and
will not be deducted from the employee's leave balance.

6. TERMINATION

Upon termination of employment, accrued but unused annual leave will be paid out at
the employee's current daily rate of pay.`,
  },
  'doc-012': {
    id: 'doc-012',
    name: 'Software_License_Agreement.docx',
    type: 'DOCX',
    uploadedDate: '2025-01-08',
    reviewerStatus: 'pending',
    aiSuggested: false,
    fileSize: '620 KB',
    uploadedBy: 'Lisa Martinez',
    summary: '',
    riskFlags: [],
    recommendations: [],
    reviewerEmails: ['legal@techcorp.com'],
    documentContent: `SOFTWARE LICENSE AGREEMENT

This Software License Agreement ("Agreement") is entered into as of January 8, 2025,
between TechCorp Inc. ("Licensor") and Enterprise Solutions Ltd. ("Licensee").

1. GRANT OF LICENSE

Licensor hereby grants Licensee a non-exclusive, non-transferable license to use the
software product known as "DocuAnalytics Suite v4.0" ("Software") solely for Licensee's
internal business operations.

2. RESTRICTIONS

Licensee shall not:
(a) Copy, modify, or distribute the Software without prior written consent;
(b) Reverse-engineer, decompile, or disassemble the Software;
(c) Sublicense or transfer rights under this Agreement to any third party;
(d) Use the Software for any unlawful or unauthorized purpose.

3. INTELLECTUAL PROPERTY

All intellectual property rights in and to the Software remain the exclusive property
of Licensor. Nothing in this Agreement transfers ownership of the Software to Licensee.

4. TERM AND TERMINATION

This Agreement is effective for a period of two (2) years from the date of execution.
Either party may terminate this Agreement upon 60 days written notice if the other
party materially breaches any provision and fails to cure such breach within 30 days.

5. WARRANTY DISCLAIMER

THE SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. LICENSOR EXPRESSLY
DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES
OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.

6. LIMITATION OF LIABILITY

IN NO EVENT SHALL LICENSOR BE LIABLE FOR ANY INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
DAMAGES ARISING OUT OF OR RELATED TO THIS AGREEMENT.

7. GOVERNING LAW

This Agreement shall be governed by the laws of the State of Delaware.`,
  },
  'doc-013': {
    id: 'doc-013',
    name: 'Data_Retention_Policy.txt',
    type: 'TXT',
    uploadedDate: '2025-01-10',
    reviewerStatus: 'pending',
    aiSuggested: false,
    fileSize: '95 KB',
    uploadedBy: 'James Anderson',
    summary: '',
    riskFlags: [],
    recommendations: [],
    reviewerEmails: ['compliance@techcorp.com', 'legal@techcorp.com'],
    documentContent: `DATA RETENTION POLICY

Version: 2.1
Last Updated: January 10, 2025
Owner: Data Governance Team, TechCorp Inc.

1. OVERVIEW

This Data Retention Policy defines the periods for which TechCorp Inc. retains personal
and business data, and the procedures for secure disposal of data once retention periods
have expired. This policy applies to all data held in physical and electronic formats.

2. RETENTION PERIODS BY DATA CATEGORY

2.1 Employee Records
Active employment records: Duration of employment + 7 years
Payroll records: 7 years from date of creation
Recruitment data (unsuccessful candidates): 6 months post-decision

2.2 Customer and Client Data
Active contract data: Duration of contract + 5 years
Correspondence: 3 years from last contact
Financial transaction records: 7 years per HMRC requirements

2.3 Operational Data
System logs and audit trails: 2 years
Security incident records: 5 years
Business communications (email): 3 years

3. DATA DISPOSAL PROCEDURES

3.1 Electronic Data
All electronic data must be permanently deleted using approved data-wiping software
that meets DoD 5220.22-M standards. Hard drives and storage media must be physically
destroyed or degaussed before disposal.

3.2 Physical Records
Physical documents containing personal data must be shredded using cross-cut shredders
to a particle size complying with DIN 66399 Security Level P-4 or above.

4. GDPR COMPLIANCE

This policy is designed to comply with GDPR Article 5(1)(e) (storage limitation principle).
Data subjects may request deletion of their data under Article 17, subject to any applicable
legal retention obligations.

5. REVIEW

This policy will be reviewed annually by the Data Governance Team.`,
  },
  'doc-014': {
    id: 'doc-014',
    name: 'Employee_Handbook_2024.pdf',
    type: 'PDF',
    uploadedDate: '2025-01-12',
    reviewerStatus: 'approved',
    aiSuggested: false,
    fileSize: '1.5 MB',
    uploadedBy: 'Sarah Johnson',
    summary: '',
    riskFlags: [],
    recommendations: [],
    reviewerEmails: ['hr@techcorp.com', 'legal@techcorp.com'],
    lastReviewedDate: '2025-01-14',
    documentContent: `EMPLOYEE HANDBOOK 2024

TechCorp Inc. — Welcome to the Team

This handbook outlines the policies, benefits, and expectations for all TechCorp Inc.
employees. Please read it carefully and keep it for future reference.

SECTION 1 — OUR CULTURE

TechCorp is built on a foundation of collaboration, innovation, and mutual respect.
We expect every team member to uphold our core values:
  - Integrity in all interactions
  - Commitment to excellence
  - Open and honest communication
  - Respect for diverse perspectives

SECTION 2 — WORK HOURS AND FLEXIBILITY

Standard office hours are Monday–Friday, 9:00 AM–5:30 PM local time.
Flexible working arrangements are available subject to line manager approval and
operational requirements. Remote work may be permitted up to 3 days per week
for eligible roles.

SECTION 3 — CODE OF CONDUCT

All employees are expected to:
  - Treat colleagues, clients, and partners with professionalism and respect
  - Comply with all applicable laws and company policies
  - Report any suspected violations through the ethics hotline
  - Maintain confidentiality of proprietary and sensitive information

SECTION 4 — BENEFITS SUMMARY

  - Private health insurance (employee and dependants)
  - Pension scheme with 5% employer contribution
  - 25 days annual leave + bank holidays
  - Annual learning and development budget of £2,000
  - Employee Assistance Programme (EAP)
  - Subsidised gym membership

SECTION 5 — DISCIPLINARY AND GRIEVANCE

TechCorp follows a formal disciplinary and grievance procedure aligned with
ACAS guidelines. Employees have the right to be accompanied at formal hearings.

This handbook is subject to change. The most current version is available on
the internal HR portal.`,
  },
  'doc-015': {
    id: 'doc-015',
    name: 'Partnership_Framework_Agreement.docx',
    type: 'DOCX',
    uploadedDate: '2025-01-14',
    reviewerStatus: 'approved',
    aiSuggested: false,
    fileSize: '780 KB',
    uploadedBy: 'Michael Chen',
    summary: '',
    riskFlags: [],
    recommendations: [],
    reviewerEmails: ['partnerships@techcorp.com', 'legal@techcorp.com'],
    lastReviewedDate: '2025-01-16',
    documentContent: `PARTNERSHIP FRAMEWORK AGREEMENT

This Partnership Framework Agreement ("Agreement") is entered into as of January 14, 2025,
between TechCorp Inc. ("TechCorp") and Nexus Ventures Ltd. ("Partner").

1. PURPOSE AND SCOPE

This Agreement establishes the framework for a strategic partnership between TechCorp
and Partner to co-develop and market integrated software solutions targeting the
enterprise document management sector.

2. ROLES AND RESPONSIBILITIES

2.1 TechCorp shall:
  - Provide access to its document processing APIs and development sandbox
  - Assign a dedicated partnership manager
  - Contribute engineering resources for joint integration work
  - Co-fund agreed marketing initiatives up to the amounts specified in Schedule B

2.2 Partner shall:
  - Provide domain expertise in enterprise workflows
  - Develop and maintain client relationships within the agreed territory
  - Co-fund marketing initiatives as specified in Schedule B
  - Report quarterly on pipeline and revenue metrics

3. REVENUE SHARING

Revenue generated from jointly developed solutions shall be shared as follows:
  - TechCorp: 55% of net revenue from licensed technology components
  - Partner: 45% of net revenue from implementation and consulting services

Revenue sharing terms are subject to quarterly review and may be adjusted by mutual agreement.

4. INTELLECTUAL PROPERTY

Each party retains ownership of its pre-existing intellectual property.
Jointly developed IP shall be jointly owned, with each party having the right
to exploit such IP without accounting to the other, except as agreed in writing.

5. TERM

This Agreement shall remain in effect for three (3) years from the Effective Date,
and shall automatically renew for successive one-year periods unless terminated
with 90 days written notice.`,
  },
  'doc-016': {
    id: 'doc-016',
    name: 'Marketing_Budget_Q4.pdf',
    type: 'PDF',
    uploadedDate: '2025-01-15',
    reviewerStatus: 'rejected',
    aiSuggested: false,
    fileSize: '410 KB',
    uploadedBy: 'Emily Davis',
    summary: '',
    riskFlags: [],
    recommendations: [],
    reviewerEmails: ['finance@techcorp.com'],
    lastReviewedDate: '2025-01-17',
    notes: 'Rejected — budget figures do not reconcile with Q3 actuals. Approval authority exceeded without sign-off.',
    documentContent: `MARKETING BUDGET — Q4 2025 PROPOSAL

Prepared by: Marketing Department
Submitted: January 15, 2025
Review Period: October 1 – December 31, 2025

1. EXECUTIVE SUMMARY

This document presents the proposed marketing budget for Q4 2025. The total request
is $285,000, representing a 42% increase over Q4 2024 actuals of $200,000.

2. BUDGET BREAKDOWN

2.1 Digital Advertising
  - Paid search (Google, Bing): $60,000
  - Social media advertising (LinkedIn, Meta): $45,000
  - Display and retargeting: $20,000
  Subtotal: $125,000

2.2 Events and Sponsorships
  - TechSummit 2025 (platinum sponsorship): $50,000
  - Regional roadshows (3 cities): $30,000
  - Industry conference booths: $15,000
  Subtotal: $95,000

2.3 Content and Creative
  - Video production (2 product demos): $25,000
  - Copywriting and design retainer: $18,000
  - Photography and brand assets: $7,000
  Subtotal: $50,000

2.4 Tools and Technology
  - Marketing automation platform: $10,000
  - Analytics and reporting tools: $5,000
  Subtotal: $15,000

GRAND TOTAL: $285,000

3. EXPECTED OUTCOMES

  - 35% increase in qualified inbound leads vs Q4 2024
  - 500+ event attendees across roadshow cities
  - 1.2M impressions across digital channels

4. APPROVAL REQUIRED

Director of Marketing signature required for budgets up to $150,000.
CFO approval required for amounts exceeding $150,000.`,
  },
  'doc-017': {
    id: 'doc-017',
    name: 'Contractor_Agreement_v1.docx',
    type: 'DOCX',
    uploadedDate: '2025-01-16',
    reviewerStatus: 'rejected',
    aiSuggested: false,
    fileSize: '530 KB',
    uploadedBy: 'David Thompson',
    summary: '',
    riskFlags: [],
    recommendations: [],
    reviewerEmails: ['legal@techcorp.com'],
    lastReviewedDate: '2025-01-18',
    notes: 'Rejected — missing IR35 determination clause and dispute resolution mechanism. Indemnity clause is one-sided.',
    documentContent: `INDEPENDENT CONTRACTOR AGREEMENT — VERSION 1

This Independent Contractor Agreement ("Agreement") is entered into as of January 16, 2025,
between TechCorp Inc. ("Company") and the individual identified below ("Contractor").

1. ENGAGEMENT

Company engages Contractor to provide software development services ("Services")
as described in the attached Statement of Work (Schedule A).

2. INDEPENDENT CONTRACTOR STATUS

Contractor is engaged as an independent contractor, not an employee of the Company.
Contractor is responsible for all applicable taxes, national insurance contributions,
and self-employment obligations. The Company will not withhold income tax or provide
employment benefits.

3. FEES AND PAYMENT

Contractor shall be paid at the rate specified in Schedule A. Invoices must be submitted
monthly and will be paid within 30 days of receipt. Late payment does not carry interest.

4. CONFIDENTIALITY

Contractor agrees to keep all Company information strictly confidential during and after
the engagement, without time limitation.

5. INTELLECTUAL PROPERTY

All work product created by Contractor under this Agreement shall become the sole property
of the Company upon creation. Contractor waives all moral rights in such work product.

6. INDEMNIFICATION

Contractor shall fully indemnify and hold harmless the Company from any claims, damages,
or losses arising from Contractor's performance of the Services or breach of this Agreement.
Company assumes no liability for any acts or omissions of Contractor.

7. TERM

This Agreement commences on the date of signing and continues until the Services are
complete, unless terminated earlier by either party with 14 days written notice.

8. GOVERNING LAW

This Agreement is governed by the laws of England and Wales.`,
  },
};

export async function getDocumentDetailMock(documentId: string): Promise<DocumentDetailResponse> {
  await new Promise(resolve => setTimeout(resolve, 600));

  const detail = mockDocumentDetails[documentId];

  if (detail) {
    return { success: true, data: detail };
  }

  // Fallback: build a detail from the library list item
  const listItem = mockDocumentsList.find(d => d.id === documentId);
  if (listItem) {
    return {
      success: true,
      data: {
        ...listItem,
        summary: 'This document has been uploaded for review. AI analysis is pending for this document.',
        riskFlags: [
          { message: 'Document has not been fully analyzed yet.', priority: 'low' },
        ],
        recommendations: ['Request full AI analysis', 'Assign a reviewer'],
        reviewerEmails: [],
      },
    };
  }

  return {
    success: false,
    data: {} as DocumentDetail,
    message: 'Document not found',
  };
}
