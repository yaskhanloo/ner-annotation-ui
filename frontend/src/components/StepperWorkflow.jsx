import React, { useState } from 'react';
import {
  Box, Stepper, Step, StepLabel, StepButton, Button,
  Typography, Paper
} from '@mui/material';
import { NavigateNext, NavigateBefore } from '@mui/icons-material';

import UploadStep from './workflow/UploadStep';
import AnnotateStep from './workflow/AnnotateStep';
import ExportStep from './workflow/ExportStep';

const steps = ['Upload File or Add Text', 'Annotate Entities', 'Export'];

import CustomStepIcon from './workflow/CustomStepIcon';

const StepperWorkflow = ({
  text, setText,
  entities,
  annotations, setAnnotations,
  selectedText, setSelectedText,
  onEntitySelect, onAnnotationRemove,
  onPdfTextExtracted,
  customText, setCustomText,
  handleTextChange,
  backendStatus,
  originalFilename
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});

  const totalSteps = () => steps.length;
  const completedSteps = () => Object.keys(completed).length;
  const isLastStep = () => activeStep === totalSteps() - 1;

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && completedSteps() !== totalSteps()
        ? steps.findIndex((_, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };
  
  const handleBack = () => setActiveStep(p => p - 1);
  
  const handleStep = (step) => () => setActiveStep(step);
  
  const handleComplete = () => { 
    // Mark current step as completed
    setCompleted(p => ({ ...p, [activeStep]: true })); 
    
    // Only advance to next step if not on the last step
    if (!isLastStep()) {
      handleNext();
    }
    // If on last step, stay there - the ExportStep component handles the completion actions
  };
  
  const handleReset = () => {
    setActiveStep(0); 
    setCompleted({}); 
    setAnnotations([]); 
    setSelectedText(null); 
    setText(''); 
    setCustomText('');
  };

  const isStepValid = (step) => {
    if (step === 0) return !!text?.trim();
    if (step === 1 || step === 2) return annotations.length > 0;
    return true;
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <UploadStep {...{ onPdfTextExtracted, customText, setCustomText, handleTextChange, backendStatus, text }} />;
      case 1:
        return <AnnotateStep {...{
          text,
          annotations,
          onSelection: setSelectedText,
          entities,
          onEntitySelect,
          selectedText,
          onAnnotationRemove
        }} />;
      case 2:
        return <ExportStep {...{ annotations, text, entities, handleReset, setActiveStep, originalFilename }} />;
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h3" component="h1" gutterBottom>Medical NER Annotation Tool</Typography>
        <Typography variant="h6" color="text.secondary">German Stroke Document Entity Recognition</Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
        {/* Centered Stepper */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Stepper nonLinear activeStep={activeStep} connector={null} sx={{ width: '100%', maxWidth: '900px' }}>
            {steps.map((label, index) => (
              <Step key={label} completed={completed[index]}>
                <StepButton
                  color="inherit"
                  onClick={handleStep(index)}
                  disabled={(index === 1 && !isStepValid(0)) || (index === 2 && !isStepValid(1))}
                >
                  <StepLabel>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: index === activeStep ? 'bold' : 'medium',
                        color: index === activeStep ? 'primary.main'
                          : completed[index] ? 'success.main' : 'text.primary',
                        fontSize: { xs: '0.9rem', sm: '1.25rem' },
                        textAlign: 'center'
                      }}
                    >
                      Step {index + 1}: {label}
                    </Typography>
                  </StepLabel>
                </StepButton>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Navigation buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button disabled={activeStep === 0} onClick={handleBack} startIcon={<NavigateBefore />} variant="outlined">
            Back
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'background.paper', px: 3, py: 1, borderRadius: 3, minWidth: 200, justifyContent: 'center', border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary">Completed:</Typography>
            <Typography variant="body1" fontWeight="bold">
              {completedSteps()} / {totalSteps()}
            </Typography>
          </Box>

          <Button
            onClick={handleComplete}
            endIcon={isLastStep() ? null : <NavigateNext />}
            variant="contained"
            disabled={!isStepValid(activeStep)}
          >
            {isLastStep() ? (completed[activeStep] ? 'Complete' : 'Finish') : 'Next'}
          </Button>
        </Box>
      </Paper>

      <Paper sx={{
        p: 3,
        minHeight: 500,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%'
      }}>
        <Box sx={{ width: '100%', maxWidth: '1000px' }}>
          {getStepContent(activeStep)}
        </Box>
      </Paper>
    </Box>
  );
};

export default StepperWorkflow;