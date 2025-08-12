import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import ExportPanel from '../ExportPanel';

const ExportStep = ({ annotations, text, entities, handleReset, setActiveStep }) => (
  <Box sx={{ mt: 2 }}>
    <Typography variant="h6" gutterBottom>Step 3: Export Annotations</Typography>

    <Paper sx={{ p: 2, mb: 2, bgcolor: 'success.light' }}>
      <Typography variant="h6" gutterBottom>Annotation Complete</Typography>
      <Typography variant="body1">Document: {text.length} characters</Typography>
      <Typography variant="body1">Annotations: {annotations.length} entities labeled</Typography>
    </Paper>

    <ExportPanel annotations={annotations} text={text} entities={entities} />

    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>Next Steps</Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="outlined" onClick={() => setActiveStep(0)}>Annotate New Document</Button>
        <Button variant="outlined" onClick={() => setActiveStep(1)}>Edit Current Annotations</Button>
        <Button variant="outlined" color="error" onClick={handleReset}>Reset Everything</Button>
      </Box>
    </Paper>
  </Box>
);

export default ExportStep;
