import { useState } from 'react';
import styled from 'styled-components';

const HelperContainer = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  margin: 10px 0;
  background: #f8f9fa;
`;

const HelperTitle = styled.h4`
  margin: 0 0 10px 0;
  color: #495057;
  font-size: 14px;
`;

const SuggestionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  max-height: 200px;
  overflow-y: auto;
`;

const SuggestionItem = styled.button`
  text-align: left;
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background: ${({ isTop }) => (isTop ? '#e3f2fd' : 'white')};
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background: #e9ecef;
  }
  
  .entity-type {
    font-weight: bold;
    color: ${props => props.color || '#007bff'};
    margin-right: 8px;
  }
  
  .suggestion-text {
    color: #495057;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 10px;
`;

const MedicalAnnotationHelper = ({ selectedText, entities, onEntitySelect, annotations }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const medicalSuggestions = {
    'PERSON': ['Dr. [Lastname]', 'Patient names', 'Prof. [Name]'],
    'MEDICATION': ['rtPA', 'Aspirin', 'Heparin', 'Alteplase', 'Clopidogrel', 'Atorvastatin'],
    'DOSAGE': ['0.9mg/kg', '100mg', '5ml', '80mg daily', 'Loading dose'],
    'MEDICAL_SCORE': ['TICI 0-3', 'mRS 0-6', 'NIHSS', 'ASPECTS', 'CHA2DS2-VASc'],
    'ANATOMY': ['MCA', 'ACA', 'PCA', 'ICA', 'Basilaris', 'M1 segment', 'Carotis'],
    'PROCEDURE': ['Thrombektomie', 'CT', 'MRI', 'DSA', 'Angiographie', 'Stent-Retriever'],
    'TIME': ['Onset time', 'Door-to-needle', 'Symptombeginn', 'h:mm format'],
    'MEASUREMENT': ['mmHg', '°C', 'ml/min', 'Hounsfield units', 'Vital signs'],
    'SYMPTOM': ['Hemiparese', 'Aphasie', 'Neglect', 'Ataxie', 'Dysarthrie'],
    'DIAGNOSIS': ['Schlaganfall', 'Stenose', 'Verschluss', 'Infarkt', 'Blutung']
  };

  const getSuggestions = () => {
    if (!selectedText?.text || selectedText.text.trim().length < 2) return [];

    const suggestions = [];
    const selText = selectedText.text.toLowerCase();

    entities.forEach(entity => {
      const list = medicalSuggestions[entity.label] || [];
      list.forEach(suggestion => {
        const normalized = suggestion.replace(/\[.*?\]/g, '').toLowerCase();
        if (
          searchTerm === '' ||
          normalized.includes(searchTerm.toLowerCase()) ||
          selText.includes(normalized)
        ) {
          suggestions.push({
            entityId: entity.id,
            entityLabel: entity.label,
            entityColor: entity.color,
            suggestion,
            confidence: calculateConfidence(selText, normalized)
          });
        }
      });
    });

    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 10);
  };

  const calculateConfidence = (text, suggestion) => {
    if (!text || !suggestion) return 0;
    if (text === suggestion) return 100;
    if (text.includes(suggestion) || suggestion.includes(text)) return 80;
    if (suggestion.includes('[') || suggestion.includes('format')) return 60;

    const overlap = [...text].filter(char => suggestion.includes(char)).length;
    return Math.min(overlap * 10, 50);
  };

  const getAnnotationStats = () => {
    const stats = {};
    annotations.forEach(ann => {
      const entity = entities.find(e => e.id === ann.entity);
      if (entity) {
        stats[entity.label] = (stats[entity.label] || 0) + 1;
      }
    });
    return stats;
  };

  const suggestions = getSuggestions();
  const stats = getAnnotationStats();

  if (!selectedText) {
    return (
      <HelperContainer>
        <HelperTitle>📊 Annotation Statistics</HelperTitle>
        <div style={{ fontSize: '12px', color: '#6c757d' }}>
          {Object.entries(stats).length > 0 ? (
            Object.entries(stats).map(([label, count]) => (
              <div key={label}>
                <strong>{label}:</strong> {count} annotation{count !== 1 ? 's' : ''}
              </div>
            ))
          ) : (
            <div>No annotations yet. Select text to start annotating.</div>
          )}
        </div>

        <div style={{ marginTop: '15px', fontSize: '12px', color: '#495057' }}>
          <strong>💡 Quick Tips:</strong>
          <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
            <li>Select medical terms, names, or scores</li>
            <li>Use consistent labeling for similar entities</li>
            <li>Include context (e.g., "TICI 2b" not just "2b")</li>
          </ul>
        </div>
      </HelperContainer>
    );
  }

  return (
    <HelperContainer>
      <HelperTitle>
        🎯 Suggestions for: "{selectedText.text}"
      </HelperTitle>

      <SearchInput
        type="text"
        placeholder="Filter suggestions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <SuggestionList>
        {suggestions.length > 0 ? (
          suggestions.map((sug, index) => (
            <SuggestionItem
              key={index}
              color={sug.entityColor}
              isTop={index === 0}
              onClick={() => onEntitySelect(sug.entityId)}
            >
              <span className="entity-type">{sug.entityLabel}</span>
              <span className="suggestion-text">
                {sug.suggestion} ({sug.confidence}% match)
              </span>
            </SuggestionItem>
          ))
        ) : (
          <div style={{ fontSize: '12px', color: '#6c757d', padding: '10px' }}>
            No suggestions found. Try selecting a medical term or adjust the search filter.
          </div>
        )}
      </SuggestionList>

      <div style={{ marginTop: '10px', fontSize: '11px', color: '#6c757d' }}>
        💡 Click a suggestion to apply the entity label, or use the entity buttons above.
      </div>
    </HelperContainer>
  );
};

export default MedicalAnnotationHelper;
