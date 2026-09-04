import { useState, useEffect } from 'react';
import { Shield, ShieldOff, Trash2 } from 'lucide-react';
import adminService from '../../services/adminService';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import { showToast } from '../../components/ui/Toast';
import { formatDate } from '../../utils/formatters';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers({ page, size: 20 });
      setUsers(res.data?.content || []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [page]);

  const handleStatusChange = async (id, isActive) => {
    try {
      await adminService.updateUserStatus(id, { isActive });
      showToast.success(`User ${isActive ? 'activated' : 'deactivated'}`);
      fetchUsers();
    } catch { showToast.error('Failed to update user status'); }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="xl" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manage Users</h1>
      <div className="glass-card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/20 dark:border-slate-700/50 text-gray-500 dark:text-gray-400">
              <th className="pb-3 font-semibold">Name & Email</th>
              <th className="pb-3 font-semibold">Role</th>
              <th className="pb-3 font-semibold">Joined</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-white/10 dark:border-slate-700/30">
                <td className="py-4">
                  <p className="font-semibold text-gray-900 dark:text-white">{user.fullName}</p>
                  <p className="text-gray-500">{user.email}</p>
                </td>
                <td className="py-4"><Badge variant="info">{user.role}</Badge></td>
                <td className="py-4 text-gray-500">{formatDate(user.createdAt)}</td>
                <td className="py-4">
                  <Badge variant={user.isActive ? 'success' : 'error'}>{user.isActive ? 'Active' : 'Inactive'}</Badge>
                </td>
                <td className="py-4 text-right">
                  <button onClick={() => handleStatusChange(user.id, !user.isActive)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-600 dark:text-gray-400 transition-colors">
                    {user.isActive ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                  </button>
                  <button className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-red-500 transition-colors ml-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
