// Simple logging utility for Node.js
interface LoggerMeta {
  [key: string]: any;
}

interface Logger {
  debug: (message: string, meta?: LoggerMeta) => void;
  info: (message: string, meta?: LoggerMeta) => void;
  warn: (message: string, meta?: LoggerMeta) => void;
  error: (message: string, meta?: LoggerMeta) => void;
}

export const logger: Logger = {
  debug: (message: string, meta?: LoggerMeta): void => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${message}`, meta || '');
    }
  },
  info: (message: string, meta?: LoggerMeta): void => {
    console.log(`[INFO] ${message}`, meta || '');
  },
  warn: (message: string, meta?: LoggerMeta): void => {
    console.warn(`[WARN] ${message}`, meta || '');
  },
  error: (message: string, meta?: LoggerMeta): void => {
    console.error(`[ERROR] ${message}`, meta || '');
  }
};
