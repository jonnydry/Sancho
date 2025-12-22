import React from 'react';
import { PoetryItem } from '../types';
import { XIcon } from './icons/XIcon';

interface TemplatePanelProps {
  isOpen: boolean;
  onClose: () => void;
  pinnedItems: PoetryItem[];
  selectedTemplate: string | undefined;
  onSelectTemplate: (name: string) => void;
}

export const TemplatePanel: React.FC<TemplatePanelProps> = ({
  isOpen,
  onClose,
  pinnedItems,
  selectedTemplate,
  onSelectTemplate,
}) => {
  if (!isOpen) return null;

  const activeItem = pinnedItems.find(item => item.name === selectedTemplate);

  return (
    <div className="w-full sm:w-64 border-l border-default bg-bg-alt/20 flex flex-col h-full animate-slide-in-right absolute sm:relative z-10 sm:z-0 right-0 top-0 bottom-0 shadow-xl sm:shadow-none">
      <div className="p-3 sm:p-4 border-b border-default flex items-center justify-between bg-bg">
        <h3 className="text-sm font-bold text-default">Reference</h3>
        <button 
          onClick={onClose} 
          className="text-muted hover:text-default transition-colors"
          aria-label="Close template reference"
        >
          <XIcon className="w-4 h-4" />
        </button>
      </div>
      
      <div className="p-3 sm:p-4 border-b border-default/30">
        <select 
          className="w-full bg-bg border border-default rounded-sm px-2 py-1.5 text-xs text-default focus:border-accent focus:outline-none transition-colors"
          value={selectedTemplate || ''}
          onChange={(e) => onSelectTemplate(e.target.value)}
          aria-label="Select poetry form or meter template"
        >
          <option value="">Select a template...</option>
          {pinnedItems.map(item => (
            <option key={item.name} value={item.name}>{item.name} ({item.type})</option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {activeItem ? (
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-sm mb-2 text-default">{activeItem.name}</h4>
              <p className="text-xs text-muted leading-relaxed">{activeItem.description}</p>
            </div>
            
            {activeItem.structure && (
              <div>
                <h5 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Structure</h5>
                <ul className="text-xs space-y-1.5 list-disc pl-4 text-default">
                  {activeItem.structure.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            )}

            {activeItem.exampleSnippet && (
              <div>
                <h5 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Example</h5>
                <div className="p-3 bg-bg rounded-sm border border-default/30 text-xs italic text-muted leading-relaxed">
                  "{activeItem.exampleSnippet}"
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-muted text-xs">
            <p>Select a pinned item to see its structure while you write.</p>
          </div>
        )}
      </div>
    </div>
  );
};

