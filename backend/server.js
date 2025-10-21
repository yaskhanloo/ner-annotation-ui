/**
 * NER Annotation Tool - Backend Server
 * 
 * Express.js API server:
 * - Handles PDF uploads → calls Python script for text extraction
 * - Stores annotations in memory (replace with DB for production)
 * - Serves React frontend in production mode
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { CONFIG, validateConfig } from './config/index.js';
import { logger } from './utils/logger.js';
import apiRoutes from './routes/api.js';

// ES module compatibility for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ============================================================================
// CONFIGURATION VALIDATION
// ============================================================================

const configErrors = validateConfig();
if (configErrors.length > 0) {
  logger.error('Configuration validation failed', { errors: configErrors });
  process.exit(1);
}

// ============================================================================
// MIDDLEWARE SETUP
// ============================================================================

// Enable CORS for frontend communication
app.use(cors({
  origin: CONFIG.CORS_ORIGIN,
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// Request logging middleware (optional)
if (CONFIG.ENABLE_REQUEST_LOGGING && CONFIG.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    logger.debug('Request received', { method: req.method, path: req.path });
    next();
  });
}

// Serve React frontend in production mode
if (CONFIG.NODE_ENV === 'production') {
  const publicPath = path.join(__dirname, 'public');
  app.use(express.static(publicPath));
}

// ============================================================================
// API ROUTES
// ============================================================================

// Mount API routes
app.use('/api', apiRoutes);

// ============================================================================
// PRODUCTION FRONTEND SERVING & SERVER STARTUP
// ============================================================================

// Serve React frontend for all non-API routes (SPA routing)
if (CONFIG.NODE_ENV === 'production') {
  const publicPath = path.join(__dirname, 'public');
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

// Global error handler
app.use((error, req, res, next) => {
  logger.error('Unhandled error', { 
    error: error.message, 
    stack: error.stack,
    path: req.path,
    method: req.method
  });
  
  res.status(500).json({
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
    ...(CONFIG.NODE_ENV === 'development' && { details: error.message })
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    code: 'NOT_FOUND',
    path: req.path
  });
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

// Start the server
app.listen(CONFIG.PORT, () => {
  logger.info('NER Annotation Server started', {
    port: CONFIG.PORT,
    environment: CONFIG.NODE_ENV,
    uploadDir: CONFIG.UPLOAD_DIR,
    maxFileSize: `${Math.round(CONFIG.MAX_FILE_SIZE / 1024 / 1024)}MB`,
    corsOrigin: CONFIG.CORS_ORIGIN
  });
});