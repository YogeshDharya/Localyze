import api from './api';

export const bookingService = {
  create: (data) => api.post('/bookings/', data),
  getById: (id) => api.get(`/bookings/${id}`),
  getMyAsCustomer: (page = 0, size = 10) => api.get(`/bookings/my/customer?page=${page}&size=${size}`),
  getMyAsProvider: (page = 0, size = 10) => api.get(`/bookings/my/provider?page=${page}&size=${size}`),
  updateStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status }),
  cancel: (id) => api.post(`/bookings/${id}/cancel`)
};
