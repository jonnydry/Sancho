// Simple logging utility for Node.js
export const logger = {
  debug: (message, meta) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${message}`, meta || '');
    }
  },
  info: (message, meta) => {
    console.log(`[INFO] ${message}`, meta || '');
  },
  warn: (message, meta) => {
    console.warn(`[WARN] ${message}`, meta || '');
  },
  error: (message, meta) => {
    console.error(`[ERROR] ${message}`, meta || '');
  }
};
