/**
 * NER Annotation Tool - Main React App
 * 
 * Simple 3-step workflow:
 * 1. Upload PDF → Extract text
 * 2. Select text → Assign entity labels  
 * 3. Export → Download JSON annotations
 */

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, AppBar, Toolbar, Chip } from '@mui/material';
import StepperWorkflow from './components/StepperWorkflow';
import ErrorBoundary from './components/ErrorBoundary';
import { useAnnotationState } from './hooks/useAnnotationState';
import './App.css';

// Material-UI theme configuration
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },    // Blue primary color
    secondary: { main: '#dc004e' },  // Red secondary color
    background: { default: '#f5f5f5' }, // Light gray background
  },
  typography: {
    fontFamily: [
      '-apple-system','BlinkMacSystemFont','"Segoe UI"','Roboto',
      '"Helvetica Neue"','Arial','sans-serif',
    ].join(','),
  },
});

function App() {
  // Get all annotation state and handlers from custom hook
  const {
    text,                    // Current document text
    setText,                 // Update document text
    entities,               // Available entity types (PERSON, PROCEDURE, etc.)
    annotations,            // Current annotations array
    setAnnotations,         // Update annotations
    selectedText,           // Currently selected text span
    setSelectedText,        // Update selected text
    onEntitySelect,         // Handle entity assignment to selected text
    onAnnotationRemove,     // Remove an annotation
    onPdfTextExtracted,     // Handle PDF text extraction
    customText,             // Custom text input
    setCustomText,          // Update custom text
    handleTextChange,       // Handle text changes
    backendStatus,          // Backend connection status
    originalFilename,       // Original filename for downloads
  } = useAnnotationState();

  // Helper function to get status chip color
  const getStatusColor = () => {
    switch (backendStatus) {
      case 'connected': return 'success';
      case 'disconnected': return 'error';
      default: return 'warning';
    }
  };

  // Helper function to get status display text
  const getStatusText = () => {
    switch (backendStatus) {
      case 'connected': return 'Connected';
      case 'disconnected': return 'Disconnected';
      default: return 'Checking...';
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {/* Top Toolbar */}
          <AppBar position="static" elevation={1} sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
            <Toolbar sx={{ justifyContent: 'center', minHeight: '56px !important' }}>
              <Chip
                label={`Backend: ${getStatusText()}`}
                color={getStatusColor()}
                variant="outlined"
                size="small"
                sx={{ fontWeight: 'medium' }}
              />
            </Toolbar>
          </AppBar>

          {/* Main Content */}
          <Box sx={{ 
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            bgcolor: 'background.default',
            py: 2
          }}>
            <Box sx={{ 
              width: '100%',
              maxWidth: '1200px',
              px: 3
            }}>
              <StepperWorkflow
                text={text}
                setText={setText}
                entities={entities}
                annotations={annotations}
                setAnnotations={setAnnotations}
                selectedText={selectedText}
                setSelectedText={setSelectedText}
                onEntitySelect={onEntitySelect}
                onAnnotationRemove={onAnnotationRemove}
                onPdfTextExtracted={onPdfTextExtracted}
                customText={customText}
                setCustomText={setCustomText}
                handleTextChange={handleTextChange}
                backendStatus={backendStatus}
                originalFilename={originalFilename}
              />
            </Box>
          </Box>
        </Box>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;