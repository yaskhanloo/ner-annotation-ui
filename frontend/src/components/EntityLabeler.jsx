// src/components/EntityLabeler.jsx
import React from 'react';

const EntityLabeler = ({ entities, onEntitySelect, selectedText, annotations, onAnnotationRemove }) => {
  const handleEntityClick = (entityId) => {
    if (selectedText) {
      onEntitySelect(entityId);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
      <h3>Entity Types</h3>
      
      {selectedText ? (
        <div style={{ 
          marginBottom: '15px', 
          padding: '10px', 
          backgroundColor: '#e3f2fd',
          borderRadius: '4px'
        }}>
          <strong>Selected text:</strong> "{selectedText.text}"<br/>
          <small>Choose an entity type below:</small>
        </div>
      ) : (
        <div style={{ 
          marginBottom: '15px', 
          padding: '10px', 
          backgroundColor: '#f5f5f5',
          borderRadius: '4px'
        }}>
          Select text in the document to assign entity labels
        </div>
      )}

      <div style={{ display: 'grid', gap: '10px' }}>
        {entities.map((entity, index) => (
          <button
            key={entity.id}
            onClick={() => handleEntityClick(entity.id)}
            disabled={!selectedText}
            style={{
              padding: '12px',
              backgroundColor: selectedText ? entity.color : '#f0f0f0',
              color: selectedText ? '#fff' : '#999',
              border: 'none',
              borderRadius: '6px',
              cursor: selectedText ? 'pointer' : 'not-allowed',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>{entity.label}</span>
            <span style={{ fontSize: '12px', opacity: 0.8 }}>
              {index + 1}
            </span>
          </button>
        ))}
      </div>

      {annotations && annotations.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h4>Current Annotations ({annotations.length})</h4>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {annotations.map((annotation) => {
              const entity = entities.find(e => e.id === annotation.entity);
              return (
                <div
                  key={annotation.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px',
                    margin: '4px 0',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  <div>
                    <span 
                      style={{ 
                        backgroundColor: entity?.color, 
                        color: 'white', 
                        padding: '2px 6px', 
                        borderRadius: '3px',
                        fontSize: '12px',
                        marginRight: '8px'
                      }}
                    >
                      {entity?.label}
                    </span>
                    <span>"{annotation.text}"</span>
                  </div>
                  <button
                    onClick={() => onAnnotationRemove(annotation.id)}
                    style={{
                      backgroundColor: '#ff4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default EntityLabeler;