import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Health check
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  },

  // PDF upload and parsing
  uploadPdf: async (file) => {
    const formData = new FormData();
    formData.append('pdf', file);
    
    const response = await api.post('/upload-pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Annotations
  getAnnotations: async (documentId) => {
    const response = await api.get(`/annotations/${documentId}`);
    return response.data;
  },

  saveAnnotations: async (documentId, annotations) => {
    const response = await api.post(`/annotations/${documentId}`, {
      annotations,
    });
    return response.data;
  },

  // Entities
  getEntities: async () => {
    const response = await api.get('/entities');
    return response.data;
  },

  createEntity: async (entity) => {
    const response = await api.post('/entities', entity);
    return response.data;
  },

  // Export
  exportAnnotations: async (documentId, format) => {
    const response = await api.get(`/export/${documentId}/${format}`);
    return response.data;
  },
};

export default apiService;