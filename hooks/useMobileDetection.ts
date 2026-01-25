import { useState, useEffect } from 'react';

// Breakpoints following Tailwind conventions
const MOBILE_BREAKPOINT = 768; // md breakpoint

export interface UseMobileDetectionReturn {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
}

export function useMobileDetection(): UseMobileDetectionReturn {
  const [screenWidth, setScreenWidth] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth;
    }
    return 1024; // Default to desktop on SSR
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Set initial value
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = screenWidth < MOBILE_BREAKPOINT;
  const isTablet = screenWidth >= MOBILE_BREAKPOINT && screenWidth < 1024;
  const isDesktop = screenWidth >= 1024;

  return {
    isMobile,
    isTablet,
    isDesktop,
    screenWidth,
  };
}

// For use in route detection
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;

  // Check screen width
  if (window.innerWidth < MOBILE_BREAKPOINT) return true;

  // Also check user agent for mobile devices (tablets in portrait, etc.)
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];

  return mobileKeywords.some(keyword => userAgent.includes(keyword));
}
