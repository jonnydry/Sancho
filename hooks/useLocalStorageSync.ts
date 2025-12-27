import { useEffect, useRef } from 'react';

/**
 * Debounced localStorage sync hook
 * Saves value to localStorage after a delay to prevent excessive writes
 */
export function useLocalStorageSync<T>(
  key: string,
  value: T,
  delayMs: number = 500
): void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for debounced save
    timeoutRef.current = setTimeout(() => {
      try {
        const serialized = typeof value === 'string' ? value : JSON.stringify(value);
        localStorage.setItem(key, serialized);
      } catch (error) {
        console.error(`Failed to save to localStorage[${key}]:`, error);
      }
    }, delayMs);

    // Cleanup on unmount or value change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [key, value, delayMs]);
}
