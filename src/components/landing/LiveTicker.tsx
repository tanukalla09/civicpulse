'use client';

import React, { useEffect, useState } from 'react';
import { subscribeToIssues } from '@/lib/firestore';
import { Issue } from '@/types';

export default function LiveTicker() {
  const [tickerItems, setTickerItems] = useState<string[]>([
    '🚨 New issue reported in Koramangala',
    '✅ Pothole fixed in Adyar',
    '🔍 3 citizens verified water leak in Banjara Hills',
    '💡 Streetlight fixed in T. Nagar',
    '🌊 Flooding reported in Gachibowli',
  ]);

  useEffect(() => {
    const unsubscribe = subscribeToIssues((issues) => {
      if (issues.length === 0) return;

      // Generate dynamic ticker items from real Firestore data
      const dynamicItems: string[] = [];
      
      // Get top 8 most interesting recent events
      const sortedIssues = [...issues].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 8);
      
      sortedIssues.forEach((issue) => {
        const area = issue.location.address.split(',')[0] || issue.location.city;
        
        if (issue.status === 'Resolved') {
          dynamicItems.push(`✅ ${issue.category} resolved in ${area}`);
        } else if (issue.status === 'Verified') {
          dynamicItems.push(`🔍 ${issue.category} verified by community in ${area}`);
        } else if (issue.verifiedBy && issue.verifiedBy.length > 0) {
          dynamicItems.push(`🔍 ${issue.verifiedBy.length} citizen${issue.verifiedBy.length > 1 ? 's' : ''} verified ${issue.category.toLowerCase()} in ${area}`);
        } else {
          dynamicItems.push(`🚨 New ${issue.category.toLowerCase()} reported in ${area}`);
        }
      });

      // Pad with default items if we don't have enough data
      if (dynamicItems.length < 5) {
        setTickerItems([...dynamicItems, ...tickerItems.slice(0, 5 - dynamicItems.length)]);
      } else {
        setTickerItems(dynamicItems);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="w-full bg-slate-900 border-b border-white/5 overflow-hidden py-2.5 text-xs text-slate-300 select-none relative z-40">
      {/* Gradients to fade the edges */}
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />

      {/* Marquee Container */}
      <div className="flex whitespace-nowrap animate-marquee">
        <div className="flex items-center space-x-12 shrink-0 pr-12">
          {tickerItems.map((item, index) => (
            <span key={`ticker-1-${index}`} className="flex items-center space-x-2 font-medium">
              <span>{item}</span>
            </span>
          ))}
        </div>
        {/* Duplicate the items for seamless loop */}
        <div className="flex items-center space-x-12 shrink-0 pr-12" aria-hidden="true">
          {tickerItems.map((item, index) => (
            <span key={`ticker-2-${index}`} className="flex items-center space-x-2 font-medium">
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
