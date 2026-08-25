import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { serviceService } from '../../services/serviceService';
import { Edit2, Trash2, Plus, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';

const MyServices = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const size = 10;

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await serviceService.getByProvider(user.id, page, size);
      if (response.success && response.data) {
        setServices(response.data.content || []);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (err) {
      toast.error('Failed to load services');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchServices();
    }
  }, [user, page]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await serviceService.remove(id);
        toast.success('Service deleted successfully');
        fetchServices();
      } catch (err) {
        toast.error('Failed to delete service');
        console.error(err);
      }
    }
  };

  if (loading && services.length === 0) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Services</h1>
        <Link to="/seller/services/new" className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          Add New Service
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center border border-gray-200 dark:border-gray-800">
          <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">No services yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">You haven't added any services to your profile yet.</p>
          <Link to="/seller/services/new" className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Service
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="glass rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col">
                <div className="h-48 bg-gray-200 dark:bg-gray-800 relative">
                  {service.imageUrls && service.imageUrls.length > 0 ? (
                    <img src={service.imageUrls[0]} alt={service.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-2 py-1 rounded-md text-sm font-bold text-primary-600 dark:text-primary-400 shadow-sm">
                    ${service.price} / {service.priceUnit.replace('per_', '')}
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1" title={service.title}>
                      {service.title}
                    </h3>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <Star className="w-4 h-4 text-amber-500 mr-1 fill-amber-500" />
                    <span>{service.averageRating?.toFixed(1) || '0.0'} ({service.totalReviews || 0} reviews)</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
                    {service.description}
                  </p>
                  
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center mt-auto">
                    <span className="text-xs text-gray-500 dark:text-gray-500 truncate mr-2">
                      {service.categoryName || 'Uncategorized'}
                    </span>
                    <div className="flex space-x-2">
                      <Link 
                        to={`/seller/services/${service.id}/edit`}
                        className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                        title="Edit Service"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(service.id)}
                        className="p-2 text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              <button 
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 glass rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 flex items-center dark:text-gray-300">
                Page {page + 1} of {totalPages}
              </span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="px-4 py-2 glass rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyServices;
