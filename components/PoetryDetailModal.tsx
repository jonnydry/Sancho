
import React, { useEffect } from 'react';
import { PoetryItem } from '../types';
import { ExampleFinder } from './ExampleFinder';
import { XIcon } from './icons/XIcon';

interface PoetryDetailModalProps {
  item: PoetryItem;
  onClose: () => void;
}

const Tag: React.FC<{ type: PoetryItem['type'] }> = ({ type }) => {
  let colorClass = '';
  switch (type) {
    case 'Form':
      colorClass = 'bg-tag-form/10 text-tag-form-text dark:bg-tag-form/20';
      break;
    case 'Meter':
      colorClass = 'bg-tag-meter/10 text-tag-meter-text dark:bg-tag-meter/20';
      break;
    case 'Device':
      colorClass = 'bg-tag-device/10 text-tag-device-text dark:bg-tag-device/20';
      break;
  }
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClass}`}>
      {type}
    </span>
  );
};

export const PoetryDetailModal: React.FC<PoetryDetailModalProps> = ({ item, onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in-fast"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="relative bg-default rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4 animate-modal-in border border-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 md:p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted/50 hover:text-muted transition-colors"
            aria-label="Close"
          >
            <XIcon className="w-6 h-6" />
          </button>

          <div className="flex justify-between items-start mb-4">
            <h2 id="modal-title" className="text-2xl font-bold text-default flex-1 pr-8">{item.name}</h2>
            <Tag type={item.type} />
          </div>
          <p className="text-default mb-6">{item.description}</p>

          {item.origin && (
            <div className="mb-6">
              <h4 className="font-semibold text-default">Origin:</h4>
              <p className="text-default mt-1">{item.origin}</p>
            </div>
          )}
          
          <div className="space-y-4 mb-6">
              <h4 className="font-semibold text-default">Conventions:</h4>
              <ul className="list-disc list-inside space-y-1 text-default">
                  {item.structure.map((rule, index) => <li key={index}>{rule}</li>)}
              </ul>
          </div>
          
          <div className="mb-6">
            <h4 className="font-semibold text-default">Classic Snippet:</h4>
            <p className="text-default italic mt-1">"{item.exampleSnippet}"</p>
          </div>
        </div>
        
        <ExampleFinder topic={item.name} />
      </div>
    </div>
  );
};
