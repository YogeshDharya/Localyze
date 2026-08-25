import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { serviceService } from '../../services/serviceService';
import { categoryService } from '../../services/categoryService';
import { toast } from 'react-hot-toast';
import { Save, ArrowLeft, MapPin } from 'lucide-react';

const AddService = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    priceUnit: 'fixed',
    categoryId: '',
    address: '',
    latitude: '',
    longitude: ''
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAll();
        if (response.success && response.data) {
          setCategories(response.data);
          if (response.data.length > 0) {
            setFormData(prev => ({ ...prev, categoryId: response.data[0].id.toString() }));
          }
        }
      } catch (err) {
        toast.error('Failed to load categories');
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      };
      
      const response = await serviceService.create(payload);
      if (response.success) {
        toast.success('Service created successfully!');
        navigate('/seller/services');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create service');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
          toast.success('Location updated');
        },
        (error) => {
          toast.error('Could not get your location. Please allow location access.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate('/seller/services')}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 glass rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Service</h1>
      </div>

      <div className="glass rounded-xl p-6 md:p-8 border border-gray-200 dark:border-gray-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Service Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                placeholder="e.g., Professional Plumbing Services"
              />
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category *
              </label>
              <select
                id="categoryId"
                name="categoryId"
                required
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              >
                <option value="" disabled>Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Price ($) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label htmlFor="priceUnit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Price Unit *
                </label>
                <select
                  id="priceUnit"
                  name="priceUnit"
                  required
                  value={formData.priceUnit}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="per_hour">Per Hour</option>
                  <option value="per_visit">Per Visit</option>
                  <option value="per_day">Per Day</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
                placeholder="Describe your service in detail..."
              ></textarea>
            </div>
            
            <hr className="border-gray-200 dark:border-gray-700 my-6" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Location Details</h3>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Service Area / Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                placeholder="Where do you provide this service?"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-end">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Coordinates (Optional)
                </label>
                <button 
                  type="button" 
                  onClick={getLocation}
                  className="text-xs flex items-center text-primary-600 dark:text-primary-400 hover:underline"
                >
                  <MapPin className="w-3 h-3 mr-1" /> Use Current Location
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    placeholder="Latitude"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    placeholder="Longitude"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/seller/services')}
              className="px-6 py-2 mr-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-500/50 disabled:opacity-50 transition-colors flex items-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              {loading ? 'Saving...' : 'Create Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddService;
