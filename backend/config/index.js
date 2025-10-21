/**
 * Centralized configuration management
 * All environment variables and configuration in one place
 */

import { config } from 'dotenv';

// Load environment variables
config();

export const CONFIG = {
  // Server Configuration
  PORT: parseInt(process.env.PORT) || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // File Upload Configuration
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
  
  // PDF Processing Configuration
  PDF_PROCESSING_TIMEOUT: parseInt(process.env.PDF_PROCESSING_TIMEOUT) || 30000, // 30 seconds
  PYTHON_CMD: process.env.PYTHON_CMD || 'python3',
  
  // Security Configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  SESSION_SECRET: process.env.SESSION_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
  
  // Logging Configuration
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  ENABLE_REQUEST_LOGGING: process.env.ENABLE_REQUEST_LOGGING === 'true',
  
  // Database Configuration (for future use)
  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_URL: process.env.REDIS_URL,
  
  // Feature Flags
  ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS === 'true',
  ENABLE_RATE_LIMITING: process.env.ENABLE_RATE_LIMITING === 'true',
  ENABLE_AUTHENTICATION: process.env.ENABLE_AUTHENTICATION === 'true',
};

// Validation
export const validateConfig = () => {
  const errors = [];
  
  // Only validate secrets if authentication features are enabled
  if (CONFIG.NODE_ENV === 'production' && CONFIG.ENABLE_AUTHENTICATION) {
    if (!CONFIG.SESSION_SECRET) {
      errors.push('SESSION_SECRET is required when authentication is enabled');
    }
    if (!CONFIG.JWT_SECRET) {
      errors.push('JWT_SECRET is required when authentication is enabled');
    }
  }
  
  if (CONFIG.MAX_FILE_SIZE < 1024 * 1024) {
    errors.push('MAX_FILE_SIZE should be at least 1MB');
  }
  
  if (CONFIG.PDF_PROCESSING_TIMEOUT < 5000) {
    errors.push('PDF_PROCESSING_TIMEOUT should be at least 5 seconds');
  }
  
  return errors;
};

export default CONFIG;