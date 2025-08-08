import { useState, useEffect } from 'react'

// Material UI theme system
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

// Main workflow component (stepper wizard)
import StepperWorkflow from './components/StepperWorkflow'

// Sample/demo data for quick load
import { SAMPLE_TEXT, SAMPLE_ANNOTATIONS } from './data/sampleData'
import { MEDICAL_ENTITIES } from './data/medicalEntities'

// API abstraction for backend calls
import { apiService } from './services/api'

// Global styles with layout grid
import './App.css' // uses .app-shell / .app-toolbar / .app-editor

// ---------- MUI THEME ----------
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
})

function App() {
  // ---------- GLOBAL STATE ----------
  const [text, setText] = useState('') // Current document text
  const [entities, setEntities] = useState(MEDICAL_ENTITIES) // Entity definitions
  const [annotations, setAnnotations] = useState([]) // All annotations
  const [selectedText, setSelectedText] = useState(null) // Current selection
  const [customText, setCustomText] = useState('') // Manual text input
  const [newEntity, setNewEntity] = useState({ label: '', description: '', color: '#FF6B6B' }) // New entity form
  const [currentDocument, setCurrentDocument] = useState(null) // Document ID/name
  const [backendStatus, setBackendStatus] = useState('checking') // Backend connection state

  // ---------- LIFECYCLE ----------
  // Check backend connection on mount
  useEffect(() => { checkBackendConnection() }, [])

  const checkBackendConnection = async () => {
    try { 
      await apiService.healthCheck()
      setBackendStatus('connected') 
    } catch (e) { 
      setBackendStatus('disconnected') 
      console.error('Backend connection failed:', e) 
    }
  }

  // Generate a unique ID for each annotation
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`

  // Auto-save annotations when they change and backend is connected
  useEffect(() => {
    if (currentDocument && backendStatus === 'connected') saveAnnotationsToBackend()
  }, [annotations, currentDocument, backendStatus])

  const saveAnnotationsToBackend = async () => {
    try { await apiService.saveAnnotations(currentDocument, annotations) }
    catch (e) { console.error('Failed to save annotations:', e) }
  }

  // ---------- HANDLERS ----------
  // When a PDF is uploaded and text is extracted
  const handlePdfTextExtracted = (extractedText, filename) => {
    setText(extractedText)
    setAnnotations([])
    setSelectedText(null)
    setCurrentDocument(filename.replace('.pdf', ''))
    setCustomText('')
  }

  // When user highlights text in the viewer
  const handleTextSelection = (selection) => setSelectedText(selection)

  // Create a new annotation for the selected text
  const handleEntitySelect = (entityId) => {
    if (!selectedText) return
    const newAnnotation = {
      id: generateId(),
      start: selectedText.start,
      end: selectedText.end,
      text: selectedText.text,
      entity: entityId,
    }
    setAnnotations(prev => [...prev, newAnnotation])
    setSelectedText(null)
    window.getSelection()?.removeAllRanges()
  }

  // Remove annotation by ID
  const handleAnnotationRemove = (annotationId) =>
    setAnnotations(prev => prev.filter(ann => ann.id !== annotationId))

  // Manually set text (clears old annotations)
  const handleTextChange = (newText) => {
    if (!newText?.trim()) return
    setText(newText)
    setAnnotations([])
    setSelectedText(null)
    setCurrentDocument(`manual_text_${Date.now()}`)
  }

  // Add new entity type
  const addEntity = async () => {
    if (!newEntity.label.trim() || !newEntity.description.trim()) return
    const entityId = newEntity.label.toLowerCase().replace(/\s+/g, '_')
    const entity = {
      id: entityId,
      label: newEntity.label.toUpperCase(),
      color: newEntity.color,
      description: newEntity.description,
    }
    if (entities.find(e => e.id === entityId)) { alert('An entity with this label already exists!'); return }
    if (backendStatus === 'connected') {
      try { await apiService.createEntity(entity) } catch (e) { console.error('Failed to save entity:', e) }
    }
    setEntities(prev => [...prev, entity])
    setNewEntity({ label: '', description: '', color: '#FF6B6B' })
  }

  // Remove entity and any related annotations
  const removeEntity = (entityId) => {
    setEntities(prev => prev.filter(e => e.id !== entityId))
    setAnnotations(prev => prev.filter(ann => ann.entity !== entityId))
  }

  // Reset entities to the default set
  const resetToDefaultEntities = () => { setEntities(MEDICAL_ENTITIES); setAnnotations([]) }

  // Clear all annotations
  const clearAllAnnotations = () => { setAnnotations([]); setSelectedText(null) }

  // Load built-in sample document
  const handleUseSampleText = () => {
    setText(SAMPLE_TEXT)
    setAnnotations(SAMPLE_ANNOTATIONS)
    setCustomText('')
    setCurrentDocument('sample_document')
  }

  // ---------- RENDER ----------
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app-shell">{/* Layout grid container */}
        
        {/* Top Toolbar with backend status */}
        <div className="app-toolbar">
          <span className={`status-badge ${
            backendStatus === 'connected' ? 'status--ok'
            : backendStatus === 'disconnected' ? 'status--down'
            : 'status--check'
          }`}>
            {backendStatus}
          </span>
        </div>

        {/* Main Editor Area (StepperWorkflow inside) */}
        <main className="app-editor">
          <StepperWorkflow
            text={text}
            setText={setText}
            entities={entities}
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
          />
        </main>

        {/* Optional: .app-sidebar and .app-panel go here if you add them */}
      </div>
    </ThemeProvider>
  )
}

export default App