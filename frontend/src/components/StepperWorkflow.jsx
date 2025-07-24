import React, { useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
  Container,
  StepContent
} from '@mui/material';
import {
  CloudUpload,
  Edit,
  Download,
  NavigateNext,
  NavigateBefore
} from '@mui/icons-material';

// Step Components
import PdfUploader from './PdfUploader';
import TextDisplay from './TextDisplay';
import EntityLabeler from './EntityLabeler';
import MedicalAnnotationHelper from './MedicalAnnotationHelper';
import ExportPanel from './ExportPanel';

const steps = [
  {
    label: 'Upload Document',
    description: 'Upload PDF or enter text for annotation',
    icon: <CloudUpload />
  },
  {
    label: 'Annotate Entities',
    description: 'Select text and assign medical entity labels',
    icon: <Edit />
  },
  {
    label: 'Export Results',
    description: 'Download annotations in various formats',
    icon: <Download />
  }
];

const StepperWorkflow = ({
  text,
  setText,
  entities,
  annotations,
  setAnnotations,
  selectedText,
  setSelectedText,
  onEntitySelect,
  onAnnotationRemove,
  onPdfTextExtracted,
  customText,
  setCustomText,
  handleTextChange,
  backendStatus
}) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setAnnotations([]);
    setSelectedText(null);
    setText('');
    setCustomText('');
  };

  // Step validation
  const isStepValid = (step) => {
    switch (step) {
      case 0: // Upload step
        return text && text.trim().length > 0;
      case 1: // Annotation step
        return annotations.length > 0;
      case 2: // Export step
        return annotations.length > 0;
      default:
        return true;
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              📄 Step 1: Upload Document or Enter Text
            </Typography>
            
            {/* Backend Status Indicator */}
            <Box sx={{ 
              mb: 2, 
              p: 1, 
              borderRadius: 1, 
              bgcolor: backendStatus === 'connected' ? 'success.light' : 
                       backendStatus === 'disconnected' ? 'error.light' : 'warning.light',
              color: 'white',
              textAlign: 'center'
            }}>
              Backend: {backendStatus === 'connected' ? '🟢 Connected' : 
                       backendStatus === 'disconnected' ? '🔴 Disconnected' : '🟡 Checking...'}
            </Box>

            {/* PDF Upload */}
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Option 1: Upload PDF Document
              </Typography>
              <PdfUploader onTextExtracted={onPdfTextExtracted} />
            </Paper>

            {/* Text Input */}
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Option 2: Enter Text Manually
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Type or paste your German medical text:
                </Typography>
                <textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Enter your German stroke-related text here..."
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '12px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
                <Button
                  variant="contained"
                  onClick={() => handleTextChange(customText.trim())}
                  disabled={!customText.trim()}
                  sx={{ mt: 1 }}
                >
                  Use This Text
                </Button>
              </Box>
            </Paper>

            {/* Text Preview */}
            {text && (
              <Paper sx={{ p: 2, mt: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle1" gutterBottom>
                  📋 Text Preview ({text.length} characters)
                </Typography>
                <Typography variant="body2" sx={{ 
                  maxHeight: '150px', 
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                  fontSize: '0.875rem'
                }}>
                  {text.substring(0, 500)}{text.length > 500 ? '...' : ''}
                </Typography>
              </Paper>
            )}
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              🏷️ Step 2: Annotate Medical Entities
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 2 }}>
              {/* Main text area */}
              <Paper sx={{ p: 2 }}>
                <TextDisplay
                  text={text}
                  annotations={annotations}
                  onSelection={setSelectedText}
                  entities={entities}
                />
              </Paper>

              {/* Sidebar with controls */}
              <Box sx={{ display: 'grid', gap: 2 }}>
                <MedicalAnnotationHelper
                  selectedText={selectedText}
                  entities={entities}
                  onEntitySelect={onEntitySelect}
                  annotations={annotations}
                />
                
                <EntityLabeler
                  entities={entities}
                  onEntitySelect={onEntitySelect}
                  selectedText={selectedText}
                  annotations={annotations}
                  onAnnotationRemove={onAnnotationRemove}
                />
              </Box>
            </Box>

            {/* Progress indicator */}
            <Paper sx={{ p: 2, mt: 2, bgcolor: 'info.light', color: 'white' }}>
              <Typography variant="body2">
                📊 Progress: {annotations.length} annotations created
                {annotations.length === 0 && ' - Select text to start annotating!'}
              </Typography>
            </Paper>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              📥 Step 3: Export Annotations
            </Typography>
            
            {/* Summary */}
            <Paper sx={{ p: 2, mb: 2, bgcolor: 'success.light', color: 'white' }}>
              <Typography variant="h6" gutterBottom>
                ✅ Annotation Complete!
              </Typography>
              <Typography variant="body1">
                Document: {text.length} characters
              </Typography>
              <Typography variant="body1">
                Annotations: {annotations.length} entities labeled
              </Typography>
            </Paper>

            {/* Export Panel */}
            <ExportPanel
              annotations={annotations}
              text={text}
              entities={entities}
            />

            {/* Options to restart */}
            <Paper sx={{ p: 2, mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                🔄 Next Steps
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  variant="outlined" 
                  onClick={() => setActiveStep(0)}
                >
                  Annotate New Document
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => setActiveStep(1)}
                >
                  Edit Current Annotations
                </Button>
                <Button 
                  variant="outlined" 
                  color="error"
                  onClick={handleReset}
                >
                  Reset Everything
                </Button>
              </Box>
            </Paper>
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          🏥 Medical NER Annotation Tool
        </Typography>
        <Typography variant="h6" color="text.secondary">
          German Stroke Document Entity Recognition
        </Typography>
      </Box>

      {/* Stepper */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} orientation="horizontal">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                icon={step.icon}
                error={activeStep > index && !isStepValid(index)}
              >
                <Typography variant="subtitle1">{step.label}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Step Content */}
      <Paper sx={{ p: 3, minHeight: '500px' }}>
        {getStepContent(activeStep)}
      </Paper>

      {/* Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          startIcon={<NavigateBefore />}
          variant="outlined"
        >
          Back
        </Button>
        
        <Box sx={{ flex: '1 1 auto' }} />
        
        {activeStep < steps.length - 1 && (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!isStepValid(activeStep)}
            endIcon={<NavigateNext />}
          >
            {activeStep === steps.length - 2 ? 'Finish Annotation' : 'Next'}
          </Button>
        )}
      </Box>

      {/* Step validation messages */}
      {!isStepValid(activeStep) && (
        <Paper sx={{ p: 2, mt: 2, bgcolor: 'warning.light' }}>
          <Typography variant="body2" color="warning.dark">
            ⚠️ {activeStep === 0 ? 'Please upload a PDF or enter text to continue' :
                 activeStep === 1 ? 'Please create at least one annotation to continue' :
                 'Complete the current step to proceed'}
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default StepperWorkflow;