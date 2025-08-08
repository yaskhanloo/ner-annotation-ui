import { useState } from 'react';
import styled from 'styled-components';
import { apiService } from '../services/api';

const UploaderContainer = styled.div`
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  margin: 1rem 0;
  background: #f9f9f9;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: #007bff;
  }

  &.dragover {
    border-color: #007bff;
    background: #e3f2fd;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin: 0.5rem;

  &:hover {
    background: #0056b3;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const StatusMessage = styled.div`
  margin: 1rem 0;
  padding: 0.75rem;
  border-radius: 4px;
  
  &.success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
  
  &.error {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
  
  &.info {
    background: #d1ecf1;
    color: #0c5460;
    border: 1px solid #bee5eb;
  }
`;

const PdfUploader = ({ onTextExtracted }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = async (file) => {
    if (!file || file.type !== 'application/pdf') {
      setStatus({ type: 'error', message: 'Please select a valid PDF file.' });
      return;
    }

    setIsUploading(true);
    setStatus({ type: 'info', message: 'Uploading and parsing PDF...' });

    try {
      const result = await apiService.uploadPdf(file);
      
      if (result.text) {
        setStatus({ 
          type: 'success', 
          message: `Successfully extracted text from ${result.filename}` 
        });
        onTextExtracted(result.text, result.filename);
      } else {
        setStatus({ 
          type: 'error', 
          message: 'No text could be extracted from the PDF.' 
        });
      }
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: `Failed to process PDF: ${error.response?.data?.error || error.message}` 
      });  
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  return (
    <div>
      <UploaderContainer
        className={dragOver ? 'dragover' : ''}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <h3>Upload PDF Document</h3>
        <p>Drag and drop a PDF file here, or click to select</p>
        
        <FileInput
          type="file"
          id="pdf-upload"
          accept=".pdf"
          onChange={handleFileSelect}
          disabled={isUploading}
        />
        
        <UploadButton
          onClick={() => document.getElementById('pdf-upload').click()}
          disabled={isUploading}
        >
          {isUploading ? 'Processing...' : 'Select PDF File'}
        </UploadButton>
      </UploaderContainer>

      {status && (
        <StatusMessage className={status.type}>
          {status.message}
        </StatusMessage>
      )}
    </div>
  );
};

export default PdfUploader;