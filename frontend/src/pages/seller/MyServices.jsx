import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Plus, Package } from 'lucide-react';
import serviceService from '../../services/serviceService';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import { formatPrice } from '../../utils/formatters';
import { showToast } from '../../components/ui/Toast';

export default function MyServices() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await serviceService.getMyServices({ page: 0, size: 50 });
      setServices(res.data?.content || []);
    } catch {
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await serviceService.delete(id);
      showToast.success('Service deleted successfully');
      fetchServices();
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to delete service');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Services</h1>
        <Button icon={Plus} onClick={() => navigate('/seller/services/new')}>Add Service</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="xl" /></div>
      ) : services.length === 0 ? (
        <EmptyState icon={Package} title="No services yet" description="You haven't listed any services."
          action={{ label: 'Add Your First Service', onClick: () => navigate('/seller/services/new') }} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <div key={service.id} className="glass-card flex flex-col">
              <div className="h-40 -mx-6 -mt-6 mb-4 bg-gray-200 dark:bg-slate-700 rounded-t-2xl overflow-hidden relative">
                {service.imageUrls?.[0] ? (
                  <img src={service.imageUrls[0]} alt={service.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">🔧</div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant={service.status === 'ACTIVE' ? 'success' : 'warning'}>{service.status}</Badge>
                </div>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1 mb-1">{service.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{service.categoryName}</p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200/50 dark:border-slate-700/50">
                <span className="font-bold text-blue-600 dark:text-blue-400">{formatPrice(service.price)}</span>
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/seller/services/${service.id}/edit`)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-600 dark:text-gray-400 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(service.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
