import React from 'react';

export const LiteraryDevicesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {/* Ornate quill pen with ink pot */}
    <path d="M17 3l-3 3-3-3-1 8 4 4 4-4z" />
    <path d="M14 6l4 4" />
    <ellipse cx="7" cy="17" rx="4" ry="3" />
    <path d="M7 14v-2" />
    <line x1="11" y1="14" x2="14" y2="10" strokeWidth="1.5" />
  </svg>
);
