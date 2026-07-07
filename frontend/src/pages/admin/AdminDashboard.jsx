import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Package, Calendar, Folder, ArrowRight } from 'lucide-react';
import adminService from '../../services/adminService';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalUsers: 0, totalSellers: 0, totalServices: 0, activeServices: 0, totalBookings: 0, totalCategories: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getStats()
      .then(res => setStats(res.data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="xl" /></div>;

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'from-red-500 to-cyan-500' },
    { label: 'Total Sellers', value: stats.totalSellers, icon: Users, color: 'from-indigo-500 to-blue-500' },
    { label: 'Total Services', value: stats.totalServices, icon: Package, color: 'from-purple-500 to-pink-500' },
    { label: 'Active Services', value: stats.activeServices, icon: Package, color: 'from-emerald-500 to-teal-500' },
    { label: 'Total Bookings', value: stats.totalBookings, icon: Calendar, color: 'from-amber-500 to-orange-500' },
    { label: 'Categories', value: stats.totalCategories, icon: Folder, color: 'from-rose-500 to-red-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map(s => (
          <div key={s.label} className="glass-card flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg`}>
              <s.icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{s.value}</p>
              <p className="text-sm font-medium text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Links</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card onClick={() => navigate('/admin/users')} className="flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <Users className="w-6 h-6" />
            </div>
            <span className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">Manage Users</span>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
        </Card>
        <Card onClick={() => navigate('/admin/services')} className="flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
              <Package className="w-6 h-6" />
            </div>
            <span className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-500 transition-colors">Manage Services</span>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
        </Card>
        <Card onClick={() => navigate('/admin/categories')} className="flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <Folder className="w-6 h-6" />
            </div>
            <span className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-500 transition-colors">Manage Categories</span>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
        </Card>
      </div>
    </div>
  );
}
