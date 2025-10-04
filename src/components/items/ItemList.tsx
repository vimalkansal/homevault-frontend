import { Link } from 'react-router-dom';
import { Item } from '../../types';
import { Badge } from '../common/Badge';

interface ItemListProps {
  item: Item;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export const ItemList = ({ item, onDelete, showActions = true }: ItemListProps) => {
  const primaryPhoto = item.photos?.[0];
  const photoUrl = primaryPhoto ? `/api/photos/${primaryPhoto.id}/file` : null;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow">
      <div className="flex gap-4">
        <Link to={`/items/${item.id}`} className="flex-shrink-0">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-md"
            />
          ) : (
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-md flex items-center justify-center">
              <svg
                className="h-10 w-10 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <Link to={`/items/${item.id}`}>
                <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors truncate">
                  {item.name}
                </h3>
              </Link>

              <div className="mt-1 flex items-center text-sm text-gray-600">
                <svg
                  className="h-4 w-4 mr-1 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="truncate">{item.location}</span>
              </div>

              {item.description && (
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {item.description}
                </p>
              )}

              <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {item.photos?.length || 0} photos
                </span>
                <span>
                  Added {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>

              {item.tags && item.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {item.tags.map((tag) => (
                    <Badge key={tag.categoryId} variant="primary" size="sm">
                      {tag.category.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {showActions && (
              <div className="ml-4 flex flex-col gap-2">
                <Link
                  to={`/items/${item.id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-center px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
                >
                  View
                </Link>
                <Link
                  to={`/items/${item.id}/edit`}
                  className="bg-gray-600 hover:bg-gray-700 text-white text-center px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
                >
                  Edit
                </Link>
                {onDelete && (
                  <button
                    onClick={() => onDelete(item.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
