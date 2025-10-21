import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Grid, 
  Chip,
  Alert
} from '@mui/material';
import { 
  Download, 
  Assessment, 
  Code, 
  DataObject 
} from '@mui/icons-material';

const ExportPanel = ({ annotations, text, entities }) => {
  const exportAsJSON = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const data = {
      document_info: {
        created_at: new Date().toISOString(),
        total_annotations: annotations.length,
        annotation_tool: 'Medical NER Annotation UI'
      },
      text,
      annotations: annotations.map(ann => {
        const entity = entities.find(e => e.id === ann.entity);
        return {
          id: ann.id,
          start: ann.start,
          end: ann.end,
          text: ann.text,
          label: ann.entity,
          entity_info: {
            label: entity?.label,
            description: entity?.description,
            color: entity?.color
          }
        };
      })
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical_ner_annotations_${timestamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsSpacy = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const spacyFormat = {
      version: 4,
      meta: {
        lang: "de",
        name: "medical_ner_model",
        description: "Medical NER annotations for German stroke documents"
      },
      data: [{
        text,
        entities: annotations.map(ann => {
          const entity = entities.find(e => e.id === ann.entity);
          return {
            start: ann.start,
            end: ann.end,
            label: entity?.label || ann.entity
          };
        })
      }]
    };
    
    const blob = new Blob([JSON.stringify(spacyFormat, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spacy_medical_ner_${timestamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportForHuggingFace = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const tokens = text.split(/\s+/);
    let charIndex = 0;
    const tokenData = [];
    
    tokens.forEach((token) => {
      const start = text.indexOf(token, charIndex);
      const end = start + token.length;
      
      let label = 'O';
      
      annotations.forEach(annotation => {
        if (start >= annotation.start && end <= annotation.end) {
          const entity = entities.find(e => e.id === annotation.entity);
          const entityLabel = entity?.label || annotation.entity;
          
          const isFirstToken = start === annotation.start;
          label = isFirstToken ? `B-${entityLabel}` : `I-${entityLabel}`;
        }
      });
      
      tokenData.push({
        token: token,
        label: label
      });
      
      charIndex = end;
    });
    
    const hfFormat = {
      data: [{
        tokens: tokenData.map(t => t.token),
        ner_tags: tokenData.map(t => t.label),
        id: 0
      }],
      features: {
        tokens: { dtype: "string", _type: "Sequence" },
        ner_tags: { dtype: "string", _type: "Sequence" }
      },
      metadata: {
        created_at: new Date().toISOString(),
        language: "de",
        domain: "medical",
        annotation_tool: "Medical NER Annotation UI"
      }
    };
    
    const blob = new Blob([JSON.stringify(hfFormat, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `huggingface_medical_ner_${timestamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsCoNLL = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const tokens = text.split(/\s+/);
    let charIndex = 0;
    const tokenPositions = [];
    
    tokens.forEach((token, i) => {
      const start = text.indexOf(token, charIndex);
      const end = start + token.length;
      tokenPositions.push({ token, start, end, index: i });
      charIndex = end;
    });

    const bioTags = new Array(tokens.length).fill('O');
    
    annotations.forEach(annotation => {
      const entity = entities.find(e => e.id === annotation.entity);
      const entityLabel = entity?.label || annotation.entity;
      
      const affectedTokens = tokenPositions.filter(tp => 
        tp.start >= annotation.start && tp.end <= annotation.end
      );
      
      affectedTokens.forEach((tp, i) => {
        if (i === 0) {
          bioTags[tp.index] = `B-${entityLabel}`;
        } else {
          bioTags[tp.index] = `I-${entityLabel}`;
        }
      });
    });

    const conllLines = tokens.map((token, i) => `${token}\t${bioTags[i]}`);
    const conllText = conllLines.join('\n');
    
    const blob = new Blob([conllText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical_ner_${timestamp}.conll`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStats = () => {
    const entityCounts = {};
    annotations.forEach(ann => {
      const entity = entities.find(e => e.id === ann.entity);
      const label = entity?.label || ann.entity;
      entityCounts[label] = (entityCounts[label] || 0) + 1;
    });
    return entityCounts;
  };

  const stats = getStats();

  return (
    <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Assessment />
        Export & Statistics
      </Typography>
      
      <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
        <Typography variant="subtitle1" gutterBottom>Statistics</Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Total annotations:</strong> {annotations.length}
          </Typography>
          <Typography variant="body2">
            <strong>Text length:</strong> {text.length.toLocaleString()} characters
          </Typography>
        </Box>
        
        {Object.keys(stats).length > 0 && (
          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>By entity type:</strong>
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {Object.entries(stats).map(([entityLabel, count]) => (
                <Chip
                  key={entityLabel}
                  label={`${entityLabel}: ${count}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}
      </Paper>

      <Typography variant="subtitle1" gutterBottom>
        Download Annotations
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="contained"
            color="success"
            startIcon={<Download />}
            onClick={exportAsJSON}
            disabled={annotations.length === 0}
            sx={{ py: 1.5 }}
          >
            Export as Enhanced JSON
          </Button>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            startIcon={<Code />}
            onClick={exportAsSpacy}
            disabled={annotations.length === 0}
            sx={{ py: 1.5 }}
          >
            Export for spaCy Training
          </Button>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="contained"
            color="warning"
            startIcon={<DataObject />}
            onClick={exportAsCoNLL}
            disabled={annotations.length === 0}
            sx={{ py: 1.5 }}
          >
            Export as CoNLL-2003 Format
          </Button>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="contained"
            sx={{ 
              bgcolor: '#FFD700', 
              color: 'black',
              '&:hover': { bgcolor: '#FFC107' },
              py: 1.5
            }}
            startIcon={<Download />}
            onClick={exportForHuggingFace}
            disabled={annotations.length === 0}
          >
            Export for Hugging Face
          </Button>
        </Grid>
      </Grid>
      
      {annotations.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Add some annotations to enable export options
        </Alert>
      )}
    </Paper>
  );
};

export default ExportPanel;