// src/App.jsx
import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import StepperWorkflow from './components/StepperWorkflow';
import { SAMPLE_TEXT, SAMPLE_ANNOTATIONS } from './data/sampleData';
import { MEDICAL_ENTITIES } from './data/medicalEntities';
import { apiService } from './services/api';
import './App.css';

// Material-UI Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  // State management
  const [text, setText] = useState('');
  const [entities, setEntities] = useState(MEDICAL_ENTITIES);
  const [annotations, setAnnotations] = useState([]);
  const [selectedText, setSelectedText] = useState(null);
  const [customText, setCustomText] = useState('');
  const [newEntity, setNewEntity] = useState({ label: '', description: '', color: '#FF6B6B' });
  const [currentDocument, setCurrentDocument] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');

  // Check backend connection on component mount
  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      await apiService.healthCheck();
      setBackendStatus('connected');
    } catch (error) {
      setBackendStatus('disconnected');
      console.error('Backend connection failed:', error);
    }
  };

  // Generate unique ID for new annotations
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

  // Save annotations to backend when they change
  useEffect(() => {
    if (currentDocument && backendStatus === 'connected') {
      saveAnnotationsToBackend();
    }
  }, [annotations, currentDocument, backendStatus]);

  const saveAnnotationsToBackend = async () => {
    try {
      await apiService.saveAnnotations(currentDocument, annotations);
    } catch (error) {
      console.error('Failed to save annotations:', error);
    }
  };

  // Handle PDF text extraction
  const handlePdfTextExtracted = (extractedText, filename) => {
    setText(extractedText);
    setAnnotations([]);
    setSelectedText(null);
    setCurrentDocument(filename.replace('.pdf', ''));
    setCustomText('');
  };

  const handleTextSelection = (selection) => {
    setSelectedText(selection);
  };

  const handleEntitySelect = (entityId) => {
    if (selectedText) {
      const newAnnotation = {
        id: generateId(),
        start: selectedText.start,
        end: selectedText.end,
        text: selectedText.text,
        entity: entityId
      };

      setAnnotations(prev => [...prev, newAnnotation]);
      setSelectedText(null);
      
      // Clear browser text selection
      window.getSelection()?.removeAllRanges();
    }
  };

  const handleAnnotationRemove = (annotationId) => {
    setAnnotations(prev => prev.filter(ann => ann.id !== annotationId));
  };

  const handleTextChange = (newText) => {
    if (newText && newText.trim()) {
      setText(newText);
      setAnnotations([]);
      setSelectedText(null);
      setCurrentDocument(`manual_text_${Date.now()}`);
    }
  };

  const addEntity = async () => {
    if (newEntity.label.trim() && newEntity.description.trim()) {
      const entityId = newEntity.label.toLowerCase().replace(/\s+/g, '_');
      const entity = {
        id: entityId,
        label: newEntity.label.toUpperCase(),
        color: newEntity.color,
        description: newEntity.description
      };
      
      if (!entities.find(e => e.id === entityId)) {
        if (backendStatus === 'connected') {
          try {
            await apiService.createEntity(entity);
          } catch (error) {
            console.error('Failed to save entity to backend:', error);
          }
        }
        
        setEntities(prev => [...prev, entity]);
        setNewEntity({ label: '', description: '', color: '#FF6B6B' });
      } else {
        alert('An entity with this label already exists!');
      }
    }
  };

  const removeEntity = (entityId) => {
    setEntities(prev => prev.filter(e => e.id !== entityId));
    setAnnotations(prev => prev.filter(ann => ann.entity !== entityId));
  };

  const resetToDefaultEntities = () => {
    setEntities(MEDICAL_ENTITIES);
    setAnnotations([]);
  };

  const clearAllAnnotations = () => {
    setAnnotations([]);
    setSelectedText(null);
  };

  const handleUseSampleText = () => {
    setText(SAMPLE_TEXT);
    setAnnotations(SAMPLE_ANNOTATIONS);
    setCustomText('');
    setCurrentDocument('sample_document');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <StepperWorkflow
          text={text}
          setText={setText}
          entities={entities}
          setEntities={setEntities}
          annotations={annotations}
          setAnnotations={setAnnotations}
          selectedText={selectedText}
          setSelectedText={handleTextSelection}
          onEntitySelect={handleEntitySelect}
          onAnnotationRemove={handleAnnotationRemove}
          onPdfTextExtracted={handlePdfTextExtracted}
          customText={customText}
          setCustomText={setCustomText}
          handleTextChange={handleTextChange}
          backendStatus={backendStatus}
          // Additional utility functions
          addEntity={addEntity}
          removeEntity={removeEntity}
          resetToDefaultEntities={resetToDefaultEntities}
          clearAllAnnotations={clearAllAnnotations}
          handleUseSampleText={handleUseSampleText}
          newEntity={newEntity}
          setNewEntity={setNewEntity}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;