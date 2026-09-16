'use client';

import React from 'react';

interface SkeletonCardProps {
  className?: string;
}

export default function SkeletonCard({ className = '' }: SkeletonCardProps) {
  return (
    <div
      className={`w-full rounded-2xl bg-slate-800/40 border border-slate-700/40 p-5 backdrop-blur-md shadow-lg flex flex-col gap-4 animate-pulse ${className}`}
    >
      {/* Header: Profile & Author details */}
      <div className="flex items-start justify-between w-full">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-slate-700/60" />
          
          {/* Name & Time */}
          <div className="flex flex-col gap-1.5">
            <div className="w-28 h-3.5 rounded bg-slate-700/60" />
            <div className="w-20 h-3 rounded bg-slate-700/40" />
          </div>
        </div>

        {/* Category Badge */}
        <div className="w-24 h-6 rounded-full bg-slate-700/50" />
      </div>

      {/* Body: Title & Description */}
      <div className="flex flex-col gap-2.5 mt-1">
        {/* Title */}
        <div className="w-3/4 h-5 rounded bg-slate-700/60" />
        
        {/* Description lines */}
        <div className="space-y-2">
          <div className="w-full h-3.5 rounded bg-slate-700/40" />
          <div className="w-5/6 h-3.5 rounded bg-slate-700/40" />
        </div>
      </div>

      {/* Optional Image Placeholder */}
      <div className="w-full h-48 rounded-xl bg-slate-700/30 border border-slate-700/20" />

      {/* Divider */}
      <div className="h-[1px] w-full bg-slate-700/30 my-1" />

      {/* Footer: Stats & Actions */}
      <div className="flex items-center justify-between mt-1">
        {/* Left: Upvotes & Comments */}
        <div className="flex items-center gap-4">
          {/* Upvote */}
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded bg-slate-700/50" />
            <div className="w-8 h-3.5 rounded bg-slate-700/40" />
          </div>
          
          {/* Comment */}
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded bg-slate-700/50" />
            <div className="w-8 h-3.5 rounded bg-slate-700/40" />
          </div>
        </div>

        {/* Right: Severity and Status */}
        <div className="flex items-center gap-3">
          {/* Severity Stars */}
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-3.5 h-3.5 rounded-full bg-slate-700/40" />
            ))}
          </div>
          
          {/* Status Pill */}
          <div className="w-16 h-5 rounded-full bg-slate-700/50" />
        </div>
      </div>
    </div>
  );
}
