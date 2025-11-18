import React, { useState } from 'react';
import { PoetryItem } from '../types';
import { usePinnedItems } from '../contexts/PinnedItemsContext';
import { useNotification } from '../contexts/NotificationContext';
import { useAuth } from '../hooks/useAuth.js';
import { BookPenIcon } from './icons/BookPenIcon';
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
        console.log('Unpinning item:', item.name);
        await unpinItem(item.name);
        showNotification('Removed from Notebook', 'success');
      } else {
        console.log('Pinning item:', item.name);
        await pinItem(item);
        showNotification('Added to Notebook', 'success');
      }
    } catch (error: any) {
      console.error('Error toggling pin:', error);
      let errorMessage = 'Failed to update notebook';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Check if this is an authentication error that requires re-login
        if (error.hasOwnProperty('requiresLogin') && (error as any).requiresLogin) {
          console.log('Authentication required - redirecting to login');
          showNotification(errorMessage, 'error');
          
          // Redirect to login after a short delay to show the notification
          setTimeout(() => {
            window.location.href = '/api/login';
          }, 2000);
          return;
        }
        
        // Log additional details for debugging
        console.error('Error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack,
        });
      } else {
        console.error('Non-Error exception:', error);
        errorMessage = `Failed to update notebook: ${String(error)}`;
      }
      
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
        <BookPenIcon className={sizeClasses[size]} />
      )}
    </button>
  );
};

