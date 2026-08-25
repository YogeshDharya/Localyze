import React from 'react';
import { Star, StarHalf } from 'lucide-react';

const StarRating = ({ rating, size = 'sm', showCount = false, count = 0, className = '' }) => {
  const sizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const starSize = sizes[size] || sizes.sm;
  const fullStars = Math.floor(rating || 0);
  const hasHalfStar = (rating || 0) % 1 >= 0.5;
  const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={starSize} className="fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf size={starSize} className="fill-yellow-400 text-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={starSize} className="text-gray-300 dark:text-gray-600" />
        ))}
      </div>
      {showCount && (
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
          ({count} {count === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
};

export default StarRating;
