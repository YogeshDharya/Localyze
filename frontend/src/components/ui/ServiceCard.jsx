import React from 'react';
import { MapPin } from 'lucide-react';
import StarRating from './StarRating';
import Badge from './Badge';

const ServiceCard = ({ service, onClick }) => {
  if (!service) return null;

  const imageUrl = service.imageUrls && service.imageUrls.length > 0 
    ? service.imageUrls[0] 
    : null;

  return (
    <div 
      onClick={() => onClick && onClick(service)}
      className="glass overflow-hidden rounded-xl hover:scale-[1.02] transition-transform duration-300 cursor-pointer flex flex-col h-full"
    >
      <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-800">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={service.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 opacity-80" />
        )}
        <div className="absolute top-3 left-3">
          <Badge variant="primary">{service.categoryName}</Badge>
        </div>
        {service.distanceKm !== undefined && (
          <div className="absolute top-3 right-3">
            <Badge variant="info" className="flex items-center gap-1 shadow-sm">
              <MapPin size={12} />
              {service.distanceKm.toFixed(1)} km
            </Badge>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
            {service.title}
          </h3>
          <span className="font-bold text-primary-600 dark:text-primary-400 whitespace-nowrap">
            ${service.price}<span className="text-sm font-normal text-gray-500 dark:text-gray-400">/{service.priceUnit}</span>
          </span>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 flex-grow">
          by {service.providerName}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-white/10">
          <StarRating rating={service.averageRating || 0} count={service.totalReviews || 0} showCount />
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <MapPin size={14} className="mr-1" />
            {service.city}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
