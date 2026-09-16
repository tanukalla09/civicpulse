'use client';

import React from 'react';
import { Category } from '@/types';
import { getCategoryInfo } from '@/lib/constants';
import { motion } from 'framer-motion';

interface CategoryBadgeProps {
  category: Category;
  className?: string;
  showEmoji?: boolean;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

export default function CategoryBadge({
  category,
  className = '',
  showEmoji = true,
  size = 'md',
  interactive = true,
}: CategoryBadgeProps) {
  const info = getCategoryInfo(category);

  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-[11px] gap-1',
    md: 'px-3 py-1 text-xs gap-1.5',
    lg: 'px-4 py-1.5 text-sm gap-2',
  };

  const badgeContent = (
    <span
      className={`inline-flex items-center font-medium rounded-full border backdrop-blur-md transition-shadow duration-300 shadow-sm ${
        sizeClasses[size]
      } ${info.bgColor} ${className}`}
      style={{
        borderColor: `${info.color}33`, // 20% opacity of the category color
        color: info.color,
        textShadow: '0 1px 2px rgba(0,0,0,0.1)',
      }}
    >
      {showEmoji && (
        <span className="flex items-center justify-center filter drop-shadow-sm select-none">
          {info.emoji}
        </span>
      )}
      <span className="font-body tracking-wider uppercase text-[10px] font-semibold opacity-90">
        {info.name}
      </span>
    </span>
  );

  if (interactive) {
    return (
      <motion.div
        className="inline-block"
        whileHover={{ scale: 1.04, y: -1 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {badgeContent}
      </motion.div>
    );
  }

  return badgeContent;
}
