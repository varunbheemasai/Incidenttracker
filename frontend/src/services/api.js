import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const incidentsAPI = {
  create: (incidentData) => api.post('/incidents', incidentData),
  getAll: (params, config = {}) => api.get('/incidents', { params, ...config }),
  getById: (id) => api.get(`/incidents/${id}`),
  update: (id, incidentData) => api.patch(`/incidents/${id}`, incidentData),
  delete: (id) => api.delete(`/incidents/${id}`),
};

export const servicesAPI = {
  getAll: () => api.get('/services'),
};

export const ownersAPI = {
  getAll: () => api.get('/owners'),
};

export default api;
