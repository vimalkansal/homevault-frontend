import { Link } from 'react-router-dom';
import { Item } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { cn } from '../../utils/cn';

interface ItemCardProps {
  item: Item;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export const ItemCard = ({ item, onDelete, showActions = true }: ItemCardProps) => {
  const primaryPhoto = item.photos?.[0];
  const photoUrl = primaryPhoto ? `/api/photos/${primaryPhoto.id}/file` : null;

  return (
    <Card padding="none" hover className="overflow-hidden">
      <Link to={`/items/${item.id}`}>
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={item.name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <svg
              className="h-20 w-20 text-gray-400"
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

      <div className="p-4">
        <Link to={`/items/${item.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1">
            {item.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center text-sm text-gray-600">
          <svg
            className="h-4 w-4 mr-1"
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
          <span className="line-clamp-1">{item.location}</span>
        </div>

        {item.description && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {item.description}
          </p>
        )}

        {item.tags && item.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((tag) => (
              <Badge key={tag.categoryId} variant="primary" size="sm">
                {tag.category.name}
              </Badge>
            ))}
            {item.tags.length > 3 && (
              <Badge variant="default" size="sm">
                +{item.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="mt-3 flex items-center text-xs text-gray-500">
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{item.photos?.length || 0} photos</span>
        </div>

        {showActions && (
          <div className="mt-4 flex gap-2">
            <Link
              to={`/items/${item.id}`}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              View
            </Link>
            <Link
              to={`/items/${item.id}/edit`}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-center px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Edit
            </Link>
            {onDelete && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onDelete(item.id);
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
