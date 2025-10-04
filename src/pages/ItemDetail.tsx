import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { itemService } from '../services/item.service';
import { Layout } from '../components/layout/Layout';
import toast from 'react-hot-toast';

export const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: item, isLoading, error } = useQuery({
    queryKey: ['item', id],
    queryFn: () => itemService.getItem(id!),
    enabled: !!id,
  });

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await itemService.deleteItem(id!);
      toast.success('Item deleted successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-12">Loading item details...</div>
      </Layout>
    );
  }

  if (error || !item) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Failed to load item details</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Back to Dashboard
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-4 text-blue-600 hover:text-blue-700 flex items-center"
        >
          &larr; Back to Dashboard
        </button>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {item.photos && item.photos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 bg-gray-50">
              {item.photos.map((photo) => (
                <img
                  key={photo.id}
                  src={photo.url}
                  alt={item.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              ))}
            </div>
          )}

          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{item.name}</h1>

            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Location:</span>
                <p className="text-lg text-gray-900">{item.location}</p>
              </div>

              {item.description && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Description:</span>
                  <p className="text-gray-700">{item.description}</p>
                </div>
              )}

              {item.categories && item.categories.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-500 block mb-2">Categories:</span>
                  <div className="flex flex-wrap gap-2">
                    {item.categories.map((category, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <span className="text-sm font-medium text-gray-500">Created:</span>
                <p className="text-gray-700">
                  {new Date(item.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium"
              >
                Back to Dashboard
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md font-medium"
              >
                Delete Item
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
