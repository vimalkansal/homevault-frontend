import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { ItemCard } from '../components/items/ItemCard';
import { ItemList } from '../components/items/ItemList';
import { ItemFilters } from '../components/items/ItemFilters';
import { SearchBar } from '../components/common/SearchBar';
import { Pagination } from '../components/common/Pagination';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { Empty, EmptyIcon } from '../components/common/Empty';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { QuickAddModal } from '../components/items/QuickAddModal';
import { useDeleteItem } from '../hooks/useItems';
import { useCategories } from '../hooks/useCategories';
import { itemService } from '../services/item.service';
import { useDebounce } from '../hooks/useDebounce';

export const ItemsPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  const { data: categories } = useCategories();
  const deleteItem = useDeleteItem();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['items', debouncedSearch, selectedCategories, sortBy, sortOrder, dateFrom, dateTo, page],
    queryFn: () => itemService.getItems({
      search: debouncedSearch,
      category: selectedCategories.length > 0 ? selectedCategories.join(',') : undefined,
      sortBy,
      sortOrder,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      page,
      limit: 12,
    }),
  });

  const handleDelete = (id: string) => setDeleteItemId(id);
  const confirmDelete = async () => {
    if (deleteItemId) {
      await deleteItem.mutateAsync(deleteItemId);
      setDeleteItemId(null);
      refetch();
    }
  };

  const handleReset = () => {
    setSearch('');
    setSelectedCategories([]);
    setSortBy('createdAt');
    setSortOrder('desc');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  const handleQuickAdd = async (data: { name: string; location: string }) => {
    await itemService.quickAddItem(data);
    setShowQuickAdd(false);
    refetch();
  };

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="w-full lg:w-64 flex-shrink-0">
          <ItemFilters
            categories={categories || []}
            selectedCategories={selectedCategories}
            onCategoriesChange={setSelectedCategories}
            sortBy={sortBy}
            onSortChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            dateFrom={dateFrom}
            dateTo={dateTo}
            onDateFromChange={setDateFrom}
            onDateToChange={setDateTo}
            onReset={handleReset}
          />
        </aside>

        <main className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">All Items</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowQuickAdd(true)}>Quick Add</Button>
              <Link to="/items/add"><Button variant="primary">Add New Item</Button></Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <SearchBar value={search} onChange={setSearch} placeholder="Search items..." debounceMs={300} />
            </div>
            <div className="flex gap-2 bg-white rounded-lg border border-gray-200 p-1">
              <button onClick={() => setViewMode('grid')} className={`px-3 py-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              </button>
              <button onClick={() => setViewMode('list')} className={`px-3 py-2 rounded transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="py-12"><Spinner size="lg" text="Loading items..." /></div>
          ) : data?.data.length === 0 ? (
            <Empty icon={<EmptyIcon />} title="No items found" description="Try adjusting your filters or add a new item" action={<Link to="/items/add"><Button variant="primary">Add Your First Item</Button></Link>} />
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{data?.data.map((item) => <ItemCard key={item.id} item={item} onDelete={handleDelete} />)}</div>
              ) : (
                <div className="space-y-4">{data?.data.map((item) => <ItemList key={item.id} item={item} onDelete={handleDelete} />)}</div>
              )}
              {data?.pagination && data.pagination.pages > 1 && (
                <div className="mt-8"><Pagination currentPage={page} totalPages={data.pagination.pages} onPageChange={setPage} /></div>
              )}
            </>
          )}
        </main>
      </div>

      <ConfirmDialog isOpen={deleteItemId !== null} onClose={() => setDeleteItemId(null)} onConfirm={confirmDelete} title="Delete Item" message="Are you sure you want to delete this item? This action cannot be undone." confirmText="Delete" variant="danger" isLoading={deleteItem.isPending} />
      <QuickAddModal isOpen={showQuickAdd} onClose={() => setShowQuickAdd(false)} onSubmit={handleQuickAdd} />
    </Layout>
  );
};
