// Simple logging utility for the Sancho application
// In production, this could be replaced with a more sophisticated logging solution

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

const getRuntimeMode = (): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.MODE) {
    return import.meta.env.MODE;
  }
  if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV) {
    return process.env.NODE_ENV;
  }
  return 'development';
};

class Logger {
  private level: LogLevel = LogLevel.INFO;

  constructor() {
    // Set log level based on environment
    const mode = getRuntimeMode();
    const isClient = typeof window !== 'undefined';
    const isDev = mode === 'development';

    if (isClient) {
      // Client-side
      this.level = isDev ? LogLevel.DEBUG : LogLevel.WARN;
      return;
    }

    // Server-side
    this.level = isDev ? LogLevel.DEBUG : LogLevel.INFO;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.level;
  }

  private formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] ${level}:`;
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    return `${prefix} ${message}${metaStr}`;
  }

  debug(message: string, meta?: any): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.formatMessage('DEBUG', message, meta));
    }
  }

  info(message: string, meta?: any): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage('INFO', message, meta));
    }
  }

  warn(message: string, meta?: any): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage('WARN', message, meta));
    }
  }

  error(message: string, error?: Error | any, meta?: any): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const errorInfo = error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        ...meta
      } : { error, ...meta };
      console.error(this.formatMessage('ERROR', message, errorInfo));
    }
  }

  // Specialized logging methods
  apiRequest(method: string, url: string, statusCode?: number, duration?: number): void {
    this.info(`API ${method} ${url}`, { statusCode, duration });
  }

  apiError(method: string, url: string, error: any, statusCode?: number): void {
    this.error(`API ${method} ${url} failed`, error, { statusCode });
  }

  userAction(action: string, details?: any): void {
    this.info(`User action: ${action}`, details);
  }

  authEvent(event: string, userId?: string, details?: any): void {
    this.info(`Auth event: ${event}`, { userId, ...details });
  }
}

export const logger = new Logger();
