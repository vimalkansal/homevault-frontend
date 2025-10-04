import { useMutation, useQueryClient } from '@tanstack/react-query';
import { photoService } from '../services/photo.service';
import type { UpdatePhotoRequest } from '../types';
import toast from 'react-hot-toast';

/**
 * Hook to update photo (annotations, display order)
 */
export const useUpdatePhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePhotoRequest }) =>
      photoService.updatePhoto(id, data),
    onSuccess: (photo) => {
      queryClient.invalidateQueries({ queryKey: ['item', photo.itemId] });
      toast.success('Photo updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update photo');
    },
  });
};

/**
 * Hook to delete photo
 */
export const useDeletePhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => photoService.deletePhoto(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('Photo deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete photo');
    },
  });
};

/**
 * Hook to download photo
 */
export const useDownloadPhoto = () => {
  return useMutation({
    mutationFn: ({ id, filename }: { id: string; filename: string }) =>
      photoService.downloadPhoto(id, filename),
    onSuccess: () => {
      toast.success('Photo downloaded!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to download photo');
    },
  });
};
