import React, { useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepButton,
  Button,
  Typography,
  Paper,
  Container
} from '@mui/material';
import {
  CloudUpload,
  Edit,
  Download,
  NavigateNext,
  NavigateBefore,
  Check
} from '@mui/icons-material';

// Step Components
import PdfUploader from './PdfUploader';
import TextDisplay from './TextDisplay';
import EntityLabeler from './EntityLabeler';
import MedicalAnnotationHelper from './MedicalAnnotationHelper';
import ExportPanel from './ExportPanel';

const steps = [
  'Upload File or Add Text',
  'Annotate Entities', 
  'Export'
];

// Custom Step Icon Component
function CustomStepIcon(props) {
  const { active, completed, className, icon } = props;

  return (
    <div className={className}>
      {completed ? (
        <Check sx={{ fontSize: '1.5rem', color: 'success.main' }} />
      ) : (
        <Typography 
          variant="h6" 
          sx={{ 
            color: active ? 'white' : 'text.secondary',
            fontWeight: 'bold',
            backgroundColor: active ? 'primary.main' : 'grey.300',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {icon}
        </Typography>
      )}
    </div>
  );
}

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
  const [completed, setCompleted] = useState({});

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
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
              Step 1: Upload Document or Enter Text
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
              Backend: {backendStatus === 'connected' ? 'Connected' : 
                       backendStatus === 'disconnected' ? 'Disconnected' : 'Checking...'}
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
                  Text Preview ({text.length} characters)
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
              Step 2: Annotate Medical Entities
            </Typography>
            
            {/* Annotation stats at top */}
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

            {/* Text and entity types side by side */}
            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
              {/* Main text area */}
              <Paper sx={{ p: 3, flex: 1 }}>
                <TextDisplay
                  text={text}
                  annotations={annotations}
                  onSelection={setSelectedText}
                  entities={entities}
                />
              </Paper>

              {/* Entity types sidebar */}
              <Box sx={{ width: '350px' }}>
                <EntityLabeler
                  entities={entities}
                  onEntitySelect={onEntitySelect}
                  selectedText={selectedText}
                  annotations={annotations}
                  onAnnotationRemove={onAnnotationRemove}
                />
              </Box>
            </Box>

            {/* Medical annotation helper below */}
            <Box sx={{ mt: 2 }}>
              <MedicalAnnotationHelper
                selectedText={selectedText}
                entities={entities}
                onEntitySelect={onEntitySelect}
                annotations={annotations}
              />
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Step 3: Export Annotations
            </Typography>
            
            {/* Summary */}
            <Paper sx={{ p: 2, mb: 2, bgcolor: 'success.light', color: 'white' }}>
              <Typography variant="h6" gutterBottom>
                Annotation Complete
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
                Next Steps
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
    <Container 
      maxWidth={false} // Use maxWidth={false} to override default widths
      sx={{ 
        py: 4, 
        width: 900, // Fixed width
        margin: '0 auto' // Center the container
      }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Medical NER Annotation Tool
        </Typography>
        <Typography variant="h6" color="text.secondary">
          German Stroke Document Entity Recognition
        </Typography>
      </Box>

      {/* Non-Linear Stepper */}
      <Paper sx={{ 
        p: 3, 
        mb: 3, 
        bgcolor: 'grey.50',
        borderRadius: 2
      }}>
        <Stepper 
          nonLinear 
          activeStep={activeStep}
          connector={null}
        >
          {steps.map((step, index) => (
            <Step key={step} completed={completed[index]}>
              <StepButton
  color="inherit"
  onClick={handleStep(index)}
  disabled={index === 2 && annotations.length === 0}
>
                <StepLabel
                  StepIconComponent={(props) => (
                    <CustomStepIcon {...props} icon={index + 1} />
                  )}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: index === activeStep ? 'bold' : 'medium',
                      color: index === activeStep ? 'primary.main' : 
                             completed[index] ? 'success.main' : 'text.primary'
                    }}
                  >
                    Step {index + 1}: {step}
                  </Typography>
                </StepLabel>
              </StepButton>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Step Content */}
      <Paper sx={{ p: 3, minHeight: '500px' }}>
        {getStepContent(activeStep)}
      </Paper>

      {/* Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          startIcon={<NavigateBefore />}
          variant="outlined"
        >
          Back
        </Button>
        
        {/* Progress Indicator */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          bgcolor: 'grey.100',
          px: 3,
          py: 1,
          borderRadius: 3,
          minWidth: '200px',
          justifyContent: 'center'
        }}>
          <Typography variant="body2" color="text.secondary">
            Completed:
          </Typography>
          <Typography variant="body1" fontWeight="bold" color="primary.main">
            {completedSteps()}/{totalSteps()}
          </Typography>
          <Box sx={{ 
            width: 80, 
            height: 6, 
            bgcolor: 'grey.300', 
            borderRadius: 3,
            overflow: 'hidden'
          }}>
            <Box sx={{ 
              width: `${(completedSteps() / totalSteps()) * 100}%`, 
              height: '100%', 
              bgcolor: 'primary.main',
              transition: 'width 0.3s ease'
            }} />
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {completed[activeStep] ? (
            <Button
              variant="outlined"
              onClick={handleNext}
              endIcon={<NavigateNext />}
            >
              Next Step
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleComplete}
              disabled={!isStepValid(activeStep)}
            >
              Complete Step
            </Button>
          )}
          
          {allStepsCompleted() && (
            <Button
              variant="contained"
              color="success"
              onClick={handleReset}
            >
              Reset All
            </Button>
          )}
        </Box>
      </Box>

      {/* Step validation messages */}
      {!isStepValid(activeStep) && (
        <Paper sx={{ p: 2, mt: 2, bgcolor: 'warning.light' }}>
          <Typography variant="body2" color="warning.dark">
            {activeStep === 0 ? 'Please upload a PDF or enter text to continue' :
             activeStep === 1 ? 'Please create at least one annotation to continue' :
             'Complete the current step to proceed'}
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default StepperWorkflow;