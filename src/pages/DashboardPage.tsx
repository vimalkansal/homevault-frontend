import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Card, CardTitle, CardContent } from '../components/common/Card';
import { ItemCard } from '../components/items/ItemCard';
import { SearchBar } from '../components/common/SearchBar';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { Empty, EmptyIcon } from '../components/common/Empty';
import { QuickAddModal } from '../components/items/QuickAddModal';
import { itemService } from '../services/item.service';
import { useDebounce } from '../hooks/useDebounce';

export const DashboardPage = () => {
  const [search, setSearch] = useState('');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  const { data: recentItems, isLoading, refetch } = useQuery({
    queryKey: ['items', 'recent'],
    queryFn: () => itemService.getRecentItems(6),
  });

  const { data: allItems } = useQuery({
    queryKey: ['items', 'stats'],
    queryFn: () => itemService.getItems(),
  });

  const handleQuickAdd = async (data: { name: string; location: string }) => {
    await itemService.quickAddItem(data);
    setShowQuickAdd(false);
    refetch();
  };

  const totalItems = allItems?.data?.length || 0;
  const totalPhotos = allItems?.data?.reduce((acc, item) => acc + (item.photos?.length || 0), 0) || 0;
  const recentCount = recentItems?.data?.filter(item => {
    const createdAt = new Date(item.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return createdAt > weekAgo;
  }).length || 0;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome to your HomeVault</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowQuickAdd(true)}>Quick Add</Button>
            <Link to="/items/add"><Button variant="primary">Add Item</Button></Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hover>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Items</p>
                  <p className="text-3xl font-bold text-gray-900">{totalItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Photos</p>
                  <p className="text-3xl font-bold text-gray-900">{totalPhotos}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Added This Week</p>
                  <p className="text-3xl font-bold text-gray-900">{recentCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <CardTitle>Recent Items</CardTitle>
              <Link to="/items"><Button variant="outline" size="sm">View All</Button></Link>
            </div>
            {isLoading ? (
              <div className="py-12"><Spinner size="md" text="Loading items..." /></div>
            ) : recentItems?.data && recentItems.data.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentItems.data.map((item) => <ItemCard key={item.id} item={item} showActions={false} />)}
              </div>
            ) : (
              <Empty icon={<EmptyIcon />} title="No items yet" description="Start by adding your first item to keep track of your belongings" action={<Link to="/items/add"><Button variant="primary">Add Your First Item</Button></Link>} />
            )}
          </CardContent>
        </Card>
      </div>

      <QuickAddModal isOpen={showQuickAdd} onClose={() => setShowQuickAdd(false)} onSubmit={handleQuickAdd} />
    </Layout>
  );
};
