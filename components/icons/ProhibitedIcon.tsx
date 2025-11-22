import React from 'react';

export const ProhibitedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {/* Octagonal prohibition sign with decorative elements */}
    <path d="M7.86 2h8.28L22 7.86v8.28L16.14 22H7.86L2 16.14V7.86L7.86 2z" />
    <line x1="15" y1="9" x2="9" y2="15" strokeWidth="2.5" />
    <line x1="9" y1="9" x2="15" y2="15" strokeWidth="2.5" />
  </svg>
);
