import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import TextDisplay from '../TextDisplay';
import EntityLabeler from '../EntityLabeler';

const AnnotateStep = ({ 
  text, 
  annotations, 
  onSelection, 
  entities, 
  onEntitySelect, 
  selectedText, 
  onAnnotationRemove
}) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>Step 2: Annotate Medical Entities</Typography>

      {annotations.length === 0 ? (
        <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.100', textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Select text below to start annotating
          </Typography>
        </Paper>
      ) : (
        <Paper sx={{ p: 2, mb: 2, bgcolor: 'success.light', textAlign: 'center' }}>
          <Typography variant="body2" color="success.dark">
            {annotations.length} annotations created
          </Typography>
        </Paper>
      )}

      <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
        <Paper sx={{ p: 3, flex: 1 }}>
          <TextDisplay
            text={text}
            annotations={annotations}
            onSelection={onSelection}
            entities={entities}
          />
        </Paper>

        <Box sx={{ width: 350 }}>
          <EntityLabeler
            entities={entities}
            onEntitySelect={onEntitySelect}
            selectedText={selectedText}
            annotations={annotations}
            onAnnotationRemove={onAnnotationRemove}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default AnnotateStep;
