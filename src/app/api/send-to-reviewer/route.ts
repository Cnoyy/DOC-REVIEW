import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendToReviewerMock } from '@/mock/data/send-to-reviewer';

// Request validation schema
const sendToReviewerSchema = z.object({
  emails: z.array(z.string().email('Invalid email format')).min(1, 'At least one email is required'),
  documentId: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = sendToReviewerSchema.safeParse(body);
    
    if (!validationResult.success) {
      const errorMessages = validationResult.error.issues.map(err => err.message);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed', 
          errors: errorMessages 
        },
        { status: 400 }
      );
    }

    const { emails, documentId, message } = validationResult.data;
    
    // Call mock service
    const result = await sendToReviewerMock(emails, documentId);
    
    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Send to Reviewer API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to process send to reviewer request',
        errors: ['Internal server error']
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Send to Reviewer API is running',
      endpoints: {
        POST: '/api/send-to-reviewer - Send document to reviewers'
      }
    },
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
