import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { bookingService } from '../../services/bookingService';
import { toast } from 'react-hot-toast';
import { Calendar, Clock, User, Check, X, Info } from 'lucide-react';

const SellerBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('ALL');
  const size = 10;

  useEffect(() => {
    const fetchFiltered = async () => {
        try {
            setLoading(true);
            const res = await bookingService.getMyAsProvider(0, 1000);
            if (res.success && res.data) {
                const all = res.data.content || [];
                const filtered = filter === 'ALL' ? all : all.filter(b => b.status === filter);
                
                // Manual pagination of filtered results
                const start = page * size;
                const paginated = filtered.slice(start, start + size);
                
                setBookings(paginated);
                setTotalPages(Math.ceil(filtered.length / size) || 1);
            }
        } catch (e) {
            console.error(e);
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    }
    
    if (user?.id) {
        fetchFiltered();
    }
  }, [user, page, filter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await bookingService.updateStatus(id, newStatus);
      if (response.success) {
        toast.success(`Booking status updated to ${newStatus}`);
        // Locally update to avoid full refetch
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
      }
    } catch (err) {
      toast.error('Failed to update status');
      console.error(err);
    }
  };

  const tabs = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Bookings</h1>
      
      {/* Filters */}
      <div className="flex overflow-x-auto pb-2 gap-2">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => { setFilter(tab); setPage(0); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === tab 
                ? 'bg-primary-600 text-white' 
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading && bookings.length === 0 ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center border border-gray-200 dark:border-gray-800">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">No bookings found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {filter === 'ALL' ? "You don't have any bookings yet." : `You have no ${filter.toLowerCase()} bookings.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="glass rounded-xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start md:block md:mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {booking.serviceTitle}
                    </h3>
                    <span className={`md:hidden px-2 py-1 text-xs rounded-full font-medium ${
                      booking.status === 'COMPLETED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      booking.status === 'PENDING' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                      booking.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      <span>Customer: {booking.customerName}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{new Date(booking.scheduledAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{new Date(booking.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    {booking.totalAmount && (
                      <div className="flex items-center font-medium text-gray-900 dark:text-gray-200">
                        Total: ${booking.totalAmount}
                      </div>
                    )}
                  </div>
                  
                  {booking.notes && (
                    <div className="mt-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg text-sm text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-800">
                      <span className="font-medium flex items-center mb-1"><Info className="w-4 h-4 mr-1"/> Notes:</span>
                      {booking.notes}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-start md:items-end space-y-3 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-800">
                  <span className={`hidden md:inline-flex px-3 py-1 text-xs rounded-full font-medium ${
                    booking.status === 'COMPLETED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    booking.status === 'PENDING' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                    booking.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {booking.status}
                  </span>

                  {booking.status === 'PENDING' && (
                    <div className="flex space-x-2 w-full md:w-auto mt-2">
                      <button 
                        onClick={() => handleStatusChange(booking.id, 'CONFIRMED')}
                        className="flex-1 md:flex-none flex items-center justify-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors"
                      >
                        <Check className="w-4 h-4 mr-1" /> Confirm
                      </button>
                      <button 
                        onClick={() => handleStatusChange(booking.id, 'CANCELLED')}
                        className="flex-1 md:flex-none flex items-center justify-center px-3 py-1.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 text-sm transition-colors"
                      >
                        <X className="w-4 h-4 mr-1" /> Reject
                      </button>
                    </div>
                  )}

                  {booking.status === 'CONFIRMED' && (
                    <div className="flex w-full md:w-auto mt-2">
                      <button 
                        onClick={() => handleStatusChange(booking.id, 'COMPLETED')}
                        className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm transition-colors"
                      >
                        <Check className="w-4 h-4 mr-1" /> Mark Completed
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              <button 
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 glass rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 flex items-center dark:text-gray-300">
                Page {page + 1} of {totalPages}
              </span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="px-4 py-2 glass rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SellerBookings;
