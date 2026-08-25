import React from 'react';
import { Calendar, Clock, DollarSign, FileText } from 'lucide-react';
import Badge from './Badge';

const BookingCard = ({ booking, onStatusChange, onCancel, role }) => {
  if (!booking) return null;

  const date = new Date(booking.scheduledAt);
  const formattedDate = date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  const formattedTime = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'CONFIRMED': return 'info';
      case 'COMPLETED': return 'success';
      case 'CANCELLED': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
            {booking.serviceTitle}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {role === 'SELLER' ? `Customer: ${booking.customerName}` : `Booking #${booking.id}`}
          </p>
        </div>
        <Badge variant={getStatusBadgeVariant(booking.status)} className="w-fit">
          {booking.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center text-gray-700 dark:text-gray-300">
          <Calendar size={18} className="mr-2 text-primary-500" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center text-gray-700 dark:text-gray-300">
          <Clock size={18} className="mr-2 text-primary-500" />
          <span>{formattedTime}</span>
        </div>
        <div className="flex items-center text-gray-700 dark:text-gray-300">
          <DollarSign size={18} className="mr-2 text-primary-500" />
          <span className="font-semibold">${booking.totalAmount}</span>
        </div>
      </div>

      {booking.notes && (
        <div className="flex items-start text-sm text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-black/20 p-3 rounded-lg mb-6">
          <FileText size={16} className="mr-2 mt-0.5 shrink-0" />
          <p>{booking.notes}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-3 justify-end border-t border-gray-100 dark:border-white/10 pt-4 mt-auto">
        {role === 'SELLER' && booking.status === 'PENDING' && (
          <>
            <button
              onClick={() => onStatusChange && onStatusChange(booking.id, 'CONFIRMED')}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm font-medium shadow-sm"
            >
              Confirm
            </button>
            <button
              onClick={() => onStatusChange && onStatusChange(booking.id, 'CANCELLED')}
              className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors text-sm font-medium"
            >
              Cancel
            </button>
          </>
        )}

        {role === 'SELLER' && booking.status === 'CONFIRMED' && (
          <button
            onClick={() => onStatusChange && onStatusChange(booking.id, 'COMPLETED')}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium shadow-sm"
          >
            Mark Completed
          </button>
        )}

        {role === 'USER' && booking.status === 'PENDING' && (
          <button
            onClick={() => onCancel && onCancel(booking.id)}
            className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors text-sm font-medium"
          >
            Cancel Booking
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
