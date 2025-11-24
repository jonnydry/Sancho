import React from 'react';
import { PoetryItem } from '../types';

interface ItemTagProps {
  type: PoetryItem['type'];
  className?: string;
}

const typeClassMap: Record<PoetryItem['type'], string> = {
  Form: 'text-tag-form-text',
  Meter: 'text-tag-meter-text',
  Device: 'text-tag-device-text',
};

export const ItemTag: React.FC<ItemTagProps> = ({ type, className = '' }) => (
  <span className={`text-[10px] uppercase tracking-widest font-bold ${typeClassMap[type]} ${className}`.trim()}>
    {type}
  </span>
);
