import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-default flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-32 h-32 mx-auto mb-6">
          <img 
            src="/sancho-logo.png" 
            alt="Sancho Logo" 
            className="w-full h-full object-contain opacity-50" 
          />
        </div>
        <h1 className="text-6xl font-bold text-default mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-default mb-4">Page Not Found</h2>
        <p className="text-muted mb-8">
          Even Sancho couldn't find this page on his journey through the poetic lands.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-accent hover:bg-accent-hover text-accent-text font-semibold rounded-lg transition-colors"
          >
            Return Home
          </Link>
          <Link
            to="/about"
            className="px-6 py-3 bg-bg-alt hover:bg-default border border-default text-default font-semibold rounded-lg transition-colors"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};
