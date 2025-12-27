import React, { useEffect, useRef } from 'react';

export interface SlashCommand {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: string; // The markdown prefix to insert
}

interface SlashMenuProps {
  position: { top: number; left: number };
  query: string;
  selectedIndex: number;
  onSelect: (command: SlashCommand) => void;
  onClose: () => void;
  onNavigate: (direction: 'up' | 'down') => void;
}

// Icons for slash commands
const Heading1Icon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12h8"/>
    <path d="M4 18V6"/>
    <path d="M12 18V6"/>
    <path d="m17 12 3-2v8"/>
  </svg>
);

const Heading2Icon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12h8"/>
    <path d="M4 18V6"/>
    <path d="M12 18V6"/>
    <path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1"/>
  </svg>
);

const Heading3Icon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12h8"/>
    <path d="M4 18V6"/>
    <path d="M12 18V6"/>
    <path d="M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2"/>
    <path d="M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2"/>
  </svg>
);

const ListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" x2="21" y1="6" y2="6"/>
    <line x1="8" x2="21" y1="12" y2="12"/>
    <line x1="8" x2="21" y1="18" y2="18"/>
    <line x1="3" x2="3.01" y1="6" y2="6"/>
    <line x1="3" x2="3.01" y1="12" y2="12"/>
    <line x1="3" x2="3.01" y1="18" y2="18"/>
  </svg>
);

const ListOrderedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="10" x2="21" y1="6" y2="6"/>
    <line x1="10" x2="21" y1="12" y2="12"/>
    <line x1="10" x2="21" y1="18" y2="18"/>
    <path d="M4 6h1v4"/>
    <path d="M4 10h2"/>
    <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>
  </svg>
);

const CheckSquareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 11 12 14 22 4"/>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
  </svg>
);

const QuoteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"/>
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z"/>
  </svg>
);

const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"/>
    <polyline points="8 6 2 12 8 18"/>
  </svg>
);

const DividerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" x2="21" y1="12" y2="12"/>
  </svg>
);

export const SLASH_COMMANDS: SlashCommand[] = [
  { id: 'h1', label: 'Heading 1', description: 'Large heading', icon: <Heading1Icon />, action: '# ' },
  { id: 'h2', label: 'Heading 2', description: 'Medium heading', icon: <Heading2Icon />, action: '## ' },
  { id: 'h3', label: 'Heading 3', description: 'Small heading', icon: <Heading3Icon />, action: '### ' },
  { id: 'ul', label: 'Bullet List', description: 'Unordered list', icon: <ListIcon />, action: '- ' },
  { id: 'ol', label: 'Numbered List', description: 'Ordered list', icon: <ListOrderedIcon />, action: '1. ' },
  { id: 'check', label: 'Checklist', description: 'To-do item', icon: <CheckSquareIcon />, action: '- [ ] ' },
  { id: 'quote', label: 'Blockquote', description: 'Quote text', icon: <QuoteIcon />, action: '> ' },
  { id: 'code', label: 'Code Block', description: 'Code snippet', icon: <CodeIcon />, action: '```\n' },
  { id: 'hr', label: 'Divider', description: 'Horizontal rule', icon: <DividerIcon />, action: '---\n' },
];

export const SlashMenu: React.FC<SlashMenuProps> = ({
  position,
  query,
  selectedIndex,
  onSelect,
  onClose,
  onNavigate,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Filter commands based on query
  const filteredCommands = SLASH_COMMANDS.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.id.includes(query.toLowerCase())
  );

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Scroll selected item into view
  useEffect(() => {
    const selected = menuRef.current?.querySelector('.slash-menu-item.active');
    selected?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  if (filteredCommands.length === 0) {
    return null;
  }

  return (
    <div
      ref={menuRef}
      className="slash-menu absolute z-50 bg-bg border border-default rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
      style={{
        top: position.top,
        left: position.left,
        minWidth: '220px',
        maxHeight: '280px',
      }}
    >
      <div className="px-2 py-1.5 text-[10px] font-semibold text-muted uppercase tracking-wider border-b border-default bg-bg-alt/50">
        Blocks
      </div>
      <div className="overflow-y-auto max-h-[240px]">
        {filteredCommands.map((cmd, index) => (
          <div
            key={cmd.id}
            className={`slash-menu-item flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors ${
              index === selectedIndex
                ? 'active bg-accent/10 text-accent'
                : 'hover:bg-bg-alt text-default'
            }`}
            onClick={() => onSelect(cmd)}
            onMouseEnter={() => onNavigate(index as any)} // Slight hack to set index directly
          >
            <div className={`flex items-center justify-center w-7 h-7 rounded border ${
              index === selectedIndex
                ? 'border-accent/30 bg-accent/5 text-accent'
                : 'border-default/50 bg-bg-alt/50 text-muted'
            }`}>
              {cmd.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{cmd.label}</div>
              {cmd.description && (
                <div className="text-xs text-muted truncate">{cmd.description}</div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="px-2 py-1.5 text-[10px] text-muted border-t border-default bg-bg-alt/30">
        <span className="opacity-70">↑↓</span> navigate · <span className="opacity-70">↵</span> select · <span className="opacity-70">esc</span> close
      </div>
    </div>
  );
};

// Helper to replace the slash command with the markdown syntax
export function replaceSlashCommand(
  text: string,
  cursorPos: number,
  prefix: string
): { text: string; newCursor: number } {
  const textBeforeCursor = text.substring(0, cursorPos);
  const slashIndex = textBeforeCursor.lastIndexOf('/');
  
  if (slashIndex === -1) {
    return { text, newCursor: cursorPos };
  }

  const beforeSlash = text.substring(0, slashIndex);
  const afterCursor = text.substring(cursorPos);
  
  const newText = beforeSlash + prefix + afterCursor;
  const newCursor = beforeSlash.length + prefix.length;
  
  return { text: newText, newCursor };
}
