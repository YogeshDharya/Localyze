import api from './api';

const bookingService = {
  create: (data) => api.post('/bookings', data),

  getMyBookings: (params = {}) => api.get('/bookings/my', { params }),

  getSellerBookings: (params = {}) => api.get('/bookings/seller', { params }),

  getById: (id) => api.get(`/bookings/${id}`),

  updateStatus: (id, data) => api.put(`/bookings/${id}/status`, data),

  cancel: (id, data) => api.put(`/bookings/${id}/cancel`, data),
};

export default bookingService;
