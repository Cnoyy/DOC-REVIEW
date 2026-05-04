import { NextRequest, NextResponse } from 'next/server';
import { getReviewDocDetailMock } from '@/mock/data/reviewdoc-detail';

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('id');

    if (!documentId) {
      return NextResponse.json(
        { success: false, data: null, message: 'Document ID is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const result = await getReviewDocDetailMock(documentId);

    if (!result.success) {
      return NextResponse.json(result, { status: 404, headers: corsHeaders });
    }

    return NextResponse.json(result, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error('Review Doc Detail API Error:', error);
    return NextResponse.json(
      { success: false, data: null, message: 'Failed to fetch review document detail' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}
