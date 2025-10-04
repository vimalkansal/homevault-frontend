import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { ItemForm, ItemFormData } from '../components/items/ItemForm';
import { Card } from '../components/common/Card';
import { useCreateItem } from '../hooks/useItems';
import { useCategories } from '../hooks/useCategories';

export const AddItemPage = () => {
  const navigate = useNavigate();
  const createItem = useCreateItem();
  const { data: categories } = useCategories();

  const handleSubmit = async (data: ItemFormData) => {
    const item = await createItem.mutateAsync(data);
    navigate(`/items/${item.id}`);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link to="/items" className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Items
          </Link>
        </div>
        <Card><h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Item</h1><ItemForm categories={categories?.data || []} onSubmit={handleSubmit} onCancel={() => navigate('/items')} isLoading={createItem.isPending} /></Card>
      </div>
    </Layout>
  );
};
