import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { serviceService } from '../services/serviceService';
import api from '../services/api';
import ServiceCard from '../components/ui/ServiceCard';
import Pagination from '../components/ui/Pagination';
import GlassCard from '../components/ui/GlassCard';
import Input from '../components/ui/Input';
import EmptyState from '../components/ui/EmptyState';
import { MapPin, Search } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('browse');
  
  // Browse state
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  // Nearby state
  const [nearbyServices, setNearbyServices] = useState([]);
  const [radius, setRadius] = useState(5);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (activeTab === 'browse') {
      fetchServices();
    }
  }, [page, search, categoryId, activeTab]);

  useEffect(() => {
    if (activeTab === 'nearby') {
      fetchNearby();
    }
  }, [radius, categoryId, activeTab]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data || response.data);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      let response;
      if (search) {
        response = await serviceService.search(search, page, 10);
      } else {
        response = await serviceService.getAll({ page, size: 10, categoryId });
      }
      const servicePage = response.data || response;
      setServices(servicePage.content || []);
      setTotalPages(servicePage.totalPages || 0);
    } catch (err) {
      console.error('Failed to load services', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNearby = () => {
    setNearbyLoading(true);
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setNearbyLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await serviceService.getNearby(latitude, longitude, radius, categoryId);
          const nearbyPage = response.data || response;
          setNearbyServices(nearbyPage.content || nearbyPage || []);
        } catch (err) {
          console.error('Failed to fetch nearby services', err);
          setLocationError('Failed to fetch nearby services');
        } finally {
          setNearbyLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationError('Failed to get your location. Please allow location access.');
        setNearbyLoading(false);
      }
    );
  };

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="animate-pulse bg-white/5 rounded-xl h-64"></div>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-white">Find Services</h1>
        
        <div className="flex bg-white/10 p-1 rounded-xl glass">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'browse' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-300 hover:text-white'
            }`}
          >
            Browse
          </button>
          <button
            onClick={() => setActiveTab('nearby')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'nearby' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-300 hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" /> Nearby
          </button>
        </div>
      </div>

      {activeTab === 'browse' && (
        <div className="space-y-6">
          <GlassCard className="p-4 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full md:w-64 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="" className="bg-gray-900">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-gray-900">
                  {cat.name}
                </option>
              ))}
            </select>
          </GlassCard>

          {loading ? (
            renderSkeleton()
          ) : services.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <ServiceCard 
                    key={service.id} 
                    service={service} 
                    onClick={() => navigate(`/services/${service.id}`)} 
                  />
                ))}
              </div>
              {totalPages > 1 && (
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              )}
            </>
          ) : (
            <EmptyState message="No services found matching your criteria." />
          )}
        </div>
      )}

      {activeTab === 'nearby' && (
        <div className="space-y-6">
          <GlassCard className="p-4 flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full flex items-center gap-4">
              <label className="text-gray-300 text-sm whitespace-nowrap">Radius:</label>
              <select
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full md:w-32 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value={0.5} className="bg-gray-900">0.5 km</option>
                <option value={1} className="bg-gray-900">1 km</option>
                <option value={2} className="bg-gray-900">2 km</option>
                <option value={5} className="bg-gray-900">5 km</option>
                <option value={10} className="bg-gray-900">10 km</option>
              </select>
            </div>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full md:w-64 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="" className="bg-gray-900">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-gray-900">
                  {cat.name}
                </option>
              ))}
            </select>
          </GlassCard>

          {locationError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center">
              {locationError}
            </div>
          )}

          {nearbyLoading ? (
            renderSkeleton()
          ) : nearbyServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearbyServices.map((service) => (
                <ServiceCard 
                  key={service.id} 
                  service={service} 
                  onClick={() => navigate(`/services/${service.id}`)} 
                />
              ))}
            </div>
          ) : (
            !locationError && <EmptyState message="No services found nearby. Try increasing the radius." />
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
