import api from './api';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export const userService = {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserProfile> {
    const response = await api.get('/users/profile');
    return response.data.data;
  },

  /**
   * Update profile
   */
  async updateProfile(data: { fullName: string }): Promise<UserProfile> {
    const response = await api.put('/users/profile', data);
    return response.data.data;
  },

  /**
   * Upload avatar
   */
  async uploadAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return response.data.data.avatarUrl;
  },

  /**
   * Delete avatar
   */
  async deleteAvatar(): Promise<void> {
    await api.delete('/users/avatar');
  },

  /**
   * Get avatar URL for display
   */
  getAvatarUrl(avatarUrl?: string): string | null {
    if (!avatarUrl) return null;

    const apiUrl = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:3000';
    return `${apiUrl}/uploads/${avatarUrl}`;
  },

  /**
   * Get user initials for fallback avatar
   */
  getUserInitials(fullName: string): string {
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  }
};
