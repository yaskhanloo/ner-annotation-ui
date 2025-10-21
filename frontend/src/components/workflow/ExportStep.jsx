import React from 'react';
import { Box, Typography, Paper, Button, Divider } from '@mui/material';
import { Download, Refresh, Edit, Add } from '@mui/icons-material';
import ExportPanel from '../ExportPanel';

const ExportStep = ({ annotations, text, entities, handleReset, setActiveStep }) => (
  <Box sx={{ mt: 2 }}>
    <Typography variant="h6" gutterBottom>Step 3: Export Annotations</Typography>

    <Paper sx={{ p: 3, mb: 3, bgcolor: 'success.50', border: '1px solid', borderColor: 'success.main' }}>
      <Typography variant="h5" gutterBottom color="success.dark" sx={{ fontWeight: 'bold' }}>
        🎉 Annotation Complete!
      </Typography>
      <Box sx={{ display: 'flex', gap: 4, mt: 2 }}>
        <Typography variant="body1">
          <strong>Document:</strong> {text.length.toLocaleString()} characters
        </Typography>
        <Typography variant="body1">
          <strong>Annotations:</strong> {annotations.length} entities labeled
        </Typography>
      </Box>
    </Paper>

    <ExportPanel annotations={annotations} text={text} entities={entities} />

    <Divider sx={{ my: 3 }} />

    <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        What would you like to do next?
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={() => setActiveStep(0)}
            sx={{ minWidth: 200 }}
          >
            Annotate New Document
          </Button>
          
          <Button 
            variant="outlined" 
            startIcon={<Edit />}
            onClick={() => setActiveStep(1)}
            sx={{ minWidth: 200 }}
          >
            Edit Current Annotations
          </Button>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<Refresh />}
            onClick={handleReset}
            sx={{ minWidth: 200 }}
          >
            Reset Everything
          </Button>
        </Box>
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        💡 Tip: Use "Export JSON" above to download your annotations before starting a new task.
      </Typography>
    </Paper>
  </Box>
);

export default ExportStep;
