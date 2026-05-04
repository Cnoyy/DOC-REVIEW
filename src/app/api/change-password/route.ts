import { NextRequest, NextResponse } from 'next/server';
import { changePasswordMock } from '@/mock/data/user-account';

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

    const mockData = await changePasswordMock(currentPassword, newPassword, confirmPassword);
    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Change Password API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
