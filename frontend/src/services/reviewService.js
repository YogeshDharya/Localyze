import api from './api';

const reviewService = {
  getByService: (serviceId, params = {}) =>
    api.get(`/reviews/service/${serviceId}`, { params }),

  createReview: (data) => api.post('/reviews', data),

  updateReview: (id, data) => api.put(`/reviews/${id}`, data),

  deleteReview: (id) => api.delete(`/reviews/${id}`),
};

export default reviewService;
