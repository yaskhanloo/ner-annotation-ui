import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, AppBar, Toolbar, Typography, Chip } from '@mui/material';
import StepperWorkflow from './components/StepperWorkflow';
import ErrorBoundary from './components/ErrorBoundary';
import { useAnnotationState } from './hooks/useAnnotationState';
import './App.css';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { default: '#f5f5f5' },
  },
  typography: {
    fontFamily: [
      '-apple-system','BlinkMacSystemFont','"Segoe UI"','Roboto',
      '"Helvetica Neue"','Arial','sans-serif',
    ].join(','),
  },
});

function App() {
  const {
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
    backendStatus,
  } = useAnnotationState();

  const getStatusColor = () => {
    switch (backendStatus) {
      case 'connected': return 'success';
      case 'disconnected': return 'error';
      default: return 'warning';
    }
  };

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
              />
            </Box>
          </Box>
        </Box>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;