'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface SeverityStarsProps {
  severity: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

export default function SeverityStars({
  severity,
  maxStars = 5,
  size = 'md',
  interactive = false,
  onChange,
  className = '',
}: SeverityStarsProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const starSizes = {
    sm: 14,
    md: 18,
    lg: 24,
  };

  const currentRating = hoveredRating !== null ? hoveredRating : severity;

  const handleStarClick = (rating: number) => {
    if (interactive && onChange) {
      onChange(rating);
    }
  };

  const getSeverityLabel = (rating: number) => {
    const labels = ['Minor', 'Low', 'Moderate', 'High', 'Critical'];
    return labels[rating - 1] || '';
  };

  const getSeverityColor = (rating: number) => {
    switch (rating) {
      case 1:
        return 'text-green-400';
      case 2:
        return 'text-blue-400';
      case 3:
        return 'text-yellow-400';
      case 4:
        return 'text-orange-400';
      case 5:
        return 'text-red-500';
      default:
        return 'text-amber-500';
    }
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-center gap-1">
        {Array.from({ length: maxStars }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= currentRating;
          const starColor = isFilled ? getSeverityColor(currentRating) : 'text-slate-600';

          return (
            <motion.button
              key={index}
              type="button"
              disabled={!interactive}
              onClick={() => handleStarClick(starValue)}
              onMouseEnter={() => interactive && setHoveredRating(starValue)}
              onMouseLeave={() => interactive && setHoveredRating(null)}
              className={`${
                interactive ? 'cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-500 rounded' : 'cursor-default'
              } transition-colors duration-200`}
              whileHover={interactive ? { scale: 1.2, rotate: 5 } : {}}
              whileTap={interactive ? { scale: 0.9 } : {}}
            >
              <Star
                size={starSizes[size]}
                className={`transition-all duration-300 ${
                  isFilled ? 'fill-current' : 'fill-none'
                } ${starColor}`}
              />
            </motion.button>
          );
        })}

        {interactive && currentRating > 0 && (
          <motion.span
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className={`text-xs font-semibold ml-2 font-body px-2 py-0.5 rounded bg-slate-800 border border-slate-700/50 ${getSeverityColor(
              currentRating
            )}`}
          >
            {getSeverityLabel(currentRating)}
          </motion.span>
        )}
      </div>
    </div>
  );
}
