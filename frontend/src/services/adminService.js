import api from './api';

const adminService = {
  getUsers: (params = {}) => api.get('/admin/users', { params }),

  updateUserStatus: (id, isActive) =>
    api.put(`/admin/users/${id}/status`, { isActive }),

  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  getAdminServices: (params = {}) => api.get('/admin/services', { params }),

  updateServiceStatus: (id, status) =>
    api.put(`/admin/services/${id}/status`, { status }),

  deleteAdminService: (id) => api.delete(`/admin/services/${id}`),

  getStats: () => api.get('/admin/stats'),
};

export default adminService;
