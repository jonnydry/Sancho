import React, { useState } from 'react';
import { PoetryItem } from '../types';
import { usePinnedItems } from '../contexts/PinnedItemsContext';
import { useNotification } from '../contexts/NotificationContext';
import { useAuth } from '../hooks/useAuth.js';
import { PenIcon } from './icons/PenIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface PinButtonProps {
  item: PoetryItem;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PinButton: React.FC<PinButtonProps> = ({ item, className = '', size = 'md' }) => {
  const { isPinned, pinItem, unpinItem } = usePinnedItems();
  const { showNotification } = useNotification();
  const { isLoading: isAuthLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const pinned = isPinned(item.name);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading || isAuthLoading) return;

    setIsLoading(true);
    try {
      if (pinned) {
        await unpinItem(item.name);
        showNotification('Removed from Notebook', 'success');
      } else {
        await pinItem(item);
        showNotification('Added to Notebook', 'success');
      }
    } catch (error) {
      console.error('Error toggling pin:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update notebook';
      showNotification(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading || isAuthLoading}
      className={`flex items-center justify-center transition-colors ${
        pinned
          ? 'text-accent hover:text-accent-hover'
          : 'text-muted hover:text-default'
      } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      aria-label={pinned ? `Unpin ${item.name}` : `Pin ${item.name}`}
      title={pinned ? `Unpin ${item.name}` : `Pin ${item.name}`}
    >
      {isLoading ? (
        <SpinnerIcon className={`${sizeClasses[size]} animate-spin`} />
      ) : (
        <PenIcon className={sizeClasses[size]} />
      )}
    </button>
  );
};

