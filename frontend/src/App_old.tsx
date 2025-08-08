// src/App.jsx
import { useState, useEffect } from 'react';
import TextDisplay from './components/TextDisplay';
import EntityLabeler from './components/EntityLabeler';
import ExportPanel from './components/ExportPanel';
import PdfUploader from './components/PdfUploader';
import MedicalAnnotationHelper from './components/MedicalAnnotationHelper';
import { SAMPLE_TEXT, SAMPLE_ANNOTATIONS } from './data/sampleData';
import { MEDICAL_ENTITIES } from './data/medicalEntities';
import { apiService } from './services/api';
import './App.css';

function App() {
  const [text, setText] = useState(SAMPLE_TEXT);
  const [entities, setEntities] = useState(MEDICAL_ENTITIES);
  const [annotations, setAnnotations] = useState(SAMPLE_ANNOTATIONS);
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
      setSelectedText(null); // Clear selection after adding annotation
      
      // Clear browser text selection
      window.getSelection()?.removeAllRanges();
    }
  };

  const handleAnnotationRemove = (annotationId) => {
    setAnnotations(prev => prev.filter(ann => ann.id !== annotationId));
  };

  const clearAllAnnotations = () => {
    setAnnotations([]);
    setSelectedText(null);
  };

  const handleTextChange = (newText) => {
    setText(newText);
    setAnnotations([]);
    setSelectedText(null);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target.result;
        handleTextChange(fileContent);
        setCustomText('');
      };
      reader.readAsText(file);
    } else {
      alert('Please select a valid text file (.txt)');
    }
    event.target.value = '';
  };

  const handleUseCustomText = () => {
    if (customText.trim()) {
      handleTextChange(customText.trim());
      setCustomText('');
    }
  };

  const handleUseSampleText = () => {
    handleTextChange(SAMPLE_TEXT);
    setAnnotations(SAMPLE_ANNOTATIONS);
    setCustomText('');
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
      
      // Check if entity with same ID already exists
      if (!entities.find(e => e.id === entityId)) {
        // Save to backend if connected
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
    // Remove entity
    setEntities(prev => prev.filter(e => e.id !== entityId));
    // Remove annotations using this entity
    setAnnotations(prev => prev.filter(ann => ann.entity !== entityId));
  };

  const resetToDefaultEntities = () => {
    setEntities(MEDICAL_ENTITIES);
    setAnnotations([]);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#333', marginBottom: '10px' }}>
          🏷️ NER Annotation Tool
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Select text and assign entity labels for Named Entity Recognition
        </p>
        
        {/* Backend Status Indicator */}
        <div style={{ 
          margin: '10px 0', 
          padding: '5px 10px', 
          borderRadius: '15px', 
          display: 'inline-block',
          fontSize: '12px',
          backgroundColor: backendStatus === 'connected' ? '#d4edda' : backendStatus === 'disconnected' ? '#f8d7da' : '#fff3cd',
          color: backendStatus === 'connected' ? '#155724' : backendStatus === 'disconnected' ? '#721c24' : '#856404'
        }}>
          Backend: {backendStatus === 'connected' ? '🟢 Connected' : backendStatus === 'disconnected' ? '🔴 Disconnected' : '🟡 Checking...'}
        </div>
        <div style={{ marginTop: '15px' }}>
          <button
            onClick={clearAllAnnotations}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Clear All Annotations
          </button>
          <button
            onClick={handleUseSampleText}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Use Sample Text
          </button>
          <button
            onClick={resetToDefaultEntities}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Reset Entities
          </button>
          <span style={{ color: '#666', fontSize: '14px' }}>
            Total annotations: {annotations.length}
          </span>
        </div>
      </header>

      {/* PDF Upload Section */}
      <PdfUploader onTextExtracted={handlePdfTextExtracted} />

      {/* Text Input Section */}
      <div style={{
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <h3 style={{ marginTop: 0, color: '#495057', marginBottom: '15px' }}>Custom Text Input</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
            Type or paste your text:
          </label>
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Enter your German stroke-related text here..."
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '10px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
          <button
            onClick={handleUseCustomText}
            disabled={!customText.trim()}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: customText.trim() ? '#28a745' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: customText.trim() ? 'pointer' : 'not-allowed'
            }}
          >
            Use This Text
          </button>
        </div>

        <div style={{ borderTop: '1px solid #dee2e6', paddingTop: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
            Or upload a text file (.txt):
          </label>
          <input
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
            style={{
              padding: '5px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              backgroundColor: 'white'
            }}
          />
          <div style={{ marginTop: '5px', fontSize: '12px', color: '#6c757d' }}>
            Only .txt files are supported
          </div>
        </div>
      </div>

      {/* Entity Management Section */}
      <div style={{
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <h3 style={{ marginTop: 0, color: '#495057', marginBottom: '15px' }}>Manage Entity Types</h3>
        
        {/* Current Entities */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ marginBottom: '10px', color: '#495057' }}>Current Entity Types:</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
            {entities.map(entity => (
              <div key={entity.id} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 12px',
                backgroundColor: entity.color,
                color: 'white',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                <span style={{ marginRight: '8px' }}>{entity.label}</span>
                <button
                  onClick={() => removeEntity(entity.id)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    padding: '0 2px'
                  }}
                  title={`Remove ${entity.label}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Entity */}
        <div style={{ borderTop: '1px solid #dee2e6', paddingTop: '15px' }}>
          <h4 style={{ marginBottom: '15px', color: '#495057' }}>Add New Entity Type:</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 120px auto', gap: '10px', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color: '#495057' }}>
                Label
              </label>
              <input
                type="text"
                value={newEntity.label}
                onChange={(e) => setNewEntity(prev => ({ ...prev, label: e.target.value }))}
                placeholder="e.g., MEDICATION"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color: '#495057' }}>
                Description
              </label>
              <input
                type="text"
                value={newEntity.description}
                onChange={(e) => setNewEntity(prev => ({ ...prev, description: e.target.value }))}
                placeholder="e.g., Medication names and dosages"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color: '#495057' }}>
                Color
              </label>
              <input
                type="color"
                value={newEntity.color}
                onChange={(e) => setNewEntity(prev => ({ ...prev, color: e.target.value }))}
                style={{
                  width: '100%',
                  height: '36px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              />
            </div>
            <button
              onClick={addEntity}
              disabled={!newEntity.label.trim() || !newEntity.description.trim()}
              style={{
                padding: '8px 16px',
                backgroundColor: (newEntity.label.trim() && newEntity.description.trim()) ? '#28a745' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: (newEntity.label.trim() && newEntity.description.trim()) ? 'pointer' : 'not-allowed',
                fontSize: '14px'
              }}
            >
              Add Entity
            </button>
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 350px', 
        gap: '20px',
        alignItems: 'start'
      }}>
        {/* Main text area */}
        <div>
          <TextDisplay
            text={text}
            annotations={annotations}
            onSelection={handleTextSelection}
            entities={entities}
          />
        </div>

        {/* Sidebar with controls */}
        <div style={{ display: 'grid', gap: '20px' }}>
          <MedicalAnnotationHelper
            selectedText={selectedText}
            entities={entities}
            onEntitySelect={handleEntitySelect}
            annotations={annotations}
          />
          
          <EntityLabeler
            entities={entities}
            onEntitySelect={handleEntitySelect}
            selectedText={selectedText}
            annotations={annotations}
            onAnnotationRemove={handleAnnotationRemove}
          />

          <ExportPanel
            annotations={annotations}
            text={text}
            entities={entities}
          />
        </div>
      </div>

      {/* Instructions */}
      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <h3 style={{ marginTop: 0, color: '#495057' }}>How to use:</h3>
        <ol style={{ color: '#6c757d', lineHeight: '1.6' }}>
          <li><strong>Select text:</strong> Click and drag to select text in the document</li>
          <li><strong>Assign label:</strong> Click on an entity type button to label the selected text</li>
          <li><strong>Review annotations:</strong> See all annotations in the sidebar list</li>
          <li><strong>Remove annotations:</strong> Click the ✕ button next to any annotation</li>
          <li><strong>Export data:</strong> Use the export buttons to download in various formats</li>
        </ol>
        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#e7f3ff', borderRadius: '4px' }}>
          <strong>💡 Tip:</strong> Try selecting "Dr. Schmidt", "Hans Meier", "TICI-Score", or "TICI 2b" to see stroke annotation!
        </div>
      </div>
    </div>
  );
}

export default App;