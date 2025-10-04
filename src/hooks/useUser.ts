import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, UserProfile } from '../services/user.service';
import toast from 'react-hot-toast';

/**
 * Hook to fetch user profile
 */
export const useUserProfile = () => {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => userService.getProfile(),
    staleTime: 60000, // 1 minute
  });
};

/**
 * Hook to update user profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { fullName: string }) => userService.updateProfile(data),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(['user', 'profile'], updatedProfile);
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      toast.success('Profile updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
};

/**
 * Hook to upload avatar
 */
export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => userService.uploadAvatar(file),
    onSuccess: (avatarUrl) => {
      // Update the cached user profile with the new avatar URL
      queryClient.setQueryData(['user', 'profile'], (oldData: UserProfile | undefined) => {
        if (!oldData) return oldData;
        return { ...oldData, avatarUrl };
      });
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      toast.success('Avatar uploaded successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload avatar');
    },
  });
};

/**
 * Hook to delete avatar
 */
export const useDeleteAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userService.deleteAvatar(),
    onSuccess: () => {
      // Remove avatar URL from cached user profile
      queryClient.setQueryData(['user', 'profile'], (oldData: UserProfile | undefined) => {
        if (!oldData) return oldData;
        return { ...oldData, avatarUrl: undefined };
      });
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      toast.success('Avatar deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete avatar');
    },
  });
};
