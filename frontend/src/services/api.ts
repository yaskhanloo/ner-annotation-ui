import axios from 'axios';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PdfUploadResponse {
  documentId: string;
  text: string;
  fileName: string;
}

export interface Annotation {
  id: string;
  start: number;
  end: number;
  text: string;
  entity: string;
}

export interface Entity {
  id: string;
  label: string;
  color: string;
  description: string;
}

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Health check
  healthCheck: async (): Promise<{ status: string }> => {
    const response = await api.get('/health');
    return response.data;
  },

  // PDF upload and parsing
  uploadPdf: async (file: File): Promise<PdfUploadResponse> => {
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
  getAnnotations: async (documentId: string): Promise<Annotation[]> => {
    const response = await api.get(`/annotations/${documentId}`);
    return response.data;
  },

  saveAnnotations: async (documentId: string, annotations: Annotation[]): Promise<ApiResponse<void>> => {
    const response = await api.post(`/annotations/${documentId}`, {
      annotations,
    });
    return response.data;
  },

  // Entities
  getEntities: async (): Promise<Entity[]> => {
    const response = await api.get('/entities');
    return response.data;
  },

  createEntity: async (entity: Omit<Entity, 'id'>): Promise<Entity> => {
    const response = await api.post('/entities', entity);
    return response.data;
  },

  // Export
  exportAnnotations: async (documentId: string, format: string): Promise<string | Blob> => {
    const response = await api.get(`/export/${documentId}/${format}`);
    return response.data;
  },
};

export default apiService;