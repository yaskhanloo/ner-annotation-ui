/**
 * PDF Processing Service
 * Handles PDF upload, validation, and text extraction
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { CONFIG } from '../config/index.js';
import { logger } from '../utils/logger.js';

export class PDFService {
  constructor() {
    this.ensureUploadDir();
  }

  ensureUploadDir() {
    if (!fs.existsSync(CONFIG.UPLOAD_DIR)) {
      fs.mkdirSync(CONFIG.UPLOAD_DIR, { recursive: true });
      logger.info('Created upload directory', { dir: CONFIG.UPLOAD_DIR });
    }
  }

  validateFile(file) {
    const errors = [];

    if (!file) {
      errors.push({ code: 'NO_FILE', message: 'No PDF file uploaded' });
      return errors;
    }

    if (file.mimetype !== 'application/pdf') {
      errors.push({ code: 'INVALID_TYPE', message: 'Only PDF files are allowed' });
    }

    if (file.size > CONFIG.MAX_FILE_SIZE) {
      errors.push({
        code: 'FILE_TOO_LARGE',
        message: `File too large. Maximum size is ${Math.round(CONFIG.MAX_FILE_SIZE / 1024 / 1024)}MB.`,
        maxSize: CONFIG.MAX_FILE_SIZE
      });
    }

    return errors;
  }

  async extractText(filePath, originalName) {
    return new Promise((resolve, reject) => {
      logger.info('Starting PDF text extraction', {
        file: originalName,
        path: filePath
      });

      const pythonProcess = spawn(CONFIG.PYTHON_CMD, ['pdf_parser.py', filePath]);
      
      let result = '';
      let error = '';
      let isResolved = false;

      // Set timeout for PDF processing
      const timeout = setTimeout(() => {
        if (!isResolved) {
          pythonProcess.kill('SIGTERM');
          isResolved = true;
          this.cleanupFile(filePath);
          
          reject({
            code: 'PROCESSING_TIMEOUT',
            message: `PDF processing timeout (${CONFIG.PDF_PROCESSING_TIMEOUT / 1000}s)`
          });
        }
      }, CONFIG.PDF_PROCESSING_TIMEOUT);

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
        this.cleanupFile(filePath);

        logger.debug('Python process finished', { code, file: originalName });

        if (code !== 0) {
          logger.error('PDF parsing failed', { code, error, file: originalName });
          reject({
            code: 'PARSING_FAILED',
            message: 'PDF parsing failed',
            details: error || 'Unknown parsing error',
            exitCode: code
          });
          return;
        }

        try {
          const parsedData = JSON.parse(result);

          // Validate parsed data
          if (!parsedData.text || typeof parsedData.text !== 'string') {
            reject({
              code: 'INVALID_PARSED_DATA',
              message: 'Invalid parsed data - no text content'
            });
            return;
          }

          logger.info('PDF text extraction successful', {
            file: originalName,
            pages: parsedData.pages,
            wordCount: parsedData.word_count
          });

          resolve({
            text: parsedData.text,
            filename: originalName,
            metadata: {
              pages: parsedData.pages || 0,
              wordCount: parsedData.word_count || 0,
              extractionMethod: parsedData.extraction_method || 'unknown',
              processedAt: new Date().toISOString()
            }
          });

        } catch (parseError) {
          logger.error('JSON parse error', { error: parseError.message, file: originalName });
          reject({
            code: 'JSON_PARSE_ERROR',
            message: 'Failed to parse PDF response',
            details: parseError.message,
            rawOutput: result.substring(0, 500) // Limit output size
          });
        }
      });

      pythonProcess.on('error', (err) => {
        if (isResolved) return;
        isResolved = true;
        clearTimeout(timeout);

        this.cleanupFile(filePath);

        logger.error('Python process error', { error: err.message, file: originalName });
        reject({
          code: 'PROCESS_START_ERROR',
          message: 'Failed to start PDF processing',
          details: err.message
        });
      });
    });
  }

  cleanupFile(filePath) {
    try {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        logger.debug('Cleaned up temporary file', { path: filePath });
      }
    } catch (error) {
      logger.warn('Failed to cleanup file', { path: filePath, error: error.message });
    }
  }

  async processUpload(file) {
    // Validate file
    const validationErrors = this.validateFile(file);
    if (validationErrors.length > 0) {
      return { success: false, errors: validationErrors };
    }

    // Verify file exists and is readable
    if (!fs.existsSync(file.path)) {
      return {
        success: false,
        errors: [{
          code: 'FILE_NOT_FOUND',
          message: 'Uploaded file not found'
        }]
      };
    }

    try {
      const result = await this.extractText(file.path, file.originalname);
      return {
        success: true,
        data: {
          ...result,
          metadata: {
            ...result.metadata,
            fileSize: file.size
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        errors: [error]
      };
    }
  }
}

export const pdfService = new PDFService();
export default pdfService;