import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Filter, SlidersHorizontal, Star, Navigation } from 'lucide-react';
import { useLocationContext as useLocationCtx } from '../contexts/LocationContext';
import serviceService from '../services/serviceService';
import categoryService from '../services/categoryService';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import Badge from '../components/ui/Badge';
import StarRating from '../components/ui/StarRating';
import { useDebounce } from '../hooks/useDebounce';
import { formatPrice, formatDistance, formatRating } from '../utils/formatters';
import { RADIUS_OPTIONS } from '../utils/constants';

export default function Dashboard() {
  const { location, loading: locationLoading, getCurrentLocation } = useLocationCtx();
  const latitude = location?.lat;
  const longitude = location?.lng;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [radius, setRadius] = useState(2);
  const [sortBy, setSortBy] = useState('distance');
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');

  const debouncedSearch = useDebounce(search, 300);

  // Load categories
  useEffect(() => {
    categoryService.getAll().then(res => setCategories(res.data)).catch(() => {});
  }, []);

  // Load services
  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const lat = latitude || 18.5204;
      const lng = longitude || 73.8567;

      // Try nearby search if location available
      const params = {
        lat, lng, radius,
        ...(selectedCategory && { search: selectedCategory }),
        ...(minRating && { minRating: parseFloat(minRating) }),
        sortBy,
      };

      let res;
      try {
        res = await serviceService.getNearby(params);
        let data = res.data;

        // Client-side text search
        if (debouncedSearch) {
          const q = debouncedSearch.toLowerCase();
          data = data.filter(s =>
            s.title?.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q)
          );
        }
        // Price filters
        if (minPrice) data = data.filter(s => s.price >= parseFloat(minPrice));
        if (maxPrice) data = data.filter(s => s.price <= parseFloat(maxPrice));

        setServices(data);
      } catch {
        // Fallback to paginated search
        res = await serviceService.getAll({ search: debouncedSearch, page: 0, size: 24, sortBy });
        setServices(res.data?.content || []);
      }
    } catch (err) {
      console.error('Failed to fetch services:', err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [latitude, longitude, radius, selectedCategory, debouncedSearch, sortBy, minPrice, maxPrice, minRating]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Search + Filters Bar */}
      <div className="glass-card mb-6 animate-slide-up">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search plumber, electrician, tutor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="glass-input pl-10"
            />
          </div>

          {/* Radius */}
          <select
            value={radius}
            onChange={(e) => setRadius(parseFloat(e.target.value))}
            className="glass-input w-full md:w-36"
          >
            {RADIUS_OPTIONS.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="glass-input w-full md:w-36"
          >
            <option value="distance">Distance</option>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
          </select>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary flex items-center gap-2 ${showFilters ? 'bg-blue-500/20 text-blue-500' : ''}`}
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>

        {/* Extended filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-white/20 dark:border-slate-700/40 grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-down">
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Min Price (₹)</label>
              <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0" className="glass-input" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Max Price (₹)</label>
              <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="No limit" className="glass-input" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Min Rating</label>
              <select value={minRating} onChange={(e) => setMinRating(e.target.value)} className="glass-input">
                <option value="">Any</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
            !selectedCategory ? 'bg-blue-500 text-white shadow-lg' : 'glass hover:bg-white/30'
          }`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(selectedCategory === cat.name ? '' : cat.name)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat.name ? 'bg-blue-500 text-white shadow-lg' : 'glass hover:bg-white/30'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Location info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Navigation className="w-4 h-4 text-blue-500" />
          <span>
            {locationLoading
              ? 'Getting your location...'
              : latitude
              ? `Showing services within ${radius}km of your location`
              : 'Using default location (Pune). Enable location for better results.'}
          </span>
        </div>
        {!latitude && !locationLoading && (
          <button 
            onClick={getCurrentLocation}
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            Detect My Location
          </button>
        )}
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="glass-card">
              <div className="skeleton h-40 rounded-xl mb-4" />
              <div className="skeleton h-4 w-3/4 mb-2" />
              <div className="skeleton h-3 w-1/2 mb-4" />
              <div className="skeleton h-3 w-full" />
            </div>
          ))}
        </div>
      ) : services.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No services found"
          description="Try increasing the search radius or changing your filters"
          action={{ label: 'Clear Filters', onClick: () => { setSearch(''); setSelectedCategory(''); setMinPrice(''); setMaxPrice(''); setMinRating(''); } }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {services.map((service, index) => (
            <Card
              key={service.id}
              onClick={() => navigate(`/services/${service.id}`)}
              className="animate-fade-in overflow-hidden"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Image */}
              <div className="h-40 -mx-6 -mt-6 mb-4 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-t-2xl overflow-hidden">
                {service.imageUrls?.[0] ? (
                  <img src={service.imageUrls[0]} alt={service.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    🔧
                  </div>
                )}
              </div>

              {/* Category badge */}
              <div className="flex items-center justify-between mb-2">
                <Badge variant="info">{service.categoryName || 'Service'}</Badge>
                {service.distance != null && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {formatDistance(service.distance)}
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{service.title}</h3>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-2">
                <StarRating rating={service.avgRating || 0} size="sm" />
                <span className="text-xs text-gray-500">
                  {formatRating(service.avgRating)} ({service.totalReviews || 0})
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                {service.description}
              </p>

              {/* Price */}
              <div className="flex items-center justify-between pt-3 border-t border-white/20 dark:border-slate-700/40">
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {formatPrice(service.price)}
                </span>
                <span className="text-xs text-gray-400">{service.priceUnit || 'fixed'}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
