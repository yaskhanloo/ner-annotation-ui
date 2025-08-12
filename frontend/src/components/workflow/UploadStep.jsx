import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import PdfUploader from '../PdfUploader';

const UploadStep = ({ onPdfTextExtracted, customText, setCustomText, handleTextChange, backendStatus, text }) => (
  <Box sx={{ mt: 2 }}>
    <Typography variant="h6" gutterBottom>Step 1: Upload Document or Enter Text</Typography>

    

    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="subtitle1" gutterBottom>Option 1: Upload PDF Document</Typography>
      <PdfUploader onTextExtracted={onPdfTextExtracted} />
    </Paper>

    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle1" gutterBottom>Option 2: Enter Text Manually</Typography>
      <Box sx={{ mb: 2 }}>
        <textarea
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder="Enter your German stroke-related text here..."
          className="text-block"
          style={{
            width: '100%', minHeight: 120, padding: 12,
            border: '1px solid #ccc', borderRadius: 4,
            fontSize: 14, resize: 'vertical'
          }}
        />
        <Button variant="contained" onClick={() => handleTextChange(customText.trim())} disabled={!customText.trim()} sx={{ mt: 1 }}>
          Use This Text
        </Button>
      </Box>
    </Paper>

    {text && (
      <Paper sx={{ p: 2, mt: 2, bgcolor: 'grey.50' }}>
        <Typography variant="subtitle1" gutterBottom>Text Preview ({text.length} characters)</Typography>
        <Typography variant="body2" className="text-block" sx={{ maxHeight: 150, overflow: 'auto', fontSize: '0.875rem' }}>
          {text.substring(0, 500)}{text.length > 500 ? '…' : ''}
        </Typography>
      </Paper>
    )}
  </Box>
);

export default UploadStep;
