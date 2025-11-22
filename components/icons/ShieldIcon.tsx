import React from 'react';

export const ShieldIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {/* Heraldic shield with center emblem */}
    <path d="M12 2l8 3v6c0 5.5-3.5 9.5-8 11-4.5-1.5-8-5.5-8-11V5z" strokeWidth="1.5" />
    {/* Center checkmark emblem */}
    <polyline points="9 12 11 14 15 9" strokeWidth="1.5" />
  </svg>
);
