import { NextResponse } from 'next/server';
import { getSearchHistoryMock } from '@/mock/data/search-history';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function GET() {
  try {
    const result = await getSearchHistoryMock();
    return NextResponse.json(result, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error('Search History API Error:', error);
    return NextResponse.json(
      { success: false, data: [], total: 0, message: 'Failed to fetch search history' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}
