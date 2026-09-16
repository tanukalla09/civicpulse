'use client';

import React from 'react';
import Link from 'next/link';
import { Issue } from '@/types';
import CategoryBadge from '../shared/CategoryBadge';
import StatusPill from '../shared/StatusPill';
import { ArrowRight, ThumbsUp, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface MarkerPopupProps {
  issue: Issue;
}

export default function MarkerPopup({ issue }: MarkerPopupProps) {
  return (
    <div className="w-64 p-1 text-slate-100 bg-[#1e293b] rounded-lg overflow-hidden">
      {issue.imageBase64 ? (
        <div className="relative h-28 w-full rounded-md overflow-hidden bg-slate-800 border border-white/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={issue.imageBase64}
            alt={issue.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="h-24 w-full rounded-md bg-slate-800 flex items-center justify-center text-slate-500 text-xs border border-white/5">
          No image provided
        </div>
      )}

      <div className="mt-2.5 space-y-2">
        {/* Badges */}
        <div className="flex flex-wrap gap-1 items-center">
          <CategoryBadge category={issue.category} size="sm" interactive={false} />
          <StatusPill status={issue.status} size="sm" showEmoji={false} />
        </div>

        {/* Title */}
        <h3 className="font-heading font-semibold text-sm text-white line-clamp-1">
          {issue.title}
        </h3>

        {/* Location Info */}
        <div className="flex items-center text-[11px] text-slate-400 gap-1">
          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
          <span className="truncate">{issue.location.address}</span>
        </div>

        {/* Footer info: Upvotes & Link */}
        <div className="flex items-center justify-between pt-1 border-t border-white/5">
          <div className="flex items-center gap-1 text-xs text-slate-300">
            <ThumbsUp className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-semibold">{issue.upvotes?.length || 0}</span>
          </div>

          <Link href={`/issues/${issue.id}`}>
            <motion.span
              whileHover={{ x: 2 }}
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 cursor-pointer"
            >
              <span>Details</span>
              <ArrowRight className="w-3 h-3" />
            </motion.span>
          </Link>
        </div>
      </div>
    </div>
  );
}
