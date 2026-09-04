import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';
import adminService from '../../services/adminService';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import { showToast } from '../../components/ui/Toast';
import { formatPrice } from '../../utils/formatters';

export default function ManageServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAdminServices({ page, size: 20 });
      setServices(res.data?.content || []);
    } catch {
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, [page]);

  const handleStatusChange = async (id, status) => {
    try {
      await adminService.updateServiceStatus(id, status);
      showToast.success(`Service status updated to ${status}`);
      fetchServices();
    } catch { showToast.error('Failed to update status'); }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="xl" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manage Services</h1>
      <div className="glass-card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/20 dark:border-slate-700/50 text-gray-500 dark:text-gray-400">
              <th className="pb-3 font-semibold">Service</th>
              <th className="pb-3 font-semibold">Provider</th>
              <th className="pb-3 font-semibold">Category</th>
              <th className="pb-3 font-semibold">Price</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service.id} className="border-b border-white/10 dark:border-slate-700/30">
                <td className="py-4">
                  <p className="font-semibold text-gray-900 dark:text-white line-clamp-1 max-w-[200px]">{service.title}</p>
                </td>
                <td className="py-4 text-gray-600 dark:text-gray-400">{service.sellerName}</td>
                <td className="py-4"><Badge variant="info">{service.categoryName}</Badge></td>
                <td className="py-4 font-medium text-gray-900 dark:text-gray-200">{formatPrice(service.price)}</td>
                <td className="py-4">
                  <Badge variant={service.status === 'ACTIVE' ? 'success' : service.status === 'PENDING' ? 'warning' : 'error'}>{service.status}</Badge>
                </td>
                <td className="py-4 text-right">
                  {service.status === 'PENDING' && (
                    <>
                      <button onClick={() => handleStatusChange(service.id, 'ACTIVE')} className="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg text-emerald-500 transition-colors">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleStatusChange(service.id, 'REJECTED')} className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-red-500 transition-colors ml-2">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {service.status === 'ACTIVE' && (
                    <button onClick={() => handleStatusChange(service.id, 'INACTIVE')} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-600 dark:text-gray-400 transition-colors ml-2">
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
