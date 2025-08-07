// src/components/TextDisplay.jsx
import React, { useState, useRef } from 'react';

const TextDisplay = ({ text, annotations, onSelection, entities }) => {
  const [selection, setSelection] = useState(null);
  const textRef = useRef(null);

  const handleMouseUp = () => {
    const windowSelection = window.getSelection();
    if (windowSelection && windowSelection.toString().trim()) {
      const selectedText = windowSelection.toString();
      const range = windowSelection.getRangeAt(0);
      
      // Calculate character positions relative to the full text
      const start = range.startOffset;
      const end = range.endOffset;
      
      setSelection({
        start,
        end,
        text: selectedText
      });
      
      onSelection({
        start,
        end,
        text: selectedText
      });
    }
  };

  const renderHighlightedText = () => {
    if (!annotations || annotations.length === 0) {
      return text;
    }

    // Sort annotations by start position
    const sortedAnnotations = [...annotations].sort((a, b) => a.start - b.start);
    const spans = [];
    let currentIndex = 0;

    sortedAnnotations.forEach((annotation, index) => {
      // Add text before annotation
      if (currentIndex < annotation.start) {
        spans.push(
          <span key={`text-${index}`}>
            {text.substring(currentIndex, annotation.start).split('\\n').map((item, key) => <React.Fragment key={key}>{item}<br /></React.Fragment>)}
          </span>
        );
      }

      // Find entity configuration
      const entity = entities.find(e => e.id === annotation.entity);

      // Add highlighted annotation
      spans.push(
        <span
          key={annotation.id}
          style={{
            backgroundColor: entity?.color || '#ffeb3b',
            padding: '2px 4px',
            margin: '0 1px',
            borderRadius: '3px',
            cursor: 'pointer',
            position: 'relative'
          }}
          title={`${entity?.label}: ${annotation.text}`}
        >
          {annotation.text}
        </span>
      );

      currentIndex = annotation.end;
    });

    // Add remaining text
    if (currentIndex < text.length) {
      spans.push(
        <span key="text-end">
          {text.substring(currentIndex).split('\\n').map((item, key) => <React.Fragment key={key}>{item}<br /></React.Fragment>)}
        </span>
      );
    }

    return spans;
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
      <h3>Text to Annotate</h3>
      <div
        ref={textRef}
        onMouseUp={handleMouseUp}
        style={{
          lineHeight: '1.8',
          fontSize: '16px',
          userSelect: 'text',
          fontFamily: 'Arial, sans-serif'
        }}
      >
        {renderHighlightedText()}
      </div>
      {selection && (
        <div style={{ 
          marginTop: '10px', 
          padding: '10px', 
          backgroundColor: '#f0f0f0',
          borderRadius: '4px'
        }}>
          <strong>Selected:</strong> "{selection.text}" (positions {selection.start}-{selection.end})
        </div>
      )}
    </div>
  );
};

export default TextDisplay;