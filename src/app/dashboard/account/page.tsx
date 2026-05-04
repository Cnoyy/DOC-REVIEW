"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { layout as l } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserProfileQuery, useUpdateProfileMutation, useChangePasswordMutation } from "@/hooks/useUserAccountQuery";
import { showSuccessToast } from "@/components/toasts/SuccessToast";
import { showErrorToast } from "@/components/toasts/ErrorToast";
import { showValidationToast } from "@/components/toasts/ValidationToast";

export default function AccountSettingsPage() {
  const router = useRouter();
  const { profile, loading, error } = useUserProfileQuery();
  const updateProfileMutation = useUpdateProfileMutation();
  const changePasswordMutation = useChangePasswordMutation();

  // Profile form state
  const [name, setName] = useState(profile?.name || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [originalName, setOriginalName] = useState(profile?.name || "");
  const [originalEmail, setOriginalEmail] = useState(profile?.email || "");

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
      setOriginalName(profile.name);
      setOriginalEmail(profile.email);
    }
  }, [profile]);

  // Validation functions
  const validateName = useCallback((value: string) => {
    return value.trim().length >= 2;
  }, []);

  const validateEmail = useCallback((value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }, []);

  // Check if profile has changes
  const hasProfileChanges = name !== originalName || email !== originalEmail;

  // Handle profile update
  const handleUpdateProfile = useCallback(async () => {
    if (!hasProfileChanges) {
      showValidationToast("No changes required");
      return;
    }

    if (!validateName(name) || !validateEmail(email)) {
      showValidationToast("Please fill in valid name and email");
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({ name, email });
      setOriginalName(name);
      setOriginalEmail(email);
      showSuccessToast("Profile updated successfully");
    } catch (error) {
      showErrorToast("Failed to update profile");
    }
  }, [name, email, hasProfileChanges, updateProfileMutation]);

  // Handle password change
  const handleChangePassword = useCallback(async () => {
    // Validate all fields are filled
    if (!currentPassword || !newPassword || !confirmPassword) {
      showValidationToast("Please fill in all password fields");
      return;
    }

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      showValidationToast("New password and confirm password must match");
      return;
    }

    // Validate password length
    if (newPassword.length < 8) {
      showValidationToast("Password must be at least 8 characters long");
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      showSuccessToast("Password changed successfully");
      
      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      showErrorToast("Failed to change password");
    }
  }, [currentPassword, newPassword, confirmPassword, changePasswordMutation]);

  // Check if password form is valid
  const isPasswordFormValid = currentPassword && newPassword && confirmPassword && 
    newPassword === confirmPassword && newPassword.length >= 8;

  if (loading) {
    return (
      <div className={l.page}>
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <Skeleton className="h-8 w-64 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <Skeleton className="h-8 w-64 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={l.page}>
      <div className="space-y-6">
        
        {/* Profile Information */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                User Name
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="border-gray-300 focus:border-gray-400 focus:ring-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="border-gray-300 focus:border-gray-400 focus:ring-gray-400"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="mybutton"
                onClick={handleUpdateProfile}
                disabled={updateProfileMutation.isPending}
                className="flex items-center gap-2"
              >
                {updateProfileMutation.isPending ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  <User className="h-4 w-4" />
                )}
                Update Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Change Password
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <Input
                  type={showPasswords.current ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="border-gray-300 focus:border-gray-400 focus:ring-gray-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <Input
                  type={showPasswords.new ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="border-gray-300 focus:border-gray-400 focus:ring-gray-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="border-gray-300 focus:border-gray-400 focus:ring-gray-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="mybutton"
                onClick={handleChangePassword}
                disabled={changePasswordMutation.isPending}
                className="flex items-center gap-2"
              >
                {changePasswordMutation.isPending ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                Change Password
              </Button>
              
              <Button
                variant="mycancel"
                onClick={() => {
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                disabled={changePasswordMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
