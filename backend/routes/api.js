/**
 * API Routes
 * Centralized route handlers for the API endpoints
 */

import express from 'express';
import multer from 'multer';
import { CONFIG } from '../config/index.js';
import { logger } from '../utils/logger.js';
import { pdfService } from '../services/pdfService.js';

const router = express.Router();

// Configure file upload handling
const upload = multer({
  dest: CONFIG.UPLOAD_DIR,
  limits: { fileSize: CONFIG.MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

/**
 * Health Check Endpoint
 * GET /api/health
 */
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: CONFIG.NODE_ENV
  });
});

/**
 * PDF Upload and Text Extraction Endpoint
 * POST /api/upload-pdf
 */
router.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
  try {
    const result = await pdfService.processUpload(req.file);
    
    if (result.success) {
      logger.info('PDF upload successful', {
        filename: result.data.filename,
        fileSize: result.data.metadata.fileSize
      });
      
      res.json(result.data);
    } else {
      const error = result.errors[0];
      logger.warn('PDF upload failed', { error: error.code, message: error.message });
      
      res.status(400).json({
        error: error.message,
        code: error.code,
        ...(error.maxSize && { maxSize: error.maxSize })
      });
    }
  } catch (error) {
    logger.error('PDF upload error', { error: error.message });
    
    res.status(500).json({
      error: 'Server error during upload',
      details: error.message,
      code: 'SERVER_ERROR'
    });
  }
});

/**
 * Annotation Storage Endpoints
 * TODO: Implement database storage
 */

// Get saved annotations for a document
router.get('/annotations/:documentId', (req, res) => {
  // TODO: Implement database storage
  logger.debug('Get annotations requested', { documentId: req.params.documentId });
  res.json({ annotations: [] });
});

// Save annotations for a document
router.post('/annotations/:documentId', (req, res) => {
  const { annotations } = req.body;
  // TODO: Implement database storage
  logger.debug('Save annotations requested', { 
    documentId: req.params.documentId,
    count: annotations?.length || 0
  });
  res.json({ success: true, message: 'Annotations saved' });
});

/**
 * Entity Management Endpoints
 * TODO: Implement database storage
 */

// Get available entity types
router.get('/entities', (req, res) => {
  // TODO: Implement database storage
  logger.debug('Get entities requested');
  res.json({ entities: [] });
});

// Create new custom entity type
router.post('/entities', (req, res) => {
  const { label, description, color } = req.body;
  // TODO: Implement database storage
  logger.debug('Create entity requested', { label, description, color });
  res.json({ success: true, entityId: Date.now().toString() });
});

/**
 * Export Endpoint
 * TODO: Implement export functionality
 */
router.get('/export/:documentId/:format', (req, res) => {
  const { documentId, format } = req.params;
  // TODO: Implement export functionality (JSON, CoNLL, spaCy)
  logger.debug('Export requested', { documentId, format });
  res.json({ success: true, format, documentId });
});

export default router;