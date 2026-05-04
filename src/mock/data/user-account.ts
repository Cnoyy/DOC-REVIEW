import { UserProfile, UserProfileResponse, UpdateProfileResponse, ChangePasswordResponse } from '@/types/user-account';

// Mock user profile data
const mockUserProfile: UserProfile = {
  id: 'user-001',
  name: 'John Doe',
  email: 'john.doe@example.com',
  createdAt: '2024-01-15T10:30:00Z',
  lastLogin: '2025-01-20T14:25:00Z',
};

// Mock function to get user profile
export async function getUserProfileMock(): Promise<UserProfileResponse> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    data: mockUserProfile,
    message: 'User profile retrieved successfully',
  };
}

// Mock function to update user profile
export async function updateUserProfileMock(name: string, email: string): Promise<UpdateProfileResponse> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Update mock data
  mockUserProfile.name = name;
  mockUserProfile.email = email;
  
  return {
    success: true,
    data: { ...mockUserProfile },
    message: 'Profile updated successfully',
  };
}

// Mock function to change password
export async function changePasswordMock(currentPassword: string, newPassword: string, confirmPassword: string): Promise<ChangePasswordResponse> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Validate passwords
  if (newPassword !== confirmPassword) {
    return {
      success: false,
      message: 'New password and confirm password do not match',
    };
  }
  
  if (newPassword.length < 8) {
    return {
      success: false,
      message: 'Password must be at least 8 characters long',
    };
  }
  
  // Simulate current password validation
  if (currentPassword !== 'current123') {
    return {
      success: false,
      message: 'Current password is incorrect',
    };
  }
  
  return {
    success: true,
    message: 'Password changed successfully',
  };
}
