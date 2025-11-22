import React from 'react';

export const ScrollIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {/* Classic parchment scroll with curled edges */}
    <path d="M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8" />
    <path d="M6 2h2v20H6a4 4 0 0 1 0-8h0a4 4 0 0 1 0-8z" />
    {/* Writing lines */}
    <line x1="11" y1="7" x2="15" y2="7" strokeWidth="1.5" />
    <line x1="11" y1="11" x2="17" y2="11" strokeWidth="1.5" />
    <line x1="11" y1="15" x2="15" y2="15" strokeWidth="1.5" />
  </svg>
);
