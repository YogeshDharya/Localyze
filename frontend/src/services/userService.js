import api from './api';

const userService = {
  getProfile: () => api.get('/users/me'),

  updateProfile: (data) => api.put('/users/me', data),

  changePassword: (data) => api.put('/users/me/password', data),

  updateLocation: (data) => api.put('/users/me/location', data),

  deleteAccount: () => api.delete('/users/me'),
};

export default userService;
