import React from 'react';
import { JournalEntry } from '../services/journalStorage';

interface JournalEntryListProps {
  entries: JournalEntry[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
}

export const JournalEntryList: React.FC<JournalEntryListProps> = ({
  entries,
  selectedId,
  onSelect,
  onCreate,
  onDelete,
}) => {
  return (
    <div className="w-16 sm:w-48 border-r border-default flex flex-col h-full bg-bg-alt/30">
      <div className="p-2 sm:p-3 border-b border-default flex justify-center sm:justify-between items-center">
        <span className="hidden sm:block text-xs font-bold text-muted uppercase tracking-wider">Entries</span>
        <button 
          onClick={onCreate}
          className="p-1.5 rounded-full text-muted hover:bg-accent/10 hover:text-default transition-colors"
          title="New Entry"
          aria-label="Create new journal entry"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
      <div className="overflow-y-auto flex-1">
        {entries.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-xs text-muted">No entries</p>
          </div>
        ) : (
          entries.map(entry => (
            <div 
              key={entry.id}
              className={`group p-3 cursor-pointer border-l-2 transition-all duration-200 hover:bg-bg-alt/50 ${
                selectedId === entry.id ? 'border-accent bg-bg-alt' : 'border-transparent'
              }`}
            >
              <div 
                onClick={() => onSelect(entry.id)}
                className="flex-1"
              >
                <div className="font-medium text-sm text-default truncate">{entry.title || 'Untitled'}</div>
                <div className="text-xs text-muted mt-1 truncate">
                  {new Date(entry.updatedAt).toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('Delete this entry?')) {
                    onDelete(entry.id);
                  }
                }}
                className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity text-muted hover:text-red-500 text-xs"
                title="Delete entry"
                aria-label={`Delete entry: ${entry.title || 'Untitled'}`}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

