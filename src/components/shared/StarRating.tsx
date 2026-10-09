'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  totalReviews?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 'md',
  showNumber = true,
  totalReviews,
  interactive = false,
  onChange,
}) => {
  const sizeMap = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxStars }).map((_, i) => {
          const filled = i < Math.floor(rating);
          const half = !filled && i < rating;
          const starIcon = (
            <Star
              className={`${sizeMap[size]} ${
                filled
                  ? 'fill-amber-400 text-amber-400'
                  : half
                  ? 'fill-amber-400/50 text-amber-400'
                  : 'text-stone-300'
              }`}
            />
          );

          if (!interactive) {
            return (
              <span key={i} className="inline-flex">
                {starIcon}
              </span>
            );
          }

          return (
            <button
              type="button"
              key={i}
              onClick={() => onChange && onChange(i + 1)}
              className="cursor-pointer hover:scale-110 transition-transform"
              aria-label={`${i + 1} Star`}
            >
              {starIcon}
            </button>
          );
        })}
      </div>
      {showNumber && (
        <span className="text-xs font-semibold text-brand-slate ml-0.5">
          {rating.toFixed(1)}
        </span>
      )}
      {totalReviews !== undefined && (
        <span className="text-xs text-brand-muted">
          ({totalReviews})
        </span>
      )}
    </div>
  );
};

export default StarRating;
