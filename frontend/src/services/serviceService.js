import api from './api';

export const serviceService = {
  getAll: (pageOrOptions = 0, size = 10) => {
    const options = typeof pageOrOptions === 'object'
      ? pageOrOptions
      : { page: pageOrOptions, size };
    const params = new URLSearchParams({
      page: String(options.page ?? 0),
      size: String(options.size ?? 10),
    });

    if (options.categoryId) params.set('categoryId', options.categoryId);

    return api.get(`/services?${params.toString()}`);
  },
  getById: (id) => api.get(`/services/${id}`),
  search: (q, page = 0, size = 10) => api.get(`/services/search?q=${encodeURIComponent(q)}&page=${page}&size=${size}`),
  getNearby: (lat, lng, radius = 1.0, categoryId = '', page = 0, size = 20) => {
    let url = `/services/nearby?lat=${lat}&lng=${lng}&radius=${radius}&page=${page}&size=${size}`;
    if (categoryId) url += `&categoryId=${categoryId}`;
    return api.get(url);
  },
  getByProvider: (providerId, page = 0, size = 10) => api.get(`/services/provider/${providerId}?page=${page}&size=${size}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  remove: (id) => api.delete(`/services/${id}`),
  uploadImage: (serviceId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/services/${serviceId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};
