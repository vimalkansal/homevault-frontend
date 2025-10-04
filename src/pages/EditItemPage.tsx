import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { ItemForm, ItemFormData } from '../components/items/ItemForm';
import { Card } from '../components/common/Card';
import { Spinner } from '../components/common/Spinner';
import { useItem, useUpdateItem } from '../hooks/useItems';
import { useCategories } from '../hooks/useCategories';

export const EditItemPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: item, isLoading } = useItem(id!);
  const { data: categories } = useCategories();
  const updateItem = useUpdateItem();

  const handleSubmit = async (data: ItemFormData) => {
    await updateItem.mutateAsync({ id: id!, data });
    navigate(`/items/${id}`);
  };

  if (isLoading) {
    return (<Layout><div className="py-12"><Spinner size="lg" text="Loading item..." /></div></Layout>);
  }

  if (!item) {
    return (<Layout><div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Item not found</h2></div></Layout>);
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link to={`/items/${id}`} className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Item
          </Link>
        </div>
        <Card><h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Item</h1><ItemForm item={item} categories={categories?.data || []} onSubmit={handleSubmit} onCancel={() => navigate(`/items/${id}`)} isLoading={updateItem.isPending} /></Card>
      </div>
    </Layout>
  );
};
