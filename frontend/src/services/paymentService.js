import api from './api';

const paymentService = {
  createOrder: (bookingId) => api.post('/payments/create-order', { bookingId: Number(bookingId) }),

  verifyPayment: (data) => api.post('/payments/verify', data),

  getPaymentByBooking: (bookingId) => api.get(`/payments/booking/${bookingId}`),
};

export default paymentService;
