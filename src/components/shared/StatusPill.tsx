'use client';

import React from 'react';
import { Status } from '@/types';
import { getStatusConfig } from '@/lib/constants';
import { motion } from 'framer-motion';

interface StatusPillProps {
  status: Status;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showEmoji?: boolean;
}

export default function StatusPill({
  status,
  className = '',
  size = 'md',
  showEmoji = true,
}: StatusPillProps) {
  const config = getStatusConfig(status);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm gap-2',
  };

  const dotColors = {
    'Open': 'bg-red-500',
    'Verified': 'bg-yellow-500',
    'In Progress': 'bg-blue-500',
    'Resolved': 'bg-green-500',
  };

  const activeDotColor = dotColors[status] || 'bg-gray-500';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center font-semibold rounded-full border backdrop-blur-md shadow-sm select-none ${
        sizeClasses[size]
      } ${config.bgColor} ${className}`}
      style={{
        borderColor: `${config.color}33`, // 20% opacity border
      }}
    >
      {showEmoji && (
        <span className="text-xs filter drop-shadow-sm leading-none flex items-center justify-center">
          {config.emoji}
        </span>
      )}
      {!showEmoji && (
        <span className="relative flex h-1.5 w-1.5">
          {status !== 'Resolved' && (
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${activeDotColor}`}></span>
          )}
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${activeDotColor}`}></span>
        </span>
      )}
      <span className="font-body tracking-wider uppercase text-[10px] font-bold opacity-95">
        {status}
      </span>
    </motion.div>
  );
}
