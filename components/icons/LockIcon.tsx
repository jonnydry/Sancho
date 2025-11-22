import React from 'react';

export const LockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {/* Vintage ornate padlock */}
    <rect x="4" y="11" width="16" height="11" rx="2" ry="2" strokeWidth="1.5" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="1.5" />
    {/* Keyhole */}
    <circle cx="12" cy="16" r="1.5" fill="currentColor" />
    <line x1="12" y1="17.5" x2="12" y2="19.5" strokeWidth="1.5" />
  </svg>
);
