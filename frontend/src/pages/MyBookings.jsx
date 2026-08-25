import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';
import BookingCard from '../components/ui/BookingCard';
import Pagination from '../components/ui/Pagination';
import GlassCard from '../components/ui/GlassCard';
import EmptyState from '../components/ui/EmptyState';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, [page]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await bookingService.getMyAsCustomer(page, 10);
      setBookings(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (err) {
      console.error('Failed to load bookings', err);
      toast.error('Failed to load your bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingService.cancel(id);
      toast.success('Booking cancelled successfully');
      fetchBookings(); // refresh the list
    } catch (err) {
      console.error('Failed to cancel booking', err);
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">My Bookings</h1>
      </div>

      <GlassCard className="p-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-white/5 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                role="USER"
                onCancel={() => handleCancel(booking.id)}
              />
            ))}
            
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </div>
        ) : (
          <EmptyState message="You haven't made any bookings yet." />
        )}
      </GlassCard>
    </div>
  );
};

export default MyBookings;
