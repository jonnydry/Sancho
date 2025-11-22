import React from 'react';

export const PoeticFormsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {/* Scroll/parchment with writing lines */}
    <path d="M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
    <path d="M4 7h16" strokeWidth="1.5" />
    <path d="M4 11h16" strokeWidth="1.5" />
    <path d="M4 15h16" strokeWidth="1.5" />
    <circle cx="7" cy="7" r="0.5" fill="currentColor" />
    <circle cx="7" cy="11" r="0.5" fill="currentColor" />
    <circle cx="7" cy="15" r="0.5" fill="currentColor" />
  </svg>
);
