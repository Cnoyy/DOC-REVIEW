import { NextRequest, NextResponse } from 'next/server';
import { getUserProfileMock, updateUserProfileMock } from '@/mock/data/user-account';

export async function GET(request: NextRequest) {
  try {
    const mockData = await getUserProfileMock();
    return NextResponse.json(mockData);
  } catch (error) {
    console.error('User Profile API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
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

    const mockData = await updateUserProfileMock(name, email);
    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Update Profile API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
