import api, { uploadFile, buildQueryString } from './api';
import type {
  Item,
  ItemResponse,
  ItemsResponse,
  CreateItemRequest,
  UpdateItemRequest,
  ItemSearchParams,
  ItemHistoryResponse,
  PhotoResponse,
  PhotosResponse,
  MessageResponse
} from '../types';

export const itemService = {
  /**
   * Get all items with optional search/filter parameters
   */
  async getItems(params?: ItemSearchParams): Promise<ItemsResponse> {
    const queryString = params ? buildQueryString(params) : '';
    const response = await api.get<ItemsResponse>(`/items${queryString}`);
    return response.data;
  },

  /**
   * Get single item by ID
   */
  async getItem(id: string): Promise<Item> {
    const response = await api.get<ItemResponse>(`/items/${id}`);
    return response.data.data;
  },

  /**
   * Create new item
   */
  async createItem(data: CreateItemRequest): Promise<Item> {
    const response = await api.post<ItemResponse>('/items', data);
    return response.data.data;
  },

  /**
   * Quick add item with minimal data
   */
  async quickAddItem(data: { name: string; location: string }): Promise<Item> {
    const response = await api.post<ItemResponse>('/items/quick', data);
    return response.data.data;
  },

  /**
   * Update existing item
   */
  async updateItem(id: string, data: UpdateItemRequest): Promise<Item> {
    const response = await api.put<ItemResponse>(`/items/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete item
   */
  async deleteItem(id: string): Promise<void> {
    await api.delete<MessageResponse>(`/items/${id}`);
  },

  /**
   * Get item history
   */
  async getItemHistory(id: string): Promise<ItemHistoryResponse> {
    const response = await api.get<ItemHistoryResponse>(`/items/${id}/history`);
    return response.data;
  },

  /**
   * Upload photos to item with progress tracking
   */
  async uploadPhotos(
    itemId: string,
    photos: File[],
    onProgress?: (progress: number) => void
  ): Promise<PhotosResponse> {
    const formData = new FormData();
    photos.forEach((photo) => {
      formData.append('photos', photo);
    });

    const response = await uploadFile(`/items/${itemId}/photos`, formData, onProgress);
    return response.data;
  },

  /**
   * Get photo file URL
   */
  getPhotoUrl(photoId: string): string {
    return `${api.defaults.baseURL}/photos/${photoId}/file`;
  },

  /**
   * Search items by text
   */
  async searchItems(searchText: string, filters?: Partial<ItemSearchParams>): Promise<ItemsResponse> {
    const params: ItemSearchParams = {
      search: searchText,
      ...filters
    };
    return this.getItems(params);
  },

  /**
   * Get items by category
   */
  async getItemsByCategory(category: string): Promise<ItemsResponse> {
    return this.getItems({ category });
  },

  /**
   * Get recent items
   */
  async getRecentItems(limit: number = 10): Promise<ItemsResponse> {
    return this.getItems({
      sortBy: 'createdAt',
      sortOrder: 'desc',
      limit
    });
  }
};
