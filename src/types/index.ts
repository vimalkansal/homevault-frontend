// ==================== User Types ====================
export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
}

// ==================== Item Types ====================
export interface Item {
  id: string;
  name: string;
  description?: string;
  location: string;
  createdById?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    id: string;
    fullName: string;
    email: string;
  };
  photos: Photo[];
  tags: ItemTag[];
}

export interface Photo {
  id: string;
  itemId: string;
  filePath: string;
  fileSize?: number;
  annotations?: PhotoAnnotation;
  displayOrder: number;
  createdAt: string;
}

export interface PhotoAnnotation {
  shapes?: AnnotationShape[];
  texts?: AnnotationText[];
}

export interface AnnotationShape {
  id: string;
  type: 'rectangle' | 'circle' | 'arrow' | 'line' | 'freehand';
  points?: { x: number; y: number }[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  radius?: number;
  x2?: number;
  y2?: number;
  color: string;
  strokeWidth: number;
}

export interface AnnotationText {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  color: string;
  fontWeight?: 'normal' | 'bold';
}

export interface ItemTag {
  itemId: string;
  categoryId: string;
  createdAt: string;
  category: Category;
}

export interface Category {
  id: string;
  name: string;
  type: 'predefined' | 'custom';
  createdById?: string;
  createdAt: string;
}

export interface ItemHistory {
  id: string;
  itemId: string;
  userId?: string;
  action: string;
  fieldChanged?: string;
  oldValue?: string;
  newValue?: string;
  timestamp: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message?: string;
  read: boolean;
  createdAt: string;
}

// ==================== API Request Types ====================
export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateItemRequest {
  name: string;
  description?: string;
  location: string;
  categories?: string[];
}

export interface UpdateItemRequest {
  name?: string;
  description?: string;
  location?: string;
  categories?: string[];
}

export interface UpdatePhotoRequest {
  annotations?: PhotoAnnotation;
  displayOrder?: number;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface ItemSearchParams {
  search?: string;
  category?: string;
  createdBy?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UpdateProfileRequest {
  fullName?: string;
  avatarUrl?: string;
}

// ==================== API Response Types ====================
export interface AuthResponse {
  success: boolean;
  data: {
    user: AuthUser;
    token: string;
  };
}

export interface UserResponse {
  success: boolean;
  data: User;
}

export interface ItemResponse {
  success: boolean;
  data: Item;
}

export interface ItemsResponse {
  success: boolean;
  data: Item[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PhotoResponse {
  success: boolean;
  data: Photo;
}

export interface PhotosResponse {
  success: boolean;
  data: Photo[];
}

export interface CategoryResponse {
  success: boolean;
  data: Category;
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

export interface ItemHistoryResponse {
  success: boolean;
  data: ItemHistory[];
}

export interface NotificationsResponse {
  success: boolean;
  data: Notification[];
}

export interface MessageResponse {
  success: boolean;
  message: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: any;
  statusCode?: number;
}

// ==================== Dashboard & Stats ====================
export interface DashboardStats {
  totalItems: number;
  totalPhotos: number;
  recentlyAdded: number;
  categoriesUsed: number;
  itemsByCategory: { category: string; count: number }[];
  recentActivity: ItemHistory[];
}

// ==================== UI State Types ====================
export interface FilterState {
  search: string;
  categories: string[];
  dateRange: {
    from?: Date;
    to?: Date;
  };
  createdBy?: string;
  sortBy: 'name' | 'createdAt' | 'updatedAt' | 'location';
  sortOrder: 'asc' | 'desc';
}

export interface ViewMode {
  type: 'grid' | 'list' | 'table';
}

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
  error?: string;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}
