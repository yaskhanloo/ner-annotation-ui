import React, { useState } from 'react'
import {
  Box, Stepper, Step, StepLabel, StepButton, Button,
  Typography, Paper
} from '@mui/material'
import { NavigateNext, NavigateBefore, Check } from '@mui/icons-material'

import PdfUploader from './PdfUploader'
import TextDisplay from './TextDisplay'
import EntityLabeler from './EntityLabeler'
import MedicalAnnotationHelper from './MedicalAnnotationHelper'
import ExportPanel from './ExportPanel'

const steps = ['Upload File or Add Text','Annotate Entities','Export']

function CustomStepIcon(props) {
  const { active, completed, className, icon } = props
  return (
    <div className={className ?? ''}>
      {completed ? (
        <Check sx={{ fontSize: '1.5rem', color: 'success.main' }} />
      ) : (
        <Box component="span" sx={{
          color: active ? 'white' : 'text.secondary',
          fontWeight: 'bold',
          backgroundColor: active ? 'primary.main' : 'grey.300',
          borderRadius: '50%',
          width: 32, height: 32, display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>
          {icon}
        </Box>
      )}
    </div>
  )
}

const StepperWorkflow = ({
  text, setText,
  entities,
  annotations, setAnnotations,
  selectedText, setSelectedText,
  onEntitySelect, onAnnotationRemove,
  onPdfTextExtracted,
  customText, setCustomText,
  handleTextChange,
  backendStatus
}) => {
  const [activeStep, setActiveStep] = useState(0)
  const [completed, setCompleted] = useState({})

  const totalSteps = () => steps.length
  const completedSteps = () => Object.keys(completed).length
  const isLastStep = () => activeStep === totalSteps() - 1

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && completedSteps() !== totalSteps()
        ? steps.findIndex((_, i) => !(i in completed))
        : activeStep + 1
    setActiveStep(newActiveStep)
  }
  const handleBack  = () => setActiveStep(p => p - 1)
  const handleStep  = (step) => () => setActiveStep(step)
  const handleComplete = () => { setCompleted(p => ({ ...p, [activeStep]: true })); handleNext() }
  const handleReset = () => {
    setActiveStep(0); setCompleted({}); setAnnotations([]); setSelectedText(null); setText(''); setCustomText('')
  }

  const isStepValid = (step) => {
    if (step === 0) return !!text?.trim()
    if (step === 1 || step === 2) return annotations.length > 0
    return true
  }

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>Step 1: Upload Document or Enter Text</Typography>

            <Box sx={{
              mb: 2, p: 1, borderRadius: 1, textAlign: 'center',
              bgcolor: backendStatus === 'connected' ? 'success.light'
                    : backendStatus === 'disconnected' ? 'error.light'
                    : 'warning.light'
            }}>
              Backend: {backendStatus === 'connected' ? 'Connected'
                       : backendStatus === 'disconnected' ? 'Disconnected'
                       : 'Checking...'}
            </Box>

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
                  className="text-block" /* uses App.css typography */
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
        )

      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>Step 2: Annotate Medical Entities</Typography>

            {annotations.length === 0 ? (
              <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.100', textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">Select text below to start annotating</Typography>
              </Paper>
            ) : (
              <Paper sx={{ p: 2, mb: 2, bgcolor: 'success.light', textAlign: 'center' }}>
                <Typography variant="body2" color="success.dark">{annotations.length} annotations created</Typography>
              </Paper>
            )}

            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
              <Paper sx={{ p: 3, flex: 1 }}>
                <TextDisplay
                  text={text}
                  annotations={annotations}
                  onSelection={setSelectedText}
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

            <Box sx={{ mt: 2 }}>
              <MedicalAnnotationHelper
                selectedText={selectedText}
                entities={entities}
                onEntitySelect={onEntitySelect}
                annotations={annotations}
              />
            </Box>
          </Box>
        )

      case 2:
        return (
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
        )

      default:
        return 'Unknown step'
    }
  }

  return (
    // No Container/maxWidth here—.app-editor from App.css handles layout
    <Box sx={{ py: 2 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h3" component="h1" gutterBottom>Medical NER Annotation Tool</Typography>
        <Typography variant="h6" color="text.secondary">German Stroke Document Entity Recognition</Typography>
      </Box>

      {/* Stepper */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
        <Stepper nonLinear activeStep={activeStep} connector={null}>
          {steps.map((label, index) => (
            <Step key={label} completed={completed[index]}>
              <StepButton
                color="inherit"
                onClick={handleStep(index)}
                disabled={(index === 1 && !isStepValid(1)) || (index === 2 && !isStepValid(2))}
              >
                <StepLabel StepIconComponent={(p) => <CustomStepIcon {...p} icon={index + 1} />}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: index === activeStep ? 'bold' : 'medium',
                      color: index === activeStep ? 'primary.main'
                        : completed[index] ? 'success.main' : 'text.primary'
                    }}
                  >
                    Step {index + 1}: {label}
                  </Typography>
                </StepLabel>
              </StepButton>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Step content */}
      <Paper sx={{ p: 3, minHeight: 500 }}>{getStepContent(activeStep)}</Paper>

      {/* Nav */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
        <Button disabled={activeStep === 0} onClick={handleBack} startIcon={<NavigateBefore />} variant="outlined">
          Back
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'grey.100', px: 3, py: 1, borderRadius: 3, minWidth: 200, justifyContent: 'center' }}>
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
          {isLastStep() ? 'Finish' : 'Next'}
        </Button>
      </Box>
    </Box>
  )
}

export default StepperWorkflow