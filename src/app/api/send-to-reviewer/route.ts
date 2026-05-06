import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendToReviewerMock } from '@/mock/data/send-to-reviewer';
import { encryptServer } from '@/lib/crypto-server';

const sendToReviewerSchema = z.object({
  emails: z.array(z.string().email('Invalid email format')).min(1, 'At least one email is required'),
  documentId: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = sendToReviewerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', errors: validation.error.issues.map((e) => e.message) },
        { status: 400 }
      );
    }

    const { emails, documentId } = validation.data;
    const result = await sendToReviewerMock(emails, documentId);
    const encrypted = encryptServer(JSON.stringify(result));
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
    console.error('Send to Reviewer API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process send to reviewer request', errors: ['Internal server error'] },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Send to Reviewer API is running' },
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

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}
