import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { AISuggestionResponse } from '@/types/ai-suggestion';
import { encryptServer } from '@/lib/crypto-server';

const mockAISuggestion: AISuggestionResponse = {
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
    'Verify document authenticity',
    'Add watermark for security',
    'Standardize formatting',
    'Include verification QR code',
  ],
  moreSuggestions: [
    'Consider adding digital signature',
    'Include blockchain verification',
    'Add timestamp metadata',
    'Implement multi-factor verification',
  ],
};

const requestSchema = z.object({
  documentName: z.string().min(1, 'Document name is required'),
  requestType: z.enum(['ai_suggestion']),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = requestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', errors: validation.error.issues.map((e) => e.message) },
        { status: 400 }
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const encrypted = encryptServer(JSON.stringify(mockAISuggestion));
    return NextResponse.json(
      { data: encrypted },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to process AI suggestion' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'AI Suggestion API is running' },
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}
