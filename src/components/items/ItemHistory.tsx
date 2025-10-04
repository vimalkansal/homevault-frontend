import { ItemHistory as ItemHistoryType } from '../../types';
import { Spinner } from '../common/Spinner';
import { Empty, EmptyIcon } from '../common/Empty';

interface ItemHistoryProps {
  history: ItemHistoryType[];
  isLoading?: boolean;
}

export const ItemHistory = ({ history, isLoading }: ItemHistoryProps) => {
  if (isLoading) {
    return (
      <div className="py-8">
        <Spinner size="md" text="Loading history..." />
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <Empty
        icon={<EmptyIcon />}
        title="No History"
        description="No changes have been recorded for this item yet."
      />
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'created':
        return (
          <div className="bg-green-100 text-green-600 p-2 rounded-full">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        );
      case 'updated':
        return (
          <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
        );
      case 'deleted':
        return (
          <div className="bg-red-100 text-red-600 p-2 rounded-full">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
        );
      case 'photo_added':
        return (
          <div className="bg-purple-100 text-purple-600 p-2 rounded-full">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 text-gray-600 p-2 rounded-full">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const getActionText = (historyItem: ItemHistoryType) => {
    if (historyItem.fieldChanged) {
      return (
        <div>
          <span className="font-medium">{historyItem.action}</span>
          <div className="text-sm text-gray-600 mt-1">
            Changed <span className="font-medium">{historyItem.fieldChanged}</span>
            {historyItem.oldValue && (
              <>
                {' '}from <span className="line-through">{historyItem.oldValue}</span>
              </>
            )}
            {historyItem.newValue && (
              <>
                {' '}to <span className="font-medium">{historyItem.newValue}</span>
              </>
            )}
          </div>
        </div>
      );
    }
    return <span className="font-medium">{historyItem.action}</span>;
  };

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {history.map((item, index) => (
          <li key={item.id}>
            <div className="relative pb-8">
              {index !== history.length - 1 && (
                <span
                  className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              )}
              <div className="relative flex items-start space-x-3">
                <div className="relative">{getActionIcon(item.action)}</div>
                <div className="flex-1 min-w-0">
                  <div>
                    <div className="text-sm">{getActionText(item)}</div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      {item.user && (
                        <>
                          <span className="font-medium">{item.user.fullName}</span>
                          <span>•</span>
                        </>
                      )}
                      <time dateTime={item.timestamp}>
                        {formatDate(item.timestamp)}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
