'use client';

import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

const categoryColors: Record<string, string> = {
  'Pothole': 'bg-red-500',
  'Streetlight': 'bg-yellow-500',
  'Water Leakage': 'bg-blue-500',
  'Waste/Garbage': 'bg-green-500',
  'Flooding': 'bg-purple-500',
  'Other': 'bg-gray-500',
};

const categoryEmojis: Record<string, string> = {
  'Pothole': '🕳️',
  'Streetlight': '💡',
  'Water Leakage': '💧',
  'Waste/Garbage': '🗑️',
  'Flooding': '🌊',
  'Other': '⚠️',
};

const statusColors: Record<string, string> = {
  'Open': 'bg-red-500/20 text-red-400 border border-red-500/30',
  'Verified': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  'In Progress': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  'Resolved': 'bg-green-500/20 text-green-400 border border-green-500/30',
};

export default function RecentIssues() {
  const [issues, setIssues] = useState<any[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'issues'),
      orderBy('createdAt', 'desc'),
      limit(6)
    );
    const unsub = onSnapshot(q, (snap) => {
      setIssues(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <section className="py-20 px-4 bg-[#0d1f38]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Live from the <span className="text-amber-400">Community</span>
          </h2>
          <p className="text-gray-400 text-lg">Real issues reported by real citizens</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.length === 0 && (
            <div className="col-span-3 text-center text-gray-400 py-20">
              Loading issues...
            </div>
          )}
          {issues.map((issue) => (
            <Link href={`/issues/${issue.id}`} key={issue.id}>
              <div className="bg-[#1a3c5e]/40 border border-white/10 rounded-2xl overflow-hidden hover:border-amber-400/50 hover:shadow-xl hover:shadow-amber-400/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                <div className="relative h-48 bg-gradient-to-br from-[#1a3c5e] to-[#0d1f38] flex items-center justify-center overflow-hidden">
                  {issue.imageBase64 ? (
                    <img
                      src={issue.imageBase64}
                      alt={issue.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl">
                      {categoryEmojis[issue.category] || '⚠️'}
                    </span>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className={`${categoryColors[issue.category] || 'bg-gray-500'} text-white text-xs px-2 py-1 rounded-full font-medium`}>
                      {categoryEmojis[issue.category]} {issue.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[issue.status] || ''}`}>
                      {issue.status}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">
                    {issue.title}
                  </h3>
                  <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                    {issue.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>📍 {issue.location?.city || 'Unknown'}</span>
                    <span>❤️ {issue.upvotes?.length || 0} upvotes</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/issues">
            <button className="bg-amber-400 hover:bg-amber-500 text-black font-bold px-8 py-3 rounded-full transition-all duration-200 hover:scale-105">
              View All Issues →
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}