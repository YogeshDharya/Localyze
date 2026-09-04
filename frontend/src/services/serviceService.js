import api from './api';

const serviceService = {
  getAll: (params = {}) => api.get('/services', { params }),

  getNearby: (params = {}) => api.get('/services/nearby', { params }),

  getById: (id) => api.get(`/services/${id}`),

  create: (data) => api.post('/services', data),

  update: (id, data) => api.put(`/services/${id}`, data),

  delete: (id) => api.delete(`/services/${id}`),

  getMyServices: (params = {}) => api.get('/services/my', { params }),

  getSellerServices: (sellerId, params = {}) => api.get(`/services/seller/${sellerId}`, { params }),
};

export default serviceService;
