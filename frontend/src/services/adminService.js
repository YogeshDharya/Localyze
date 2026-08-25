import api from './api';

export const adminService = {
  getUsers: (page = 0, size = 10) => api.get(`/admin/users/?page=${page}&size=${size}`),
  deactivateUser: (id) => api.delete(`/admin/users/${id}`)
};
