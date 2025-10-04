import api from './api';
import type {
  Category,
  CategoryResponse,
  CategoriesResponse,
  CreateCategoryRequest,
  MessageResponse
} from '../types';

export const categoryService = {
  /**
   * Get all categories
   */
  async getCategories(): Promise<Category[]> {
    const response = await api.get<CategoriesResponse>('/categories');
    return response.data.data;
  },

  /**
   * Get only predefined categories
   */
  async getPredefinedCategories(): Promise<Category[]> {
    const response = await api.get<CategoriesResponse>('/categories/predefined');
    return response.data.data;
  },

  /**
   * Create custom category
   */
  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    const response = await api.post<CategoryResponse>('/categories', data);
    return response.data.data;
  },

  /**
   * Update category name
   */
  async updateCategory(id: string, data: CreateCategoryRequest): Promise<Category> {
    const response = await api.put<CategoryResponse>(`/categories/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete custom category
   */
  async deleteCategory(id: string): Promise<void> {
    await api.delete<MessageResponse>(`/categories/${id}`);
  }
};
