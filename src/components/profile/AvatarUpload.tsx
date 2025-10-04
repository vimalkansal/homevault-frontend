import { useState, useRef, DragEvent } from 'react';
import { Button } from '../common/Button';
import { useUploadAvatar, useDeleteAvatar } from '../../hooks/useUser';
import { UserProfile, userService } from '../../services/user.service';
import toast from 'react-hot-toast';

interface AvatarUploadProps {
  user?: UserProfile;
  onUploadSuccess?: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const AvatarUpload = ({ user, onUploadSuccess }: AvatarUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadAvatar();
  const deleteMutation = useDeleteAvatar();

  const validateFile = (file: File): boolean => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Only JPG, PNG, and WebP images are allowed');
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size must be less than 5MB');
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    if (!validateFile(file)) {
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      await uploadMutation.mutateAsync(selectedFile);
      setPreview(null);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onUploadSuccess?.();
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your avatar?')) {
      return;
    }

    try {
      await deleteMutation.mutateAsync();
      onUploadSuccess?.();
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleCancelPreview = () => {
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const currentAvatarUrl = user?.avatarUrl ? userService.getAvatarUrl(user.avatarUrl) : null;

  return (
    <div className="space-y-4">
      {/* Current Avatar */}
      {currentAvatarUrl && !preview && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Current Avatar</p>
          <div className="flex items-center gap-4">
            <img
              src={currentAvatarUrl}
              alt="Current avatar"
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            />
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              isLoading={deleteMutation.isPending}
              disabled={deleteMutation.isPending}
            >
              Delete Avatar
            </Button>
          </div>
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Preview</p>
          <div className="flex items-center gap-4">
            <img
              src={preview}
              alt="Preview"
              className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
            />
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleUpload}
                isLoading={uploadMutation.isPending}
                disabled={uploadMutation.isPending}
              >
                Upload
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelPreview}
                disabled={uploadMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Area */}
      {!preview && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">
            {currentAvatarUrl ? 'Change Avatar' : 'Upload Avatar'}
          </p>
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={ALLOWED_TYPES.join(',')}
              onChange={handleFileInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="mt-4 text-sm text-gray-600">
                <span className="font-medium text-blue-600 hover:text-blue-500">
                  Click to upload
                </span>{' '}
                or drag and drop
              </div>
              <p className="mt-1 text-xs text-gray-500">
                JPG, PNG, or WebP up to 5MB
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
