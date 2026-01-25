import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { SearchSparkleIcon } from '../icons/SearchSparkleIcon';
import { XIcon } from '../icons/XIcon';

interface ReferenceItem {
  name: string;
  type?: string;
  category?: string;
  description?: string;
  exampleSnippet?: string;
  structure?: string[];
  tags?: string[];
}

interface MobileReferenceSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (text: string) => void;
  onSelectTemplate: (name: string) => void;
  selectedTemplate?: string;
}

export const MobileReferenceSheet: React.FC<MobileReferenceSheetProps> = ({
  isOpen,
  onClose,
  onInsert,
  onSelectTemplate,
  selectedTemplate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [referenceData, setReferenceData] = useState<ReferenceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dragOffset, setDragOffset] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number | null>(null);

  // Lazy load reference data
  useEffect(() => {
    if (isOpen && referenceData.length === 0) {
      setIsLoading(true);
      Promise.all([
        import('../../data/poetryData').then(m => m.poetryData),
        import('../../data/poeticDevicesData').then(m => m.poeticDevicesData)
      ]).then(([poetry, devices]) => {
        setReferenceData([...poetry, ...devices]);
        setIsLoading(false);
      }).catch(err => {
        console.error('Failed to load reference data:', err);
        setIsLoading(false);
      });
    }
  }, [isOpen, referenceData.length]);

  // Filter items by search
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return referenceData;
    const query = searchQuery.toLowerCase();
    return referenceData.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.type?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [referenceData, searchQuery]);

  // Get selected item details
  const selectedItem = useMemo(() => {
    if (!selectedTemplate) return null;
    return referenceData.find((item) => item.name === selectedTemplate);
  }, [referenceData, selectedTemplate]);

  // Drag handlers for bottom sheet
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    // Only allow drag from handle area
    if (target.closest('.sheet-handle')) {
      dragStartY.current = e.touches[0].clientY;
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (dragStartY.current === null) return;

    const deltaY = e.touches[0].clientY - dragStartY.current;
    if (deltaY > 0) {
      e.preventDefault();
      setDragOffset(deltaY);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (dragOffset > 100) {
      onClose();
    }
    setDragOffset(0);
    dragStartY.current = null;
  }, [dragOffset, onClose]);

  // Handle insert
  const handleInsert = (text: string) => {
    onInsert(text);
    onClose();
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(5);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        style={{ opacity: 1 - dragOffset / 400 }}
        onClick={onClose}
      />

      {/* Bottom sheet */}
      <div
        ref={sheetRef}
        className="fixed inset-x-0 bottom-0 z-50 bg-bg rounded-t-2xl shadow-xl max-h-[85vh] flex flex-col mobile-bottom-sheet"
        style={{
          transform: `translateY(${dragOffset}px)`,
          transition: dragOffset === 0 ? 'transform 0.3s ease-out' : 'none',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handle */}
        <div className="sheet-handle flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
          <div className="w-10 h-1 bg-muted/30 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-2">
          <h2 className="text-lg font-bold text-default">Reference</h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-lg text-muted interactive-muted hover:bg-bg-alt transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search forms & devices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bg-alt border border-default rounded-xl py-2.5 pl-10 pr-4 text-sm text-default focus:border-accent focus:outline-none transition-colors placeholder:text-muted/50"
            />
            <SearchSparkleIcon className="w-4 h-4 text-muted absolute left-3 top-3" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 safe-area-bottom">
          {isLoading ? (
            <div className="py-8 text-center">
              <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto"></div>
              <p className="text-sm text-muted mt-2">Loading reference...</p>
            </div>
          ) : selectedItem ? (
            /* Selected item detail view */
            <div className="space-y-4">
              <button
                onClick={() => onSelectTemplate('')}
                className="flex items-center gap-1 text-sm text-accent"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Back to list
              </button>

              <div>
                <h3 className="text-xl font-bold text-default">{selectedItem.name}</h3>
                {selectedItem.type && (
                  <span className="text-sm text-accent">{selectedItem.type}</span>
                )}
              </div>

              {selectedItem.description && (
                <div>
                  <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-1">Description</h4>
                  <p className="text-sm text-default leading-relaxed">{selectedItem.description}</p>
                </div>
              )}

              {selectedItem.structure && selectedItem.structure.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-1">Structure</h4>
                  <ul className="text-sm text-default bg-bg-alt p-3 rounded-lg space-y-1">
                    {selectedItem.structure.map((line, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-accent">•</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedItem.exampleSnippet && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-bold text-muted uppercase tracking-wider">Example</h4>
                    <button
                      onClick={() => handleInsert(selectedItem.exampleSnippet!)}
                      className="text-xs text-accent font-medium flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                      Insert
                    </button>
                  </div>
                  <div className="text-sm text-default bg-bg-alt p-3 rounded-lg italic whitespace-pre-wrap">
                    {selectedItem.exampleSnippet}
                  </div>
                </div>
              )}

              {selectedItem.tags && selectedItem.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedItem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Item list */
            <div className="space-y-1">
              {filteredItems.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-muted">No results found</p>
                  <p className="text-sm text-muted/70 mt-1">Try a different search term</p>
                </div>
              ) : (
                filteredItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => onSelectTemplate(item.name)}
                    className="w-full text-left px-3 py-3 rounded-lg hover:bg-bg-alt active:bg-bg-alt/80 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-default">{item.name}</span>
                      {item.type && (
                        <span className="text-xs text-accent bg-accent/10 px-1.5 py-0.5 rounded">
                          {item.type}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-sm text-muted mt-0.5 line-clamp-1">
                        {item.description}
                      </p>
                    )}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
