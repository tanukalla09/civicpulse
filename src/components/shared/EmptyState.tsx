'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: LucideIcon;
  illustrationType?: 'search' | 'issues' | 'notifications' | 'general';
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon,
  illustrationType = 'general',
}: EmptyStateProps) {
  
  // Custom SVGs based on illustration type
  const renderIllustration = () => {
    switch (illustrationType) {
      case 'search':
        return (
          <svg className="w-48 h-48 text-slate-700" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="90" r="40" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeDasharray="6 6" />
            <circle cx="100" cy="90" r="30" fill="url(#navyGradient)" opacity="0.1" />
            <path d="M130 120L165 155" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" />
            <rect x="50" y="150" width="100" height="4" rx="2" fill="currentColor" opacity="0.3" />
            <rect x="70" y="162" width="60" height="4" rx="2" fill="currentColor" opacity="0.2" />
            <defs>
              <linearGradient id="navyGradient" x1="100" y1="60" x2="100" y2="120" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1a3c5e" />
                <stop offset="1" stopColor="#0f172a" />
              </linearGradient>
            </defs>
          </svg>
        );
      case 'issues':
        return (
          <svg className="w-48 h-48 text-slate-700" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* City Silhouette Background */}
            <path d="M20 160H180V130H150V100H120V120H90V80H60V110H40V140H20V160Z" fill="currentColor" opacity="0.1" />
            {/* Floating Shield/Check */}
            <motion.g
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            >
              <path d="M100 40L140 55V95C140 120 123 143 100 150C77 143 60 120 60 95V55L100 40Z" fill="url(#navyGradient)" stroke="#1a3c5e" strokeWidth="4" />
              <path d="M85 95L95 105L115 85" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </motion.g>
            <defs>
              <linearGradient id="navyGradient" x1="100" y1="40" x2="100" y2="150" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1e293b" />
                <stop offset="1" stopColor="#0f172a" />
              </linearGradient>
            </defs>
          </svg>
        );
      case 'notifications':
        return (
          <svg className="w-48 h-48 text-slate-700" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.g
              animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', repeatDelay: 2 }}
              style={{ originX: '100px', originY: '60px' }}
            >
              <path d="M100 50C78 50 60 68 60 90V130H140V90C140 68 122 50 100 50Z" fill="url(#navyGradient)" stroke="currentColor" strokeWidth="4" />
              <path d="M50 130H150" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
              <path d="M90 145C90 150.5 94.5 155 100 155C105.5 155 110 150.5 110 145" fill="#f59e0b" />
            </motion.g>
            <circle cx="135" cy="65" r="10" fill="#f59e0b" />
            <defs>
              <linearGradient id="navyGradient" x1="100" y1="50" x2="100" y2="130" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1a3c5e" />
                <stop offset="1" stopColor="#1e293b" />
              </linearGradient>
            </defs>
          </svg>
        );
      default:
        return (
          <svg className="w-48 h-48 text-slate-700" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.circle
              cx="100"
              cy="100"
              r="60"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="5 5"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
            />
            <motion.g
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            >
              <rect x="75" y="65" width="50" height="70" rx="8" fill="url(#navyGradient)" stroke="currentColor" strokeWidth="4" />
              <line x1="87" y1="85" x2="113" y2="85" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
              <line x1="87" y1="100" x2="113" y2="100" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
              <line x1="87" y1="115" x2="103" y2="115" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
            </motion.g>
            <defs>
              <linearGradient id="navyGradient" x1="100" y1="65" x2="100" y2="135" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1e293b" />
                <stop offset="1" stopColor="#0f172a" />
              </linearGradient>
            </defs>
          </svg>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center text-center p-8 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-md max-w-lg mx-auto shadow-xl"
    >
      <div className="relative mb-6 flex items-center justify-center">
        {/* Background glow */}
        <div className="absolute inset-0 bg-blue-500/5 rounded-full blur-3xl" />
        {renderIllustration()}
        {Icon && (
          <div className="absolute bottom-4 right-4 bg-slate-800 p-2.5 rounded-xl border border-slate-700 shadow-lg text-amber-500">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <h3 className="font-heading text-xl font-bold text-slate-100 tracking-tight mb-2">
        {title}
      </h3>
      
      <p className="font-body text-sm text-slate-400 max-w-sm leading-relaxed mb-6">
        {description}
      </p>

      {actionLabel && onAction && (
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(245, 158, 11, 0.2)' }}
          whileTap={{ scale: 0.98 }}
          onClick={onAction}
          className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-sm font-semibold rounded-xl shadow-lg transition-all duration-200 cursor-pointer font-body"
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
}
