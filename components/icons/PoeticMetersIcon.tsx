import React from 'react';

export const PoeticMetersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {/* Musical staff representing poetic rhythm */}
    <line x1="3" y1="8" x2="21" y2="8" strokeWidth="1.5" />
    <line x1="3" y1="12" x2="21" y2="12" strokeWidth="1.5" />
    <line x1="3" y1="16" x2="21" y2="16" strokeWidth="1.5" />
    {/* Note symbols for meter beats */}
    <circle cx="7" cy="12" r="1.5" fill="currentColor" />
    <line x1="7" y1="10.5" x2="7" y2="6" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    <line x1="12" y1="10.5" x2="12" y2="6" strokeWidth="1.5" />
    <circle cx="17" cy="12" r="1.5" fill="currentColor" />
    <line x1="17" y1="10.5" x2="17" y2="6" strokeWidth="1.5" />
  </svg>
);
