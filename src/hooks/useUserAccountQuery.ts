import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserAccountService } from "@/service/user-account";
import { USER_PROFILE_KEY } from "@/types/user-account";

export function useUserProfileQuery() {
  const { data, isLoading, error } = useQuery({
    queryKey: USER_PROFILE_KEY,
    queryFn: () => UserAccountService.getUserProfile(),
    select: (res) => res.data,
  });

  return {
    profile: data,
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
  };
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ name, email }: { name: string; email: string }) => 
      UserAccountService.updateProfile({ name, email }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_KEY });
    },
  });
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: ({ 
      currentPassword, 
      newPassword, 
      confirmPassword 
    }: { 
      currentPassword: string; 
      newPassword: string; 
      confirmPassword: string; 
    }) => UserAccountService.changePassword({ 
      currentPassword, 
      newPassword, 
      confirmPassword 
    }),
  });
}
