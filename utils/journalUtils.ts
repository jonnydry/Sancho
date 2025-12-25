/**
 * Utility functions for journal functionality
 */

/**
 * Generates a unique UUID v4
 */
export const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Counts the number of words in a text string
 */
export const countWords = (text: string): number => {
  if (!text.trim()) return 0;
  return text.trim().split(/\s+/).length;
};

/**
 * Panel resize constraints
 */
export const RESIZE_CONSTRAINTS = {
  ENTRY_LIST: {
    MIN: 160,
    MAX: 400,
  },
  REFERENCE_PANE: {
    MIN: 240,
    MAX: 600,
  },
  SAVED_LIST: {
    MIN: 80,
    MAX: 300,
  },
} as const;

/**
 * Timing constants
 */
export const TIMING = {
  AUTOSAVE_DELAY: 500,
  SEARCH_DEBOUNCE: 150,
  SAVE_CONFIRM_DURATION: 2000,
  ERROR_DISPLAY_DURATION: 5000,
  DELETE_CONFIRM_TIMEOUT: 2000,
  INSERT_FEEDBACK_DURATION: 1000,
} as const;
