import React from 'react';

export const KeyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {/* Ornate skeleton key */}
    <circle cx="7" cy="7" r="4" strokeWidth="1.5" />
    <circle cx="7" cy="7" r="2" fill="none" strokeWidth="1.5" />
    <path d="M10.5 9.5L21 20" strokeWidth="1.5" />
    <path d="M17 16v4" strokeWidth="1.5" />
    <path d="M20 19v2" strokeWidth="1.5" />
  </svg>
);
