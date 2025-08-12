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
import multer from 'multer';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';

// ES module compatibility for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================================================
// MIDDLEWARE SETUP
// ============================================================================

// Enable CORS for frontend communication
app.use(cors());
// Parse JSON request bodies
app.use(express.json());

// Serve React frontend in production mode
if (process.env.NODE_ENV === 'production') {
  const publicPath = path.join(__dirname, 'public');
  app.use(express.static(publicPath));
}

// Configure file upload handling (PDF files only, 10MB limit)
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// ============================================================================
// API ROUTES
// ============================================================================

/**
 * Health Check Endpoint
 * GET /api/health
 * Returns server status for monitoring
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

/**
 * PDF Upload and Text Extraction Endpoint
 * POST /api/upload-pdf
 * 
 * Accepts PDF file, extracts text using Python pdfplumber,
 * returns extracted text with metadata
 */
app.post('/api/upload-pdf', upload.single('pdf'), async (req, res) => {
  let filePath = null;

  try {
    // Validation
    if (!req.file) {
      return res.status(400).json({
        error: 'No PDF file uploaded',
        code: 'NO_FILE'
      });
    }

    // File size validation (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (req.file.size > maxSize) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        error: 'File too large. Maximum size is 10MB.',
        code: 'FILE_TOO_LARGE',
        maxSize: maxSize
      });
    }

    filePath = req.file.path;

    // Verify file exists and is readable
    if (!fs.existsSync(filePath)) {
      return res.status(500).json({
        error: 'Uploaded file not found',
        code: 'FILE_NOT_FOUND'
      });
    }

    console.log(`Processing PDF: ${req.file.originalname} (${req.file.size} bytes)`);

    // Call Python script with timeout
    const pythonCmd = 'python3';
    const pythonProcess = spawn(pythonCmd, ['pdf_parser.py', filePath]);

    let result = '';
    let error = '';
    let isResolved = false;

    // Set timeout for PDF processing (30 seconds)
    const timeout = setTimeout(() => {
      if (!isResolved) {
        pythonProcess.kill('SIGTERM');
        isResolved = true;
        if (filePath && fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        res.status(408).json({
          error: 'PDF processing timeout',
          code: 'PROCESSING_TIMEOUT'
        });
      }
    }, 30000);

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (isResolved) return;
      isResolved = true;
      clearTimeout(timeout);

      // Clean up uploaded file
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      console.log(`Python process finished with code: ${code}`);

      if (code !== 0) {
        console.error('Python stderr:', error);
        return res.status(500).json({
          error: 'PDF parsing failed',
          details: error || 'Unknown parsing error',
          code: 'PARSING_FAILED',
          exitCode: code
        });
      }

      try {
        const parsedData = JSON.parse(result);

        // Validate parsed data
        if (!parsedData.text || typeof parsedData.text !== 'string') {
          return res.status(500).json({
            error: 'Invalid parsed data - no text content',
            code: 'INVALID_PARSED_DATA'
          });
        }

        // Success response with metadata
        res.json({
          text: parsedData.text,
          filename: req.file.originalname,
          metadata: {
            pages: parsedData.pages || 0,
            wordCount: parsedData.word_count || 0,
            extractionMethod: parsedData.extraction_method || 'unknown',
            fileSize: req.file.size,
            processedAt: new Date().toISOString()
          }
        });

      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        res.status(500).json({
          error: 'Failed to parse PDF response',
          details: parseError.message,
          code: 'JSON_PARSE_ERROR',
          rawOutput: result.substring(0, 500) // Limit output size
        });
      }
    });

    pythonProcess.on('error', (err) => {
      if (isResolved) return;
      isResolved = true;
      clearTimeout(timeout);

      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      console.error('Python process error:', err);
      res.status(500).json({
        error: 'Failed to start PDF processing',
        details: err.message,
        code: 'PROCESS_START_ERROR'
      });
    });

  } catch (error) {
    console.error('Upload error:', error);

    // Clean up file if it exists
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(500).json({
      error: 'Server error during upload',
      details: error.message,
      code: 'SERVER_ERROR'
    });
  }
});

/**
 * Annotation Storage Endpoints
 * In-memory storage for MVP (replace with database for production)
 */

// Get saved annotations for a document
app.get('/api/annotations/:documentId', (req, res) => {
  // TODO: Implement database storage
  res.json({ annotations: [] });
});

// Save annotations for a document
app.post('/api/annotations/:documentId', (req, res) => {
  const { annotations } = req.body;
  // TODO: Implement database storage
  res.json({ success: true, message: 'Annotations saved' });
});

/**
 * Entity Management Endpoints
 * Manage custom entity types
 */

// Get available entity types
app.get('/api/entities', (req, res) => {
  // TODO: Implement database storage
  res.json({ entities: [] });
});

// Create new custom entity type
app.post('/api/entities', (req, res) => {
  const { label, description, color } = req.body;
  // TODO: Implement database storage
  res.json({ success: true, entityId: Date.now().toString() });
});

/**
 * Export Endpoint
 * Export annotations in various formats
 */
app.get('/api/export/:documentId/:format', (req, res) => {
  const { documentId, format } = req.params;
  // TODO: Implement export functionality (JSON, CoNLL, spaCy)
  res.json({ success: true, format, documentId });
});

// ============================================================================
// PRODUCTION FRONTEND SERVING & SERVER STARTUP
// ============================================================================

// Serve React frontend for all non-API routes (SPA routing)
if (process.env.NODE_ENV === 'production') {
  const publicPath = path.join(__dirname, 'public');
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 NER Annotation Server running on port ${PORT}`);
  console.log(`📱 Access the app at: http://localhost:${PORT}`);
});