export interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  lastLogin: string;
}

export interface UserProfileResponse {
  success: boolean;
  data: UserProfile;
  message?: string;
}

export interface UpdateProfileRequest {
  name: string;
  email: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  data: UserProfile;
  message: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

// TanStack Query keys
export const USER_PROFILE_KEY = ["user-profile"] as const;
