import { NextRequest, NextResponse } from 'next/server';
import { changePasswordMock } from '@/mock/data/user-account';
import { encryptServer } from '@/lib/crypto-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'All password fields are required' },
        { status: 400 }
      );
    }

    const result = await changePasswordMock(currentPassword, newPassword, confirmPassword);
    const encrypted = encryptServer(JSON.stringify(result));
    return NextResponse.json({ data: encrypted });
  } catch (error) {
    console.error('Change Password API Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
