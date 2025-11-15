import React from 'react';
import { PoetryItem } from '../types';
import { ArrowUpRightIcon } from './icons/ArrowUpRightIcon';

interface PoetryCardProps {
  item: PoetryItem;
  onSelect: (item: PoetryItem) => void;
  animationIndex: number;
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


export const PoetryCard: React.FC<PoetryCardProps> = ({ item, onSelect, animationIndex }) => {
  return (
    <button
      onClick={() => onSelect(item)}
      className="w-full text-left bg-bg-alt rounded-2xl shadow-md overflow-hidden transition-all duration-300 ease-in-out animate-fade-in hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-accent border border-default"
      style={{ animationDelay: `${animationIndex * 50}ms` }}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-default flex-1 pr-4 m-0">{item.name}</h3>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Tag type={item.type} />
            <ArrowUpRightIcon
              className="w-5 h-5 text-muted/50"
              aria-hidden="true"
            />
          </div>
        </div>
        <p className="text-muted mb-4">{item.description}</p>
        
        <div className="mb-4">
            <h4 className="font-semibold text-sm text-default mb-2">Conventions:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted">
                {item.structure.map((rule, index) => <li key={index}>{rule}</li>)}
            </ul>
        </div>
        
        <div>
          <h4 className="font-semibold text-sm text-default mb-2">Classic Snippet:</h4>
          <p className="text-sm text-muted italic">"{item.exampleSnippet}"</p>
        </div>
      </div>
    </button>
  );
};