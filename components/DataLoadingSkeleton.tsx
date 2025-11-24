import React from 'react';

export const DataLoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 mt-8">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-bg/30 border border-default rounded-sm p-5 animate-pulse"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-6 bg-default/20 rounded w-3/4"></div>
              <div className="h-3 bg-default/10 rounded w-1/4"></div>
            </div>
            <div className="h-4 w-4 bg-default/10 rounded"></div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-default/10 rounded w-full"></div>
            <div className="h-4 bg-default/10 rounded w-5/6"></div>
            <div className="h-4 bg-default/10 rounded w-4/6"></div>
          </div>
          <div className="flex gap-1.5 mb-4">
            <div className="h-5 bg-default/10 rounded w-16"></div>
            <div className="h-5 bg-default/10 rounded w-20"></div>
            <div className="h-5 bg-default/10 rounded w-14"></div>
          </div>
          <div className="pt-4 border-t border-default/20">
            <div className="h-3 bg-default/10 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  );
};


