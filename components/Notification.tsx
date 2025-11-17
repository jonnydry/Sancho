import React, { useEffect } from 'react';
import { XIcon } from './icons/XIcon';

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

interface NotificationProps {
  notification: Notification;
  onDismiss: (id: string) => void;
  duration?: number;
}

export const NotificationToast: React.FC<NotificationProps> = ({
  notification,
  onDismiss,
  duration = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(notification.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [notification.id, duration, onDismiss]);

  const getTypeStyles = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-500/90 dark:bg-green-600/90 text-white border-green-600 dark:border-green-700';
      case 'error':
        return 'bg-red-500/90 dark:bg-red-600/90 text-white border-red-600 dark:border-red-700';
      case 'info':
        return 'bg-blue-500/90 dark:bg-blue-600/90 text-white border-blue-600 dark:border-blue-700';
      default:
        return 'bg-bg-alt text-default border-default';
    }
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border backdrop-blur-sm animate-fade-in min-w-[280px] max-w-[400px] ${getTypeStyles()}`}
      role="alert"
      aria-live="polite"
    >
      <p className="flex-1 text-sm font-medium">{notification.message}</p>
      <button
        onClick={() => onDismiss(notification.id)}
        className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
        aria-label="Dismiss notification"
      >
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

