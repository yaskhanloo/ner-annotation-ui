import { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Alert, 
  Paper,
  CircularProgress
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { apiService } from '../services/api';

const PdfUploader = ({ onTextExtracted }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = async (file) => {
    if (!file || file.type !== 'application/pdf') {
      setStatus({ type: 'error', message: 'Please select a valid PDF file.' });
      return;
    }

    setIsUploading(true);
    setStatus({ type: 'info', message: 'Uploading and parsing PDF...' });

    try {
      const result = await apiService.uploadPdf(file);
      
      if (result.text) {
        setStatus({ 
          type: 'success', 
          message: `Successfully extracted text from ${result.filename}` 
        });
        onTextExtracted(result.text, result.filename);
      } else {
        setStatus({ 
          type: 'error', 
          message: 'No text could be extracted from the PDF.' 
        });
      }
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: `Failed to process PDF: ${error.response?.data?.error || error.message}` 
      });  
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  return (
    <Box>
      <Paper
        sx={{
          border: '2px dashed',
          borderColor: dragOver ? 'primary.main' : 'grey.300',
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
          my: 2,
          bgcolor: dragOver ? 'primary.50' : 'grey.50',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'primary.50'
          }
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('pdf-upload').click()}
      >
        <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Upload PDF Document
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Drag and drop a PDF file here, or click to select
        </Typography>
        
        <input
          type="file"
          id="pdf-upload"
          accept=".pdf"
          onChange={handleFileSelect}
          disabled={isUploading}
          style={{ display: 'none' }}
        />
        
        <Button
          variant="contained"
          disabled={isUploading}
          startIcon={isUploading ? <CircularProgress size={20} /> : <CloudUpload />}
          sx={{ mt: 1 }}
        >
          {isUploading ? 'Processing...' : 'Select PDF File'}
        </Button>
      </Paper>

      {status && (
        <Alert 
          severity={status.type === 'error' ? 'error' : status.type === 'success' ? 'success' : 'info'}
          sx={{ mt: 2 }}
        >
          {status.message}
        </Alert>
      )}
    </Box>
  );
};

export default PdfUploader;