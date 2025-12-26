import React from 'react';

export interface SlashCommand {
  id: string;
  label: string;
  icon: React.ReactNode;
  prefix: string;
}

interface SlashMenuProps {
  position: { top: number; left: number };
  commands: SlashCommand[];
  selectedIndex: number;
  onSelect: (command: SlashCommand) => void;
  onMouseEnter: (index: number) => void;
}

// Icons as simple SVG components
const Heading1Icon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 12h8" />
    <path d="M4 18V6" />
    <path d="M12 18V6" />
    <path d="m17 12 3-2v8" />
  </svg>
);

const Heading2Icon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 12h8" />
    <path d="M4 18V6" />
    <path d="M12 18V6" />
    <path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1" />
  </svg>
);

const Heading3Icon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 12h8" />
    <path d="M4 18V6" />
    <path d="M12 18V6" />
    <path d="M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2" />
    <path d="M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2" />
  </svg>
);

const ListIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const ListOrderedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="10" y1="6" x2="21" y2="6" />
    <line x1="10" y1="12" x2="21" y2="12" />
    <line x1="10" y1="18" x2="21" y2="18" />
    <path d="M4 6h1v4" />
    <path d="M4 10h2" />
    <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
  </svg>
);

const CheckSquareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 11 12 14 22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

const QuoteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z" />
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z" />
  </svg>
);

const CodeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

export const SLASH_COMMANDS: SlashCommand[] = [
  { id: 'h1', label: 'Heading 1', icon: <Heading1Icon />, prefix: '# ' },
  { id: 'h2', label: 'Heading 2', icon: <Heading2Icon />, prefix: '## ' },
  { id: 'h3', label: 'Heading 3', icon: <Heading3Icon />, prefix: '### ' },
  { id: 'ul', label: 'Bullet List', icon: <ListIcon />, prefix: '- ' },
  { id: 'ol', label: 'Numbered List', icon: <ListOrderedIcon />, prefix: '1. ' },
  { id: 'check', label: 'Checkbox', icon: <CheckSquareIcon />, prefix: '- [ ] ' },
  { id: 'quote', label: 'Blockquote', icon: <QuoteIcon />, prefix: '> ' },
  { id: 'code', label: 'Code Block', icon: <CodeIcon />, prefix: '```\n' },
];

export const SlashMenu: React.FC<SlashMenuProps> = ({
  position,
  commands,
  selectedIndex,
  onSelect,
  onMouseEnter,
}) => {
  return (
    <div
      className="absolute z-50 bg-bg/95 backdrop-blur-md border border-default rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
      style={{
        top: position.top,
        left: position.left,
        minWidth: '220px',
        maxHeight: '300px',
        overflowY: 'auto',
      }}
    >
      <div className="px-2 py-1.5 text-[10px] font-semibold text-muted uppercase tracking-wider border-b border-default/50">
        Basic Blocks
      </div>
      <div className="py-1">
        {commands.map((cmd, index) => (
          <div
            key={cmd.id}
            className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors ${
              index === selectedIndex
                ? 'bg-accent/15 text-default'
                : 'text-muted hover:bg-bg-alt hover:text-default'
            }`}
            onClick={() => onSelect(cmd)}
            onMouseEnter={() => onMouseEnter(index)}
          >
            <div
              className={`flex items-center justify-center w-6 h-6 rounded border ${
                index === selectedIndex
                  ? 'border-accent/30 bg-accent/10 text-accent'
                  : 'border-default/30 bg-bg-alt/50 text-muted'
              }`}
            >
              {cmd.icon}
            </div>
            <span className="text-sm font-medium">{cmd.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
