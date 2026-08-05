import api from './api';

const messageService = {
  // existing method names
  getBookingMessages: (bookingId) => api.get(`/messages/booking/${bookingId}`),
  sendMessage: (data) => api.post('/messages', data),
  markAsRead: (messageId) => api.put(`/messages/${messageId}/read`),
  getUnreadCount: () => api.get('/messages/unread-count'),

  // aliases expected by UI
  getByBooking: (bookingId) => messageService.getBookingMessages(bookingId),
  send: (data) => messageService.sendMessage(data),
};

export default messageService;
