import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Phone, Star, Calendar, ArrowLeft, User } from 'lucide-react';
import serviceService from '../services/serviceService';
import reviewService from '../services/reviewService';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import StarRating from '../components/ui/StarRating';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import { formatPrice, formatRating, formatDate } from '../utils/formatters';

export default function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [svcRes, revRes] = await Promise.all([
          serviceService.getById(id),
          reviewService.getByService(id, { page: 0, size: 10 }),
        ]);
        setService(svcRes.data);
        setReviews(revRes.data?.content || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="xl" /></div>;
  if (!service) return <EmptyState title="Service not found" description="This service may have been removed" />;

  const images = service.imageUrls?.length > 0 ? service.imageUrls : [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-blue-500 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left - Image + Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="glass-card p-0 overflow-hidden">
            <div className="h-64 sm:h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20">
              {images.length > 0 ? (
                <img src={images[activeImage]} alt={service.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">🔧</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 p-4">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === activeImage ? 'border-blue-500 scale-105' : 'border-transparent opacity-70'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="glass-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge variant="info" className="mb-2">{service.categoryName}</Badge>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{service.title}</h1>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatPrice(service.price)}</p>
                <p className="text-sm text-gray-500">{service.priceUnit || 'fixed'}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{service.address}</span>
              {service.availability && <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{service.availability}</span>}
            </div>

            <div className="flex items-center gap-2 mb-6">
              <StarRating rating={service.avgRating || 0} />
              <span className="font-medium">{formatRating(service.avgRating)}</span>
              <span className="text-gray-500">({service.totalReviews} reviews)</span>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{service.description}</p>
          </div>

          {/* Reviews */}
          <div className="glass-card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Reviews ({service.totalReviews})
            </h3>
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No reviews yet</p>
            ) : (
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review.id} className="p-4 rounded-xl bg-white/10 dark:bg-slate-700/20 border border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{review.userName?.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">{review.userName}</p>
                        <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
                      </div>
                      <StarRating rating={review.rating} size="sm" className="ml-auto" />
                    </div>
                    {review.comment && <p className="text-sm text-gray-600 dark:text-gray-400">{review.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Seller Card */}
          <div className="glass-card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Service Provider</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{service.sellerName}</p>
                {service.sellerPhone && (
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {service.sellerPhone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Book CTA */}
          <div className="glass-card bg-gradient-to-br from-blue-500/10 to-purple-500/10">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Book This Service</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Select a date and time to get started</p>
            <Button
              icon={Calendar}
              className="w-full"
              onClick={() => isAuthenticated ? navigate(`/book/${id}`) : navigate('/login')}
            >
              {isAuthenticated ? 'Book Now' : 'Login to Book'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
