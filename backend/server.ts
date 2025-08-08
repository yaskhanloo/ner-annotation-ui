import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { config } from 'dotenv';

config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Routes

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Upload and parse PDF
app.post('/api/upload-pdf', upload.single('pdf'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const filePath = req.file.path;
    
    // Call Python script to parse PDF using system Python (has pdfplumber in user directory)
    const pythonCmd = 'python3';
    
    console.log('Using Python:', pythonCmd);
    const pythonProcess = spawn(pythonCmd, ['pdf_parser.py', filePath]);
    
    let result = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    pythonProcess.on('close', (code) => {
      // Log debug info
      console.log('Python exit code:', code);
      console.log('Python stdout:', result);
      console.log('Python stderr:', error);
      
      // Clean up uploaded file
      fs.unlinkSync(filePath);

      if (code !== 0) {
        return res.status(500).json({ 
          error: 'PDF parsing failed', 
          details: error,
          exitCode: code,
          stdout: result 
        });
      }

      try {
        const parsedData = JSON.parse(result);
        res.json({ text: parsedData.text, filename: req.file?.originalname });
      } catch (parseError: any) {
        res.status(500).json({ 
          error: 'Failed to parse PDF response', 
          details: parseError.message,
          rawOutput: result 
        });
      }
    });

  } catch (error: any) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Get annotations for a document
app.get('/api/annotations/:documentId', (req: Request, res: Response) => {
  // TODO: Implement database storage
  res.json({ annotations: [] });
});

// Save annotations for a document
app.post('/api/annotations/:documentId', (req: Request, res: Response) => {
  const { annotations } = req.body;
  // TODO: Implement database storage
  res.json({ success: true, message: 'Annotations saved' });
});

// Get entity types
app.get('/api/entities', (req: Request, res: Response) => {
  // TODO: Implement database storage
  res.json({ entities: [] });
});

// Create new entity type
app.post('/api/entities', (req: Request, res: Response) => {
  const { label, description, color } = req.body;
  // TODO: Implement database storage
  res.json({ success: true, entityId: Date.now().toString() });
});

// Export annotations
app.get('/api/export/:documentId/:format', (req: Request, res: Response) => {
  const { documentId, format } = req.params;
  // TODO: Implement export functionality
  res.json({ success: true, format, documentId });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});