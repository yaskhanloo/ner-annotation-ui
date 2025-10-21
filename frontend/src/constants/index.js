/**
 * Application constants
 * Centralized constants for the frontend application
 */

// File upload constants
export const FILE_UPLOAD = {
  MAX_SIZE: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
  ACCEPTED_TYPES: ['application/pdf'],
  ACCEPTED_EXTENSIONS: ['.pdf']
};

// API endpoints
export const API_ENDPOINTS = {
  HEALTH: '/health',
  UPLOAD_PDF: '/upload-pdf',
  ANNOTATIONS: '/annotations',
  ENTITIES: '/entities',
  EXPORT: '/export'
};

// Application states
export const CONNECTION_STATUS = {
  CHECKING: 'checking',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected'
};

// Alert types
export const ALERT_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Entity colors (fallback colors for entities)
export const ENTITY_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
];

// Text selection constants
export const TEXT_SELECTION = {
  MIN_LENGTH: 1,
  MAX_LENGTH: 500
};

export default {
  FILE_UPLOAD,
  API_ENDPOINTS,
  CONNECTION_STATUS,
  ALERT_TYPES,
  ENTITY_COLORS,
  TEXT_SELECTION
};