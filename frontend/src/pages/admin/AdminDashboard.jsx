import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { serviceService } from '../../services/serviceService';
import { Users, Briefcase, Activity, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    sellers: 0,
    totalServices: 0,
    activeServices: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersRes, servicesRes] = await Promise.all([
          adminService.getUsers(0, 10),
          serviceService.getAll(0, 1000)
        ]);

        if (usersRes.success) {
          const users = usersRes.data.content;
          const totalSellers = usersRes.data.totalElements; // Approximate or we filter
          const sellersCount = users.filter(u => u.role === 'SELLER').length;
          setStats(prev => ({ ...prev, totalUsers: usersRes.data.totalElements, sellers: sellersCount }));
          setRecentUsers(users.slice(0, 5));
        }

        if (servicesRes.success) {
          const services = servicesRes.data.content;
          const activeCount = services.filter(s => s.status === 'ACTIVE').length;
          setStats(prev => ({ 
            ...prev, 
            totalServices: servicesRes.data.totalElements,
            activeServices: activeCount
          }));
        }
      } catch (err) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Admin Dashboard</h1>
        <div className="space-x-2">
          <Link to="/admin/users" className="btn-primary text-sm px-4 py-2">Manage Users</Link>
          <Link to="/admin/services" className="btn-primary text-sm px-4 py-2">Manage Services</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass rounded-xl p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20 border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Users</p>
              <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20 border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-lg text-green-600 dark:text-green-400">
              <Briefcase size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Sellers</p>
              <h3 className="text-2xl font-bold">{stats.sellers}</h3>
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20 border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-lg text-purple-600 dark:text-purple-400">
              <ShoppingBag size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Services</p>
              <h3 className="text-2xl font-bold">{stats.totalServices}</h3>
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-6 bg-gradient-to-br from-amber-500/10 to-amber-600/10 border-amber-500/20 border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/20 rounded-lg text-amber-600 dark:text-amber-400">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Active Services</p>
              <h3 className="text-2xl font-bold">{stats.activeServices}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden mt-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Recent Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Name</th>
                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Email</th>
                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Role</th>
                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {recentUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="p-4 text-sm">{user.name}</td>
                  <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                  <td className="p-4 text-sm">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                      user.role === 'ADMIN' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
                      user.role === 'SELLER' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                      'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {recentUsers.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500 dark:text-gray-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
