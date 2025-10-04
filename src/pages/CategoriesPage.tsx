import { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { Spinner } from '../components/common/Spinner';
import { Empty, EmptyIcon } from '../components/common/Empty';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useCategories, useCreateCategory, useDeleteCategory } from '../hooks/useCategories';

export const CategoriesPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  const handleAdd = async () => {
    if (newCategoryName.trim()) {
      await createCategory.mutateAsync({ name: newCategoryName });
      setNewCategoryName('');
      setShowAddModal(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteCategory.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const customCategories = categories?.filter(c => c.type === 'custom') || [];
  const predefinedCategories = categories?.filter(c => c.type === 'predefined') || [];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>Add Category</Button>
        </div>

        {isLoading ? (
          <div className="py-12"><Spinner size="lg" text="Loading categories..." /></div>
        ) : (
          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Categories</h2>
              {customCategories.length === 0 ? (
                <Empty icon={<EmptyIcon />} title="No custom categories" description="Create categories to organize your items" />
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {customCategories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <Badge variant="primary">{category.name}</Badge>
                      <button onClick={() => setDeleteId(category.id)} className="text-red-500 hover:text-red-700 transition-colors">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Predefined Categories</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {predefinedCategories.map((category) => <Badge key={category.id} variant="default">{category.name}</Badge>)}
              </div>
            </Card>
          </div>
        )}
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Category" size="sm">
        <div className="space-y-4">
          <Input label="Category Name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="e.g., Electronics" required autoFocus />
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAdd} isLoading={createCategory.isPending} disabled={!newCategoryName.trim()}>Add</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Category" message="Are you sure you want to delete this category?" confirmText="Delete" variant="danger" isLoading={deleteCategory.isPending} />
    </Layout>
  );
};
