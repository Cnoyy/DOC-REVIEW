import { NextRequest, NextResponse } from 'next/server';
import { encryptServer } from '@/lib/crypto-server';

export async function DELETE(request: NextRequest) {
  try {
    const { documentId } = await request.json();

    if (!documentId) {
      return NextResponse.json(
        { success: false, message: 'Document ID is required' },
        { status: 400 }
      );
    }

    console.log(`Deleting document: ${documentId}`);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const result = { success: true, message: 'Document deleted successfully' };
    const encrypted = encryptServer(JSON.stringify(result));
    return NextResponse.json({ data: encrypted });
  } catch (error) {
    console.error('Delete API Error:', error);
    const result = { success: false, message: 'Failed to delete document' };
    const encrypted = encryptServer(JSON.stringify(result));
    return NextResponse.json({ data: encrypted }, { status: 500 });
  }
}
