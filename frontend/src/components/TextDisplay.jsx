import React, { useState, useCallback, useEffect } from 'react';

const TextDisplay = ({ text, annotations, onSelection, entities }) => {
  const [selection, setSelection] = useState(null);

  // Clear selection when annotations change
  useEffect(() => {
    setSelection(null);
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    }
  }, [annotations]);

  const handleMouseUp = useCallback((event) => {
    const windowSelection = window.getSelection();
    if (!windowSelection || windowSelection.rangeCount === 0) {
      setSelection(null);
      onSelection(null);
      return;
    }

    const selectedText = windowSelection.toString().trim();
    if (!selectedText) {
      setSelection(null);
      onSelection(null);
      return;
    }

    // Get the selection range
    const range = windowSelection.getRangeAt(0);
    const container = event.currentTarget;

    // Calculate position by walking through the text content
    let startPos = 0;
    let endPos = 0;
    let found = false;

    // Create a tree walker to go through all text nodes
    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let currentPos = 0;
    let node;

    while (node = walker.nextNode()) {
      const nodeText = node.textContent;
      const nodeLength = nodeText.length;

      // Check if this node contains the start of our selection
      if (node === range.startContainer) {
        startPos = currentPos + range.startOffset;
        found = true;
      }

      // Check if this node contains the end of our selection
      if (node === range.endContainer) {
        endPos = currentPos + range.endOffset;
        break;
      }

      currentPos += nodeLength;
    }

    if (found && startPos < endPos) {
      // Verify the selection by checking against original text
      const extractedText = text.substring(startPos, endPos);

      if (extractedText === selectedText) {
        const selectionData = {
          start: startPos,
          end: endPos,
          text: selectedText
        };

        setSelection(selectionData);
        onSelection(selectionData);
      } else {
        // The extracted text doesn't match - this can happen with complex DOM structures
        console.log('Position mismatch:', {
          calculated: { startPos, endPos },
          extractedText,
          selectedText
        });
        // Fallback: search for the text in the original, but try to find the right occurrence
        // by looking at the approximate position where the user clicked
        const allOccurrences = [];
        let searchStart = 0;

        // Find all occurrences of the selected text
        while (true) {
          const foundIndex = text.indexOf(selectedText, searchStart);
          if (foundIndex === -1) break;

          allOccurrences.push({
            start: foundIndex,
            end: foundIndex + selectedText.length
          });

          searchStart = foundIndex + 1;
        }

        if (allOccurrences.length > 0) {
          // If we have multiple occurrences, try to pick the best one
          // based on the approximate position we calculated
          let bestMatch = allOccurrences[0];

          if (allOccurrences.length > 1 && startPos > 0) {
            // Find the occurrence closest to our calculated position
            let minDistance = Math.abs(allOccurrences[0].start - startPos);

            for (let i = 1; i < allOccurrences.length; i++) {
              const distance = Math.abs(allOccurrences[i].start - startPos);
              if (distance < minDistance) {
                minDistance = distance;
                bestMatch = allOccurrences[i];
              }
            }
          }

          const selectionData = {
            start: bestMatch.start,
            end: bestMatch.end,
            text: selectedText
          };

          console.log('Using fallback selection:', {
            selectedText,
            allOccurrences,
            bestMatch,
            calculatedPos: startPos
          });

          setSelection(selectionData);
          onSelection(selectionData);
        } else {
          setSelection(null);
          onSelection(null);
        }
      }
    } else {
      setSelection(null);
      onSelection(null);
    }
  }, [text, onSelection]);

  const renderHighlightedText = useCallback(() => {
    if (!text) return '';
    if (!annotations || annotations.length === 0) {
      return text.split('\n').map((line, index) => (
        <React.Fragment key={index}>
          {line}
          {index < text.split('\n').length - 1 && <br />}
        </React.Fragment>
      ));
    }

    // Sort annotations by start position to avoid overlaps
    const sortedAnnotations = [...annotations]
      .sort((a, b) => a.start - b.start)
      .filter((annotation, index, arr) => {
        // Remove overlapping annotations (keep the first one)
        if (index === 0) return true;
        const prev = arr[index - 1];
        return annotation.start >= prev.end;
      });

    const spans = [];
    let currentIndex = 0;

    sortedAnnotations.forEach((annotation, index) => {
      // Add text before annotation
      if (currentIndex < annotation.start) {
        const beforeText = text.substring(currentIndex, annotation.start);
        spans.push(
          <span key={`text-before-${index}`}>
            {beforeText.split('\n').map((line, lineIndex) => (
              <React.Fragment key={lineIndex}>
                {line}
                {lineIndex < beforeText.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </span>
        );
      }

      // Find entity configuration
      const entity = entities.find(e => e.id === annotation.entity);

      // Add highlighted annotation
      spans.push(
        <span
          key={`annotation-${annotation.id}`}
          style={{
            backgroundColor: entity?.color || '#ffeb3b',
            color: '#000',
            padding: '2px 4px',
            margin: '0 1px',
            borderRadius: '3px',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'inline',
            whiteSpace: 'pre-wrap'
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
      const remainingText = text.substring(currentIndex);
      spans.push(
        <span key="text-end">
          {remainingText.split('\n').map((line, lineIndex) => (
            <React.Fragment key={lineIndex}>
              {line}
              {lineIndex < remainingText.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </span>
      );
    }

    return spans;
  }, [text, annotations, entities]);

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
      <h3>Text to Annotate</h3>
      <div
        onMouseUp={handleMouseUp}
        style={{
          lineHeight: '1.8',
          fontSize: '16px',
          userSelect: 'text',
          fontFamily: 'Arial, sans-serif',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          minHeight: '200px',
          maxHeight: '500px',
          overflowY: 'auto',
          border: '1px solid #eee',
          padding: '15px',
          borderRadius: '4px',
          backgroundColor: '#fafafa'
        }}
      >
        {renderHighlightedText()}
      </div>
      {selection && (
        <div style={{
          marginTop: '10px',
          padding: '10px',
          backgroundColor: '#e3f2fd',
          borderRadius: '4px',
          border: '1px solid #2196f3'
        }}>
          <strong>Selected:</strong> "{selection.text}"
          <small style={{ color: '#666', marginLeft: '10px' }}>
            (positions {selection.start}-{selection.end})
          </small>
        </div>
      )}
    </div>
  );
};

export default TextDisplay;