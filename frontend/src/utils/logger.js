/**
 * Frontend logging utility
 * Provides consistent logging across the frontend application
 */

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

class Logger {
  constructor() {
    this.isDevelopment = import.meta.env.DEV;
    this.enableDebug = import.meta.env.VITE_ENABLE_DEBUG === 'true';
  }

  shouldLog(level) {
    if (!this.isDevelopment && level === LOG_LEVELS.DEBUG) {
      return false;
    }
    return this.isDevelopment || this.enableDebug || level <= LOG_LEVELS.WARN;
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const levelNames = ['ERROR', 'WARN', 'INFO', 'DEBUG'];
    const levelName = levelNames[level];
    
    return {
      timestamp,
      level: levelName,
      message,
      ...meta
    };
  }

  log(level, message, meta = {}) {
    if (!this.shouldLog(level)) return;

    const logData = this.formatMessage(level, message, meta);
    
    if (level === LOG_LEVELS.ERROR) {
      console.error(`[${logData.level}] ${logData.message}`, logData);
    } else if (level === LOG_LEVELS.WARN) {
      console.warn(`[${logData.level}] ${logData.message}`, logData);
    } else {
      console.log(`[${logData.level}] ${logData.message}`, logData);
    }
  }

  error(message, meta = {}) {
    this.log(LOG_LEVELS.ERROR, message, meta);
  }

  warn(message, meta = {}) {
    this.log(LOG_LEVELS.WARN, message, meta);
  }

  info(message, meta = {}) {
    this.log(LOG_LEVELS.INFO, message, meta);
  }

  debug(message, meta = {}) {
    this.log(LOG_LEVELS.DEBUG, message, meta);
  }
}

export const logger = new Logger();
export default logger;