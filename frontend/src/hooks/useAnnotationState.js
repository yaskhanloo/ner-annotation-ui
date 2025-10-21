
import { useState, useEffect } from 'react';
import { MEDICAL_ENTITIES } from '../data/medicalEntities';
import { apiService } from '../services/api';

const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

export const useAnnotationState = () => {
  const [text, setText] = useState('');
  const [entities, setEntities] = useState(MEDICAL_ENTITIES);
  const [annotations, setAnnotations] = useState([]);
  const [selectedText, setSelectedText] = useState(null);
  const [customText, setCustomText] = useState('');
  const [newEntity, setNewEntity] = useState({ label: '', description: '', color: '#FF6B6B' });
  const [currentDocument, setCurrentDocument] = useState(null);
  const [originalFilename, setOriginalFilename] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    checkBackendConnection();
  }, []);

  useEffect(() => {
    if (currentDocument && backendStatus === 'connected') {
      saveAnnotationsToBackend();
    }
  }, [annotations, currentDocument, backendStatus]);

  const checkBackendConnection = async () => {
    try {
      await apiService.healthCheck();
      setBackendStatus('connected');
    } catch (e) {
      setBackendStatus('disconnected');
      // Only log in development or if debug is enabled
      if (import.meta.env.DEV) {
        console.warn('Backend connection failed:', e.message);
      }
    }
  };

  const saveAnnotationsToBackend = async () => {
    try {
      await apiService.saveAnnotations(currentDocument, annotations);
    } catch (e) {
      if (import.meta.env.DEV) {
        console.warn('Failed to save annotations:', e.message);
      }
    }
  };

  const handlePdfTextExtracted = (extractedText, filename) => {
    setText(extractedText);
    setAnnotations([]);
    setSelectedText(null);
    setCurrentDocument(filename.replace('.pdf', ''));
    setOriginalFilename(filename.replace('.pdf', ''));
    setCustomText('');
  };

  const handleTextSelection = (selection) => setSelectedText(selection);

  const handleEntitySelect = (entityId) => {
    if (!selectedText) return;
    
    // Check for overlapping annotations (but allow separate instances of the same text)
    const hasOverlap = annotations.some(existing => {
      // Check if there's actual character overlap
      const overlaps = (selectedText.start < existing.end && selectedText.end > existing.start);
      
      // If there's no overlap, it's fine
      if (!overlaps) return false;
      
      // If it's the exact same position and text, it's a duplicate (which we'll allow)
      const isExactDuplicate = (
        selectedText.start === existing.start && 
        selectedText.end === existing.end &&
        selectedText.text === existing.text
      );
      
      // Allow exact duplicates but prevent partial overlaps
      return !isExactDuplicate;
    });
    
    if (hasOverlap) {
      alert('This text overlaps with an existing annotation. Please select different text.');
      setSelectedText(null);
      window.getSelection()?.removeAllRanges();
      return;
    }
    
    const newAnnotation = {
      id: generateId(),
      start: selectedText.start,
      end: selectedText.end,
      text: selectedText.text,
      entity: entityId,
    };
    
    setAnnotations((prev) => [...prev, newAnnotation]);
    setSelectedText(null);
    
    // Clear browser selection with a small delay to ensure DOM updates
    setTimeout(() => {
      if (window.getSelection) {
        window.getSelection().removeAllRanges();
      }
    }, 10);
  };

  const handleAnnotationRemove = (annotationId) =>
    setAnnotations((prev) => prev.filter((ann) => ann.id !== annotationId));

  const handleTextChange = (newText) => {
    if (!newText?.trim()) return;
    setText(newText);
    setAnnotations([]);
    setSelectedText(null);
    setCurrentDocument(`manual_text_${Date.now()}`);
    setOriginalFilename(`manual_text_${Date.now()}`);
  };

  const addEntity = async () => {
    if (!newEntity.label.trim() || !newEntity.description.trim()) return;
    const entityId = newEntity.label.toLowerCase().replace(/\s+/g, '_');
    const entity = {
      id: entityId,
      label: newEntity.label.toUpperCase(),
      color: newEntity.color,
      description: newEntity.description,
    };
    if (entities.find((e) => e.id === entityId)) {
      alert('An entity with this label already exists!');
      return;
    }
    if (backendStatus === 'connected') {
      try {
        await apiService.createEntity(entity);
      } catch (e) {
        if (import.meta.env.DEV) {
          console.warn('Failed to save entity:', e.message);
        }
      }
    }
    setEntities((prev) => [...prev, entity]);
    setNewEntity({ label: '', description: '', color: '#FF6B6B' });
  };

  const removeEntity = (entityId) => {
    setEntities((prev) => prev.filter((e) => e.id !== entityId));
    setAnnotations((prev) => prev.filter((ann) => ann.entity !== entityId));
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
    setOriginalFilename('sample_document');
  };

  return {
    text,
    setText,
    entities,
    annotations,
    setAnnotations,
    selectedText,
    setSelectedText: handleTextSelection,
    onEntitySelect: handleEntitySelect,
    onAnnotationRemove: handleAnnotationRemove,
    onPdfTextExtracted: handlePdfTextExtracted,
    customText,
    setCustomText,
    handleTextChange,
    backendStatus,
    originalFilename,
    newEntity,
    setNewEntity,
    addEntity,
    removeEntity,
    resetToDefaultEntities,
    clearAllAnnotations,
    handleUseSampleText,
  };
};
