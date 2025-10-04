import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { PhotoGallery } from '../components/items/PhotoGallery';
import { ItemHistory } from '../components/items/ItemHistory';
import { PhotoUploader } from '../components/items/PhotoUploader';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useItem, useItemHistory, useDeleteItem } from '../hooks/useItems';

export const ItemDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showUploader, setShowUploader] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: item, isLoading, refetch } = useItem(id!);
  const { data: history } = useItemHistory(id!);
  const deleteItem = useDeleteItem();

  const handleDelete = async () => {
    await deleteItem.mutateAsync(id!);
    navigate('/items');
  };

  if (isLoading) {
    return (<Layout><div className="py-12"><Spinner size="lg" text="Loading item..." /></div></Layout>);
  }

  if (!item) {
    return (<Layout><div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Item not found</h2><Link to="/items"><Button className="mt-4" variant="primary">Back to Items</Button></Link></div></Layout>);
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/items" className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Items
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowUploader(true)}>Add Photos</Button>
            <Link to={`/items/${id}/edit`}><Button variant="secondary">Edit</Button></Link>
            <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>Delete</Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{item.name}</h1>
          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span>{item.location}</span>
          </div>
          {item.description && <p className="text-gray-700 mb-4">{item.description}</p>}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {item.tags.map((tag) => <Badge key={tag.categoryId} variant="primary">{tag.category.name}</Badge>)}
            </div>
          )}
          <div className="flex gap-6 text-sm text-gray-500 border-t pt-4">
            <div><span className="font-medium">Created:</span> {new Date(item.createdAt).toLocaleDateString()}</div>
            <div><span className="font-medium">Updated:</span> {new Date(item.updatedAt).toLocaleDateString()}</div>
            <div><span className="font-medium">Photos:</span> {item.photos?.length || 0}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Photos</h2>
            <Button variant="outline" size="sm" onClick={() => setShowUploader(true)}>Add More</Button>
          </div>
          <PhotoGallery photos={item.photos || []} itemName={item.name} />
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">History</h2>
          <ItemHistory history={history?.data || []} />
        </div>
      </div>

      <Modal isOpen={showUploader} onClose={() => setShowUploader(false)} title="Upload Photos" size="lg">
        <PhotoUploader itemId={id!} onUploadComplete={() => { setShowUploader(false); refetch(); }} onCancel={() => setShowUploader(false)} />
      </Modal>

      <ConfirmDialog isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} onConfirm={handleDelete} title="Delete Item" message="Are you sure you want to delete this item? This will also delete all associated photos. This action cannot be undone." confirmText="Delete" variant="danger" isLoading={deleteItem.isPending} />
    </Layout>
  );
};
