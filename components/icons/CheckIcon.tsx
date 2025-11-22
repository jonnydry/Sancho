import React from 'react';

export const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {/* Ornate checkmark with decorative circle */}
    <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
    <polyline points="8 12 11 15 16 9" strokeWidth="2.5" />
  </svg>
);
