import React from 'react';

export const AiExamplesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {/* Magical quill with sparkles */}
    <path d="M20 4l-2 14.5L12 16l-6 2.5L8 4z" />
    <path d="M12 16v-4" />
    <path d="M8 12l4-8 4 8" />
    {/* Sparkle elements */}
    <path d="M3 8h2M3 8v2" strokeWidth="1.5" />
    <path d="M20 16h2M20 16v2" strokeWidth="1.5" />
  </svg>
);
