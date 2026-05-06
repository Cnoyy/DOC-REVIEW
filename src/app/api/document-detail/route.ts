import { NextRequest, NextResponse } from 'next/server';
import { getDocumentDetailMock } from '@/mock/data/document-detail';
import { encryptServer } from '@/lib/crypto-server';

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
        { success: false, message: 'Document ID is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const result = await getDocumentDetailMock(documentId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message ?? 'Document not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    const encrypted = encryptServer(JSON.stringify(result));
    return NextResponse.json({ data: encrypted }, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error('Document Detail API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch document detail' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}
