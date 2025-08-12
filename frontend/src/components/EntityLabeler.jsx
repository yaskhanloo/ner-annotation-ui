import React, { useMemo, useCallback } from 'react';
import {
  Box, Typography, Paper, Button, Chip, IconButton,
  Tooltip, Divider, Badge, Alert
} from '@mui/material';
import { Delete, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

const EntityLabeler = ({ entities, onEntitySelect, selectedText, annotations, onAnnotationRemove }) => {
  const [showAllAnnotations, setShowAllAnnotations] = React.useState(false);

  const handleEntityClick = useCallback((entityId) => {
    if (selectedText) {
      onEntitySelect(entityId);
    }
  }, [selectedText, onEntitySelect]);

  const handleKeyPress = useCallback((event, entityId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleEntityClick(entityId);
    }
  }, [handleEntityClick]);

  const annotationsByEntity = useMemo(() => {
    return annotations.reduce((acc, annotation) => {
      if (!acc[annotation.entity]) {
        acc[annotation.entity] = [];
      }
      acc[annotation.entity].push(annotation);
      return acc;
    }, {});
  }, [annotations]);

  const visibleAnnotations = useMemo(() => {
    return showAllAnnotations ? annotations : annotations.slice(0, 5);
  }, [annotations, showAllAnnotations]);

  return (
    <Paper sx={{ p: 2, height: 'fit-content' }}>
      <Typography variant="h6" gutterBottom>
        Entity Types
        <Badge badgeContent={annotations.length} color="primary" sx={{ ml: 2 }} />
      </Typography>
      
      {selectedText ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Selected:</strong> "{selectedText.text}"
          </Typography>
          <Typography variant="caption" display="block">
            Choose an entity type below or press 1-{Math.min(entities.length, 9)}
          </Typography>
        </Alert>
      ) : (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Select text in the document to assign entity labels
          </Typography>
        </Alert>
      )}

      <Box sx={{ display: 'grid', gap: 1, mb: 2 }}>
        {entities.map((entity, index) => {
          const entityAnnotations = annotationsByEntity[entity.id] || [];
          const shortcutKey = index < 9 ? index + 1 : null;
          
          return (
            <Button
              key={entity.id}
              onClick={() => handleEntityClick(entity.id)}
              onKeyDown={(e) => handleKeyPress(e, entity.id)}
              disabled={!selectedText}
              variant={selectedText ? "contained" : "outlined"}
              sx={{
                backgroundColor: selectedText ? entity.color : 'transparent',
                borderColor: entity.color,
                color: selectedText ? '#fff' : entity.color,
                '&:hover': {
                  backgroundColor: selectedText ? entity.color : `${entity.color}20`,
                },
                '&:disabled': {
                  backgroundColor: '#f5f5f5',
                  color: '#999',
                  borderColor: '#ddd'
                },
                justifyContent: 'space-between',
                textTransform: 'none',
                fontWeight: 'bold'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>{entity.label}</span>
                {entityAnnotations.length > 0 && (
                  <Chip 
                    size="small" 
                    label={entityAnnotations.length}
                    sx={{ 
                      backgroundColor: 'rgba(255,255,255,0.3)',
                      color: selectedText ? '#fff' : entity.color,
                      fontSize: '10px',
                      height: '18px'
                    }}
                  />
                )}
              </Box>
              {shortcutKey && (
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {shortcutKey}
                </Typography>
              )}
            </Button>
          );
        })}
      </Box>

      {annotations.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2">
              Annotations ({annotations.length})
            </Typography>
            {annotations.length > 5 && (
              <Button
                size="small"
                onClick={() => setShowAllAnnotations(!showAllAnnotations)}
                endIcon={showAllAnnotations ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              >
                {showAllAnnotations ? 'Show Less' : 'Show All'}
              </Button>
            )}
          </Box>
          
          <Box sx={{ maxHeight: showAllAnnotations ? 300 : 200, overflowY: 'auto' }}>
            {visibleAnnotations.map((annotation) => {
              const entity = entities.find(e => e.id === annotation.entity);
              return (
                <Box
                  key={annotation.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 1,
                    mb: 0.5,
                    backgroundColor: 'grey.50',
                    borderRadius: 1,
                    border: `1px solid ${entity?.color}20`
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Chip
                      label={entity?.label}
                      size="small"
                      sx={{
                        backgroundColor: entity?.color,
                        color: 'white',
                        fontSize: '10px',
                        height: '20px',
                        mr: 1
                      }}
                    />
                    <Typography
                      variant="body2"
                      component="span"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      "{annotation.text}"
                    </Typography>
                  </Box>
                  <Tooltip title="Remove annotation">
                    <IconButton
                      size="small"
                      onClick={() => onAnnotationRemove(annotation.id)}
                      sx={{ color: 'error.main' }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              );
            })}
          </Box>
        </>
      )}
    </Paper>
  );
};

export default React.memo(EntityLabeler);