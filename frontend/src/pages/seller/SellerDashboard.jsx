import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, DollarSign, Star, Plus, ArrowRight } from 'lucide-react';
import serviceService from '../../services/serviceService';
import bookingService from '../../services/bookingService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import { formatPrice, formatDate } from '../../utils/formatters';
import { BOOKING_STATUS_COLORS } from '../../utils/constants';

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ services: 0, bookings: 0, revenue: 0, rating: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [svcRes, bkgRes] = await Promise.all([
          serviceService.getMyServices({ page: 0, size: 100 }),
          bookingService.getSellerBookings({ page: 0, size: 5 }),
        ]);
        const services = svcRes.data?.content || [];
        const bookings = bkgRes.data?.content || [];
        setStats({
          services: svcRes.data?.totalElements || 0,
          bookings: bkgRes.data?.totalElements || 0,
          revenue: 0,
          rating: services.length > 0 ? (services.reduce((sum, s) => sum + (s.avgRating || 0), 0) / services.length).toFixed(1) : 0,
        });
        setRecentBookings(bookings);
      } catch { /* */ }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="xl" /></div>;

  const statCards = [
    { label: 'Total Services', value: stats.services, icon: Package, color: 'from-blue-500 to-cyan-500' },
    { label: 'Active Bookings', value: stats.bookings, icon: Calendar, color: 'from-purple-500 to-pink-500' },
    { label: 'Avg Rating', value: stats.rating + '★', icon: Star, color: 'from-amber-500 to-orange-500' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Seller Dashboard</h1>
        <Button icon={Plus} onClick={() => navigate('/seller/services/new')}>Add Service</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {statCards.map(s => (
          <div key={s.label} className="glass-card flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}>
              <s.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Card onClick={() => navigate('/seller/services')} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-blue-500" />
            <span className="font-medium text-gray-900 dark:text-white">My Services</span>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </Card>
        <Card onClick={() => navigate('/seller/bookings')} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-purple-500" />
            <span className="font-medium text-gray-900 dark:text-white">View Bookings</span>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </Card>
      </div>

      {/* Recent Bookings */}
      <div className="glass-card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Bookings</h3>
        {recentBookings.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No bookings yet</p>
        ) : (
          <div className="space-y-3">
            {recentBookings.map(b => (
              <div key={b.id} className="flex items-center justify-between p-3 rounded-xl bg-white/10 dark:bg-slate-700/20">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{b.serviceTitle}</p>
                  <p className="text-sm text-gray-500">{b.userName} • {formatDate(b.bookingDate)}</p>
                </div>
                <Badge variant={BOOKING_STATUS_COLORS[b.status]}>{b.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
