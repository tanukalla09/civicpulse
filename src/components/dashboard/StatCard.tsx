'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string | number;
  trend?: 'up' | 'down' | 'neutral';
  trendText?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  glowColor?: string;
}

export default function StatCard({
  title,
  value,
  change,
  trend = 'neutral',
  trendText,
  icon: Icon,
  iconColor = 'text-amber-500',
  iconBgColor = 'bg-amber-500/10',
  glowColor = 'from-amber-500/10 to-transparent',
}: StatCardProps) {
  const isUp = trend === 'up';
  const isDown = trend === 'down';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative overflow-hidden rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/5 p-6 flex flex-col justify-between h-full"
    >
      {/* Glow effect on hover */}
      <div className={`absolute -right-16 -top-16 w-32 h-32 rounded-full bg-gradient-to-br ${glowColor} blur-2xl pointer-events-none opacity-50`} />

      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-slate-400 font-sans tracking-wide uppercase">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-slate-100 font-heading mt-1 tracking-tight">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl ${iconBgColor} ${iconColor} border border-white/5`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {(change !== undefined || trendText !== undefined) && (
        <div className="flex items-center gap-2 mt-2">
          {trend !== 'neutral' && (
            <span
              className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                isUp
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
            >
              {isUp ? (
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
              )}
              {change}
            </span>
          )}
          {trendText && (
            <span className="text-xs text-slate-500 font-medium">
              {trendText}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}
