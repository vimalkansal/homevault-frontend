import api from './api';
import type {
  Photo,
  PhotoResponse,
  UpdatePhotoRequest,
  MessageResponse
} from '../types';

export const photoService = {
  /**
   * Update photo (annotations or display order)
   */
  async updatePhoto(id: string, data: UpdatePhotoRequest): Promise<Photo> {
    const response = await api.put<PhotoResponse>(`/photos/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete photo
   */
  async deletePhoto(id: string): Promise<void> {
    await api.delete<MessageResponse>(`/photos/${id}`);
  },

  /**
   * Get photo file URL
   */
  getPhotoUrl(photoId: string): string {
    const token = localStorage.getItem('token');
    return `${api.defaults.baseURL}/photos/${photoId}/file${token ? `?token=${token}` : ''}`;
  },

  /**
   * Download photo file
   */
  async downloadPhoto(photoId: string, filename: string): Promise<void> {
    try {
      const response = await api.get(`/photos/${photoId}/file`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data]);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      throw error;
    }
  }
};
