import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemService } from '../services/item.service';
import type { ItemSearchParams, CreateItemRequest, UpdateItemRequest } from '../types';
import toast from 'react-hot-toast';

/**
 * Hook to fetch items with search/filter params
 */
export const useItems = (params?: ItemSearchParams) => {
  return useQuery({
    queryKey: ['items', params],
    queryFn: () => itemService.getItems(params),
    staleTime: 30000, // 30 seconds
  });
};

/**
 * Hook to fetch single item by ID
 */
export const useItem = (id: string) => {
  return useQuery({
    queryKey: ['item', id],
    queryFn: () => itemService.getItem(id),
    enabled: !!id,
  });
};

/**
 * Hook to fetch item history
 */
export const useItemHistory = (id: string) => {
  return useQuery({
    queryKey: ['itemHistory', id],
    queryFn: () => itemService.getItemHistory(id),
    enabled: !!id,
  });
};

/**
 * Hook to create new item
 */
export const useCreateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateItemRequest) => itemService.createItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('Item created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create item');
    },
  });
};

/**
 * Hook to update item
 */
export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateItemRequest }) =>
      itemService.updateItem(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['item', variables.id] });
      toast.success('Item updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update item');
    },
  });
};

/**
 * Hook to delete item
 */
export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => itemService.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('Item deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete item');
    },
  });
};

/**
 * Hook to upload photos with progress tracking
 */
export const useUploadPhotos = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      photos,
      onProgress,
    }: {
      itemId: string;
      photos: File[];
      onProgress?: (progress: number) => void;
    }) => itemService.uploadPhotos(itemId, photos, onProgress),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['item', variables.itemId] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('Photos uploaded successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload photos');
    },
  });
};

/**
 * Hook to search items
 */
export const useSearchItems = (searchText: string, filters?: Partial<ItemSearchParams>) => {
  return useQuery({
    queryKey: ['items', 'search', searchText, filters],
    queryFn: () => itemService.searchItems(searchText, filters),
    enabled: searchText.length > 0,
    staleTime: 10000, // 10 seconds
  });
};

/**
 * Hook to get recent items
 */
export const useRecentItems = (limit: number = 10) => {
  return useQuery({
    queryKey: ['items', 'recent', limit],
    queryFn: () => itemService.getRecentItems(limit),
  });
};
