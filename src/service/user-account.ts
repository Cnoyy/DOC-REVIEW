import { z } from 'zod';
import {
  UserProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from '@/types/user-account';
import { getApiUrl, API_CONFIG } from '@/lib/mockapi';
import { decryptClient } from '@/lib/crypto-client';
import {
  getUserProfileMock,
  updateUserProfileMock,
  changePasswordMock,
} from '@/mock/data/user-account';

// ── Zod schemas ────────────────────────────────────────────────────────────────

const UserProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  createdAt: z.string(),
  lastLogin: z.string(),
});

const UserProfileResponseSchema = z.object({
  success: z.boolean(),
  data: UserProfileSchema,
  message: z.string().optional(),
});

const UpdateProfileResponseSchema = z.object({
  success: z.boolean(),
  data: UserProfileSchema,
  message: z.string(),
});

const ChangePasswordResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

// ── Helpers ────────────────────────────────────────────────────────────────────

async function decryptResponse<T>(response: Response, schema: z.ZodType<T>): Promise<T> {
  const envelope: { data: string } = await response.json();
  const plaintext = await decryptClient(envelope.data);
  return schema.parse(JSON.parse(plaintext));
}

// ── Service ────────────────────────────────────────────────────────────────────

export class UserAccountService {
  static async getUserProfile(): Promise<UserProfileResponse> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.USER_PROFILE), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
      });

      if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);
      return await decryptResponse(response, UserProfileResponseSchema);
    } catch (error) {
      console.error('User Profile API Error:', error);
      return getUserProfileMock();
    }
  }

  static async updateUserProfile(request: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.USER_PROFILE), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);
      return await decryptResponse(response, UpdateProfileResponseSchema);
    } catch (error) {
      console.error('Update Profile API Error:', error);
      return updateUserProfileMock(request.name, request.email);
    }
  }

  static async updateProfile(request: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.UPDATE_PROFILE), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);
      return await decryptResponse(response, UpdateProfileResponseSchema);
    } catch (error) {
      console.error('Update Profile API Error:', error);
      return updateUserProfileMock(request.name, request.email);
    }
  }

  static async changePassword(request: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.CHANGE_PASSWORD), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);
      return await decryptResponse(response, ChangePasswordResponseSchema);
    } catch (error) {
      console.error('Change Password API Error:', error);
      return changePasswordMock(request.currentPassword, request.newPassword, request.confirmPassword);
    }
  }
}

export default UserAccountService;
