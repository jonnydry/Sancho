import { useContext } from 'react';
import { FontContext, FontContextType } from '../contexts/FontContext';

export const useFont = (): FontContextType => {
  const context = useContext(FontContext);
  if (!context) {
    throw new Error('useFont must be used within a FontProvider');
  }
  return context;
};
