
export interface PoetryItem {
  name: string;
  type: 'Form' | 'Meter' | 'Device';
  description: string;
  structure: string[];
  exampleSnippet: string;
  origin?: string;
}

export type ThemeMode = 'light' | 'dark';
export type ThemeColor = 'dark' | 'paper' | 'slate';

export interface Theme {
  mode: ThemeMode;
  color: ThemeColor;
}

export interface ThemeContextType extends Theme {
  setMode: (mode: ThemeMode) => void;
  setColor: (color: ThemeColor) => void;
  toggleMode: () => void;
}

export interface GeminiExampleResponse {
  example: string;
  author: string;
  title: string;
  explanation: string;
}

export interface SanchoQuoteResponse {
  quote: string;
  context: string;
}
