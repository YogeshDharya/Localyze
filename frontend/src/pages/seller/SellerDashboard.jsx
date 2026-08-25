import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { serviceService } from '../../services/serviceService';
import { bookingService } from '../../services/bookingService';
import { Activity, Book, Briefcase, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SellerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalServices: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch services
        const servicesResponse = await serviceService.getByProvider(user.id, 0, 100);
        const services = servicesResponse.data?.content || [];
        
        // Fetch bookings
        const bookingsResponse = await bookingService.getMyAsProvider(0, 5);
        const bookingsData = bookingsResponse.data?.content || [];
        const allBookingsResponse = await bookingService.getMyAsProvider(0, 1000);
        const allBookings = allBookingsResponse.data?.content || [];

        setStats({
          totalServices: services.length,
          totalBookings: allBookings.length,
          pendingBookings: allBookings.filter(b => b.status === 'PENDING').length,
          completedBookings: allBookings.filter(b => b.status === 'COMPLETED').length,
        });

        setRecentBookings(bookingsData);
      } catch (err) {
        toast.error('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Seller Dashboard</h1>
        <div className="space-x-3">
          <Link to="/seller/services" className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            Manage Services
          </Link>
          <Link to="/seller/services/new" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            Add New Service
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass rounded-xl p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Services</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalServices}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-800/50 rounded-full">
              <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-6 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalBookings}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-800/50 rounded-full">
              <Book className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-6 bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Pending</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.pendingBookings}</p>
            </div>
            <div className="p-3 bg-amber-100 dark:bg-amber-800/50 rounded-full">
              <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-6 bg-gradient-to-br from-purple-50 to-fuchsia-100 dark:from-purple-900/20 dark:to-fuchsia-900/20 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Completed</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.completedBookings}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-800/50 rounded-full">
              <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="glass rounded-xl p-6 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <Activity className="w-5 h-5 mr-2 text-primary-500" />
            Recent Bookings
          </h2>
          <Link to="/seller/bookings" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
            View All
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No recent bookings found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Service</th>
                  <th className="py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Customer</th>
                  <th className="py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Date</th>
                  <th className="py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{booking.serviceTitle}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{booking.customerName}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{new Date(booking.scheduledAt).toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        booking.status === 'COMPLETED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        booking.status === 'PENDING' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                        booking.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
