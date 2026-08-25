import React, { useState, useEffect } from 'react';
import { serviceService } from '../../services/serviceService';
import toast from 'react-hot-toast';
import { Search, Trash2, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ManageServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await serviceService.getAll(page, 20);
      if (res.success) {
        setServices(res.data.content);
        setTotalPages(res.data.totalPages);
      }
    } catch (error) {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [page]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      try {
        const res = await serviceService.remove(id); // assuming remove or deleteService exists
        if (res?.success !== false) {
          toast.success('Service deleted successfully');
          fetchServices();
        } else {
          toast.error('Failed to delete service');
        }
      } catch (err) {
        toast.error('Error deleting service');
      }
    }
  };

  const getStatusBadge = (status) => {
    const statuses = {
      ACTIVE: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400',
      INACTIVE: 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400',
      PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
      REJECTED: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
    };
    const cssClass = statuses[status] || statuses.INACTIVE;
    return <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${cssClass}`}>{status || 'INACTIVE'}</span>;
  };

  const filteredServices = services.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Manage Services</h1>
        <div className="relative w-full md:w-64">
          <input 
            type="text" 
            placeholder="Search by title..." 
            className="input-field pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">ID</th>
                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Title</th>
                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Provider</th>
                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Category</th>
                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Price</th>
                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Created At</th>
                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-gray-500">Loading services...</td>
                </tr>
              ) : filteredServices.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-gray-500">No services found.</td>
                </tr>
              ) : (
                filteredServices.map(service => (
                  <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="p-4 text-xs font-mono text-gray-500">
                      <Link to={`/services/${service.id}`} className="hover:text-blue-500 truncate block w-16" title={service.id}>
                        {service.id.substring(0, 8)}...
                      </Link>
                    </td>
                    <td className="p-4 text-sm font-medium truncate max-w-[200px]" title={service.title}>
                      {service.title}
                    </td>
                    <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{service.providerName}</td>
                    <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{service.categoryName || 'Unknown'}</td>
                    <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
                      ${service.price} {service.priceUnit ? `/ ${service.priceUnit}` : ''}
                    </td>
                    <td className="p-4 text-sm">
                      {getStatusBadge(service.status)}
                    </td>
                    <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(service.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-sm">
                      <button 
                        onClick={() => handleDelete(service.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400"
                      >
                        <Trash2 size={14} />
                        Delete
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
