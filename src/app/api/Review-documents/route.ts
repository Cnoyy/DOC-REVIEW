import { NextResponse } from 'next/server';
import { getReviewDocumentsMock } from '@/mock/data/review-documents';

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function GET() {
  try {
    const result = await getReviewDocumentsMock();
    return NextResponse.json(result, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error('Review Documents API Error:', error);
    return NextResponse.json(
      { success: false, data: [], total: 0, message: 'Failed to fetch review documents' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}
