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
        // Use theme accent color for success - matches the app's color scheme
        return 'bg-accent/90 text-accent-text border-accent';
      case 'error':
        // Error uses a muted red that works across themes
        return 'bg-bg-alt text-default border-default ring-2 ring-red-500/50';
      case 'info':
        // Info uses the theme's muted text styling
        return 'bg-bg-alt text-default border-default';
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
        className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Dismiss notification"
      >
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

