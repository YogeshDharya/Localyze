import api from './api';

export const reviewService = {
  getByService: (serviceId, page = 0, size = 10) => api.get(`/reviews/service/${serviceId}?page=${page}&size=${size}`),
  create: (data) => api.post('/reviews', data)
};
