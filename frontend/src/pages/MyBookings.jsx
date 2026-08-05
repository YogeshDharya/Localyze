import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, X, MessageSquare } from 'lucide-react';
import bookingService from '../services/bookingService';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import RazorpayButton from '../components/ui/RazorpayButton';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import { showToast } from '../components/ui/Toast';
import { formatDate, formatPrice } from '../utils/formatters';
import { BOOKING_STATUS_COLORS } from '../utils/constants';

const TABS = ['ALL', 'PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = { page, size: 10, ...(activeTab !== 'ALL' && { status: activeTab }) };
      const res = await bookingService.getMyBookings(params);
      setBookings(res.data?.content || []);
      setTotalPages(res.data?.totalPages || 0);
    } catch { setBookings([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(); }, [activeTab, page]);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await bookingService.cancel(id, { reason: 'Cancelled by user' });
      showToast.success('Booking cancelled');
      fetchBookings();
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Bookings</h1>

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {TABS.map(tab => (
          <button key={tab} onClick={() => { setActiveTab(tab); setPage(0); }}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab ? 'bg-blue-500 text-white' : 'glass hover:bg-white/30 text-gray-600 dark:text-gray-300'
            }`}>
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : bookings.length === 0 ? (
        <EmptyState icon={Calendar} title="No bookings" description="You haven't made any bookings yet"
          action={{ label: 'Find Services', onClick: () => navigate('/dashboard') }} />
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking.id} className="glass-card animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{booking.serviceTitle}</h3>
                    <Badge variant={BOOKING_STATUS_COLORS[booking.status]}>{booking.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Provider: {booking.sellerName}</p>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(booking.bookingDate)}</span>
                    {booking.timeSlot && <span>{booking.timeSlot}</span>}
                  </div>
                  {booking.notes && <p className="text-sm text-gray-400 mt-1 italic">"{booking.notes}"</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" icon={MessageSquare}
                    onClick={() => navigate(`/bookings/${booking.id}/messages`)}>
                    Chat
                  </Button>
                  {['PENDING', 'CONFIRMED'].includes(booking.status) && (
                    <RazorpayButton bookingId={booking.id} label="Pay" className="!px-2 !py-1" />
                  )}
                  {['PENDING', 'CONFIRMED'].includes(booking.status) && (
                    <Button variant="danger" size="sm" icon={X} onClick={() => handleCancel(booking.id)}>
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button variant="ghost" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</Button>
              <span className="px-4 py-2 text-sm text-gray-500">{page + 1} / {totalPages}</span>
              <Button variant="ghost" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
