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
  const [isPressed, setIsPressed] = useState(false);
  const pinned = isPinned(item.name);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading || isAuthLoading) return;

    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 200);

    setIsLoading(true);
    try {
      if (pinned) {
        await unpinItem(item.name);
        showNotification('Removed from Notebook', 'success');
      } else {
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
      className={`flex items-center justify-center transition-all duration-200 rounded-full hover:bg-accent/10 hover:shadow-sm interactive-base interactive-scale ${
        isPressed ? 'scale-90' : 'scale-100'
      } text-default hover:text-accent disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      aria-label={pinned ? `Unpin ${item.name}` : `Pin ${item.name}`}
      title={pinned ? `Unpin ${item.name}` : `Pin ${item.name}`}
    >
      {isLoading ? (
        <SpinnerIcon className={`${sizeClasses[size]} animate-spin`} />
      ) : (
        <BookPenIcon className={sizeClasses[size]} heartFilled={pinned} />
      )}
    </button>
  );
};

