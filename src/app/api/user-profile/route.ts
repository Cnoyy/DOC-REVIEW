import { NextRequest, NextResponse } from 'next/server';
import { getUserProfileMock, updateUserProfileMock } from '@/mock/data/user-account';
import { encryptServer } from '@/lib/crypto-server';

export async function GET() {
  try {
    const result = await getUserProfileMock();
    const encrypted = encryptServer(JSON.stringify(result));
    return NextResponse.json({ data: encrypted });
  } catch (error) {
    console.error('User Profile API Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: 'Name and email are required' },
        { status: 400 }
      );
    }

    const result = await updateUserProfileMock(name, email);
    const encrypted = encryptServer(JSON.stringify(result));
    return NextResponse.json({ data: encrypted });
  } catch (error) {
    console.error('Update Profile API Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
