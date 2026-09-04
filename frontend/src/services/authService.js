import api from './api';

const authService = {
  register: (data) => api.post('/auth/register', data),

  login: (data) => api.post('/auth/login', data),

  refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),

  verifyEmail: (token) => api.get(`/auth/verify-email?token=${token}`),

  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),

  resetPassword: (data) => api.post('/auth/reset-password', data),
};

export default authService;
