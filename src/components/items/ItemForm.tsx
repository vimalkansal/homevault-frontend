import { useState, useEffect } from 'react';
import { Item, Category } from '../../types';
import { Input } from '../common/Input';
import { Textarea } from '../common/Textarea';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface ItemFormProps {
  item?: Item;
  categories: Category[];
  onSubmit: (data: ItemFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export interface ItemFormData {
  name: string;
  description: string;
  location: string;
  categories: string[];
}

export const ItemForm = ({
  item,
  categories,
  onSubmit,
  onCancel,
  isLoading = false,
}: ItemFormProps) => {
  const [formData, setFormData] = useState<ItemFormData>({
    name: item?.name || '',
    description: item?.description || '',
    location: item?.location || '',
    categories: item?.tags?.map((tag) => tag.categoryId) || [],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ItemFormData, string>>>({});

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description || '',
        location: item.location,
        categories: item.tags?.map((tag) => tag.categoryId) || [],
      });
    }
  }, [item]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ItemFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof ItemFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const toggleCategory = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Item Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
        placeholder="e.g., Samsung TV Remote"
        disabled={isLoading}
      />

      <Input
        label="Location"
        name="location"
        value={formData.location}
        onChange={handleChange}
        error={errors.location}
        required
        placeholder="e.g., Living Room Drawer"
        disabled={isLoading}
        leftIcon={
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        }
      />

      <Textarea
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
        placeholder="Add any additional details about this item..."
        rows={4}
        disabled={isLoading}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Categories
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map((category) => {
            const isSelected = formData.categories.includes(category.id);
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => toggleCategory(category.id)}
                disabled={isLoading}
                className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <span>{category.name}</span>
                  {isSelected && (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        {formData.categories.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {formData.categories.map((categoryId) => {
              const category = categories.find((c) => c.id === categoryId);
              return category ? (
                <Badge key={categoryId} variant="primary">
                  {category.name}
                </Badge>
              ) : null;
            })}
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {item ? 'Update Item' : 'Create Item'}
        </Button>
      </div>
    </form>
  );
};
