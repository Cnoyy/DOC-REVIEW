import { NextRequest, NextResponse } from 'next/server';
import { updateUserProfileMock } from '@/mock/data/user-account';
import { encryptServer } from '@/lib/crypto-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: 'Name and email are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: 'Name must be at least 2 characters long' },
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
