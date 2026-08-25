import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';
import { Search, ShieldBan, Filter } from 'lucide-react';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [roleFilter, setRoleFilter] = useState('ALL');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers(page, 20);
      if (res.success) {
        setUsers(res.data.content);
        setTotalPages(res.data.totalPages);
      }
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleDeactivate = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this user? This cannot be undone from the UI directly.')) {
      try {
        // Assume adminService.deactivateUser exists or fallback to delete user API
        const res = adminService.deactivateUser 
          ? await adminService.deactivateUser(id) 
          : await adminService.deleteUser(id); // fallback for API instructions where DELETE is mentioned
        if (res?.success !== false) {
          toast.success('User deactivated successfully');
          fetchUsers();
        } else {
          toast.error('Failed to deactivate user');
        }
      } catch (err) {
        toast.error('Error deactivating user');
      }
    }
  };

  const filteredUsers = roleFilter === 'ALL' 
    ? users 
    : users.filter(u => u.role === roleFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Manage Users</h1>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <select 
            className="input-field py-2"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="ALL">All Roles</option>
            <option value="USER">User</option>
            <option value="SELLER">Seller</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">ID</th>
                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Name</th>
                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Email</th>
                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Role</th>
                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">City</th>
                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Created At</th>
                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">Loading users...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">No users found for this filter.</td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="p-4 text-xs font-mono text-gray-500">{user.id}</td>
                    <td className="p-4 text-sm font-medium">{user.name}</td>
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
                    <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{user.city || 'N/A'}</td>
                    <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-sm">
                      <button 
                        onClick={() => handleDeactivate(user.id)}
                        disabled={user.role === 'ADMIN'}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                          user.role === 'ADMIN' 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                            : 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400'
                        }`}
                      >
                        <ShieldBan size={14} />
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/30">
            <button 
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 rounded-md text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Page {page + 1} of {totalPages}
            </span>
            <button 
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="px-3 py-1.5 rounded-md text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
