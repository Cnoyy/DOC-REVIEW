import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rejectByReviewerMock } from '@/mock/data/review-actions';

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const schema = z.object({
  documentId: z.string().min(1, 'Document ID is required'),
  reviewerNotes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = schema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', errors: validation.error.issues.map(e => e.message) },
        { status: 400, headers: corsHeaders }
      );
    }

    const { documentId, reviewerNotes } = validation.data;
    const result = await rejectByReviewerMock(documentId, reviewerNotes);
    return NextResponse.json(result, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error('Reject By Reviewer API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to reject document' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}
