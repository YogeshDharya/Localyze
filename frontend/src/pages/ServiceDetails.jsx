import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { serviceService } from '../services/serviceService';
import { reviewService } from '../services/reviewService';
import { useAuth } from '../contexts/AuthContext';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import StarRating from '../components/ui/StarRating';
import Badge from '../components/ui/Badge';
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchServiceData();
  }, [id]);

  const fetchServiceData = async () => {
    try {
      const [serviceData, reviewsData] = await Promise.all([
        serviceService.getById(id),
        reviewService.getByService(id, 0, 10) // fetch first page of reviews
      ]);
      setService(serviceData);
      setReviews(reviewsData.content || []);
    } catch (err) {
      console.error('Failed to load service details', err);
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (service?.imageUrls?.length) {
      setCurrentImageIndex((prev) => (prev + 1) % service.imageUrls.length);
    }
  };

  const prevImage = () => {
    if (service?.imageUrls?.length) {
      setCurrentImageIndex((prev) => (prev - 1 + service.imageUrls.length) % service.imageUrls.length);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-96 bg-white/5 rounded-2xl mb-8"></div>
        <div className="h-12 bg-white/5 w-1/2 rounded mb-4"></div>
        <div className="h-6 bg-white/5 w-1/4 rounded mb-8"></div>
        <div className="space-y-4">
          <div className="h-4 bg-white/5 rounded w-full"></div>
          <div className="h-4 bg-white/5 rounded w-5/6"></div>
          <div className="h-4 bg-white/5 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white mb-4">Service not found</h2>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Image Gallery */}
      <div className="relative h-[400px] sm:h-[500px] rounded-2xl overflow-hidden group">
        {service.imageUrls && service.imageUrls.length > 0 ? (
          <>
            <img 
              src={service.imageUrls[currentImageIndex]} 
              alt={service.title}
              className="w-full h-full object-cover"
            />
            {service.imageUrls.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {service.imageUrls.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`w-2 h-2 rounded-full ${idx === currentImageIndex ? 'bg-blue-500' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-white/5 flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Header Info */}
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant="primary">{service.categoryName}</Badge>
              <span className="text-gray-400">•</span>
              <span className="text-gray-300 font-medium">By {service.providerName}</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{service.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-gray-300">
              <div className="flex items-center gap-2">
                <StarRating rating={service.averageRating} size="lg" />
                <span>({service.totalReviews} reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span>{service.city}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">About this service</h2>
            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
              {service.description}
            </p>
          </GlassCard>

          {/* Location / Map Placeholder */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Location</h2>
            <p className="text-gray-300 mb-4">{service.address}</p>
            <div className="w-full h-64 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                Map: {service.latitude}, {service.longitude}
              </div>
            </div>
          </GlassCard>

          {/* Reviews */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Reviews</h2>
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-white/10 pb-6 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-medium text-white block">{review.userName}</span>
                        <span className="text-sm text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="text-gray-300 mt-2">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-4">No reviews yet.</p>
            )}
          </GlassCard>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <GlassCard className="p-6 sticky top-8">
            <div className="text-center mb-6">
              <span className="text-3xl font-bold text-white">₹{service.price}</span>
              <span className="text-gray-400 ml-2">/ {service.priceUnit}</span>
            </div>
            
            {user?.role === 'USER' ? (
              <Button 
                variant="primary" 
                fullWidth 
                size="lg"
                onClick={() => navigate(`/book/${service.id}`)}
              >
                Book Now
              </Button>
            ) : !user ? (
              <Button 
                variant="outline" 
                fullWidth 
                onClick={() => navigate('/login')}
              >
                Login to Book
              </Button>
            ) : (
              <p className="text-sm text-center text-gray-400">
                You must be a customer to book this service.
              </p>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
