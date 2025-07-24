// src/components/ExportPanel.jsx
import React from 'react';

const ExportPanel = ({ annotations, text, entities }) => {
  const exportAsJSON = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const data = {
      document_info: {
        created_at: new Date().toISOString(),
        total_annotations: annotations.length,
        annotation_tool: 'Medical NER Annotation UI'
      },
      text,
      annotations: annotations.map(ann => {
        const entity = entities.find(e => e.id === ann.entity);
        return {
          id: ann.id,
          start: ann.start,
          end: ann.end,
          text: ann.text,
          label: ann.entity,
          entity_info: {
            label: entity?.label,
            description: entity?.description,
            color: entity?.color
          }
        };
      })
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical_ner_annotations_${timestamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsSpacy = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    // spaCy training format
    const spacyFormat = {
      version: 4,
      meta: {
        lang: "de",  // German medical documents
        name: "medical_ner_model",
        description: "Medical NER annotations for German stroke documents"
      },
      data: [{
        text,
        entities: annotations.map(ann => {
          const entity = entities.find(e => e.id === ann.entity);
          return {
            start: ann.start,
            end: ann.end,
            label: entity?.label || ann.entity
          };
        })
      }]
    };
    
    const blob = new Blob([JSON.stringify(spacyFormat, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spacy_medical_ner_${timestamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportForHuggingFace = () => {\n    const timestamp = new Date().toISOString().split('T')[0];\n    // Hugging Face datasets format for token classification\n    const tokens = text.split(/\\s+/);\n    let tokenIndex = 0;\n    let charIndex = 0;\n    const tokenData = [];\n    \n    // Map character positions to token positions\n    tokens.forEach((token, i) => {\n      const start = text.indexOf(token, charIndex);\n      const end = start + token.length;\n      \n      // Find if this token is part of any annotation\n      let label = 'O';\n      let isFirst = true;\n      \n      annotations.forEach(annotation => {\n        if (start >= annotation.start && end <= annotation.end) {\n          const entity = entities.find(e => e.id === annotation.entity);\n          const entityLabel = entity?.label || annotation.entity;\n          \n          // Check if this is the first token of the entity\n          const prevTokensInEntity = annotations.some(ann => {\n            const prevStart = text.lastIndexOf(' ', annotation.start - 1);\n            return prevStart >= 0 && start > prevStart && ann.id === annotation.id;\n          });\n          \n          label = isFirst && !prevTokensInEntity ? `B-${entityLabel}` : `I-${entityLabel}`;\n          isFirst = false;\n        }\n      });\n      \n      tokenData.push({\n        token: token,\n        label: label\n      });\n      \n      charIndex = end;\n    });\n    \n    const hfFormat = {\n      data: [{\n        tokens: tokenData.map(t => t.token),\n        ner_tags: tokenData.map(t => t.label),\n        id: 0\n      }],\n      features: {\n        tokens: { dtype: \"string\", _type: \"Sequence\" },\n        ner_tags: { dtype: \"string\", _type: \"Sequence\" }\n      },\n      metadata: {\n        created_at: new Date().toISOString(),\n        language: \"de\",\n        domain: \"medical\",\n        annotation_tool: \"Medical NER Annotation UI\"\n      }\n    };\n    \n    const blob = new Blob([JSON.stringify(hfFormat, null, 2)], { type: 'application/json' });\n    const url = URL.createObjectURL(blob);\n    const a = document.createElement('a');\n    a.href = url;\n    a.download = `huggingface_medical_ner_${timestamp}.json`;\n    a.click();\n    URL.revokeObjectURL(url);\n  };\n\n  const exportAsCoNLL = () => {
    // Simple tokenization (split by whitespace)
    const tokens = text.split(/\s+/);
    let tokenIndex = 0;
    let charIndex = 0;
    const tokenPositions = [];
    
    // Map character positions to token positions
    tokens.forEach((token, i) => {
      const start = text.indexOf(token, charIndex);
      const end = start + token.length;
      tokenPositions.push({ token, start, end, index: i });
      charIndex = end;
    });

    // Create BIO tags
    const bioTags = new Array(tokens.length).fill('O');
    
    annotations.forEach(annotation => {
      const affectedTokens = tokenPositions.filter(tp => 
        tp.start >= annotation.start && tp.end <= annotation.end
      );
      
      affectedTokens.forEach((tp, i) => {
        if (i === 0) {
          bioTags[tp.index] = `B-${annotation.entity}`;
        } else {
          bioTags[tp.index] = `I-${annotation.entity}`;
        }
      });
    });

    // Create CoNLL format
    const conllLines = tokens.map((token, i) => `${token}\t${bioTags[i]}`);
    const conllText = conllLines.join('\n');
    
    const blob = new Blob([conllText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'annotations.conll';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStats = () => {
    const entityCounts = {};
    annotations.forEach(ann => {
      entityCounts[ann.entity] = (entityCounts[ann.entity] || 0) + 1;
    });
    return entityCounts;
  };

  const stats = getStats();

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
      <h3>Export & Statistics</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <h4>Statistics</h4>
        <div style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
          <div><strong>Total annotations:</strong> {annotations.length}</div>
          <div><strong>Text length:</strong> {text.length} characters</div>
          <div style={{ marginTop: '10px' }}>
            <strong>By entity type:</strong>
            {Object.entries(stats).map(([entityId, count]) => {
              const entity = entities.find(e => e.id === entityId);
              return (
                <div key={entityId} style={{ marginLeft: '10px' }}>
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
                  {count} annotation{count !== 1 ? 's' : ''}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '10px' }}>
        <button
          onClick={exportAsJSON}
          disabled={annotations.length === 0}
          style={{
            padding: '12px',
            backgroundColor: annotations.length > 0 ? '#4CAF50' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: annotations.length > 0 ? 'pointer' : 'not-allowed'
          }}
        >
          📄 Export as Enhanced JSON
        </button>
        
        <button
          onClick={exportAsSpacy}
          disabled={annotations.length === 0}
          style={{
            padding: '12px',
            backgroundColor: annotations.length > 0 ? '#2196F3' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: annotations.length > 0 ? 'pointer' : 'not-allowed'
          }}
        >
          🐍 Export for spaCy Training
        </button>
        
        <button
          onClick={exportAsCoNLL}
          disabled={annotations.length === 0}
          style={{
            padding: '12px',
            backgroundColor: annotations.length > 0 ? '#FF9800' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: annotations.length > 0 ? 'pointer' : 'not-allowed'
          }}
        >
          📊 Export as CoNLL-2003 Format
        </button>
        
        <button
          onClick={exportForHuggingFace}
          disabled={annotations.length === 0}
          style={{
            padding: '12px',
            backgroundColor: annotations.length > 0 ? '#FFD700' : '#ccc',
            color: 'black',
            border: 'none',
            borderRadius: '6px',
            cursor: annotations.length > 0 ? 'pointer' : 'not-allowed'
          }}
        >
          🤗 Export for Hugging Face
        </button>
      </div>
      
      {annotations.length === 0 && (
        <p style={{ 
          marginTop: '10px', 
          color: '#666', 
          fontStyle: 'italic',
          fontSize: '14px'
        }}>
          Add some annotations to enable export options
        </p>
      )}
    </div>
  );
};

export default ExportPanel;