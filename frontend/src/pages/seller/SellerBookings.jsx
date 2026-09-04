import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle, XCircle, Clock, MessageSquare } from 'lucide-react';
import bookingService from '../../services/bookingService';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import { showToast } from '../../components/ui/Toast';
import { formatDate } from '../../utils/formatters';
import { BOOKING_STATUS_COLORS } from '../../utils/constants';

const TABS = ['ALL', 'PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

export default function SellerBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [page, setPage] = useState(0);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = { page, size: 20, ...(activeTab !== 'ALL' && { status: activeTab }) };
      const res = await bookingService.getSellerBookings(params);
      setBookings(res.data?.content || []);
    } catch { setBookings([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(); }, [activeTab, page]);

  const updateStatus = async (id, status) => {
    try {
      await bookingService.updateStatus(id, { status });
      showToast.success(`Booking marked as ${status}`);
      fetchBookings();
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manage Bookings</h1>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {TABS.map(tab => (
          <button key={tab} onClick={() => { setActiveTab(tab); setPage(0); }}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab ? 'bg-blue-500 text-white shadow-lg' : 'glass hover:bg-white/30 text-gray-600 dark:text-gray-300'
            }`}>
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : bookings.length === 0 ? (
        <EmptyState icon={Calendar} title="No bookings" description="No bookings found for the selected status." />
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking.id} className="glass-card">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{booking.serviceTitle}</h3>
                    <Badge variant={BOOKING_STATUS_COLORS[booking.status]}>{booking.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Customer: {booking.userName}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{formatDate(booking.bookingDate)}</span>
                    {booking.timeSlot && <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{booking.timeSlot}</span>}
                  </div>
                  {booking.notes && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 bg-white/5 p-2 rounded-lg border border-white/10">Note: {booking.notes}</p>}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="ghost" size="sm" icon={MessageSquare} onClick={() => navigate(`/bookings/${booking.id}/messages`)}>
                    Message
                  </Button>
                  
                  {booking.status === 'PENDING' && (
                    <>
                      <Button variant="secondary" size="sm" icon={CheckCircle} onClick={() => updateStatus(booking.id, 'CONFIRMED')} className="text-emerald-500 hover:text-emerald-600">
                        Accept
                      </Button>
                      <Button variant="ghost" size="sm" icon={XCircle} onClick={() => updateStatus(booking.id, 'CANCELLED')} className="text-red-500 hover:text-red-600">
                        Reject
                      </Button>
                    </>
                  )}
                  {booking.status === 'CONFIRMED' && (
                    <Button variant="secondary" size="sm" onClick={() => updateStatus(booking.id, 'IN_PROGRESS')} className="text-blue-500">
                      Mark In Progress
                    </Button>
                  )}
                  {booking.status === 'IN_PROGRESS' && (
                    <Button variant="secondary" size="sm" icon={CheckCircle} onClick={() => updateStatus(booking.id, 'COMPLETED')} className="text-emerald-500">
                      Complete Job
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
