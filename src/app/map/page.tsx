'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

export default function MapPage() {
  const [issues, setIssues] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const q = query(collection(db, 'issues'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setIssues(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const categories = ['All', 'Pothole', 'Streetlight', 'Water Leakage', 'Waste/Garbage', 'Flooding', 'Other'];
  const filtered = filter === 'All' ? issues : issues.filter(i => i.category === filter);

  const categoryEmojis: Record<string, string> = {
    'Pothole': '🕳️', 'Streetlight': '💡', 'Water Leakage': '💧',
    'Waste/Garbage': '🗑️', 'Flooding': '🌊', 'Other': '⚠️',
  };

  const statusColors: Record<string, string> = {
    'Open': 'text-red-400', 'Verified': 'text-yellow-400',
    'In Progress': 'text-blue-400', 'Resolved': 'text-green-400',
  };

  return (
    <div className="min-h-screen bg-[#0a1628] flex flex-col">
      <div className="bg-[#0d1f38] border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2 items-center justify-between">
          <h1 className="text-white font-bold text-xl">🗺️ Live Issues Map</h1>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  filter === cat
                    ? 'bg-amber-400 text-black'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {categoryEmojis[cat] || '🗂️'} {cat}
              </button>
            ))}
          </div>
          <span className="text-gray-400 text-sm">{filtered.length} issues</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Issues List */}
        <div className="w-full md:w-96 bg-[#0d1f38] border-r border-white/10 overflow-y-auto">
          {filtered.map((issue) => (
            <div
              key={issue.id}
              onClick={() => setSelected(issue)}
              className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-all ${
                selected?.id === issue.id ? 'bg-white/10 border-l-2 border-l-amber-400' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{categoryEmojis[issue.category] || '⚠️'}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white text-sm font-medium line-clamp-1">{issue.title}</h3>
                  <p className="text-gray-400 text-xs mt-1">📍 {issue.location?.address || issue.location?.city || 'Unknown'}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs font-medium ${statusColors[issue.status] || 'text-gray-400'}`}>
                      ● {issue.status}
                    </span>
                    <span className="text-gray-500 text-xs">❤️ {issue.upvotes?.length || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-8 text-center text-gray-400">
              <p className="text-4xl mb-4">🗺️</p>
              <p>No issues found for this filter</p>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div className="flex-1 bg-[#0a1628] flex items-center justify-center">
          {selected ? (
            <div className="max-w-lg w-full mx-4">
              <div className="bg-[#0d1f38] border border-white/10 rounded-2xl overflow-hidden">
                {selected.imageBase64 ? (
                  <img src={selected.imageBase64} alt={selected.title} className="w-full h-48 object-cover" />
                ) : (
                  <div className="h-48 bg-gradient-to-br from-[#1a3c5e] to-[#0d1f38] flex items-center justify-center">
                    <span className="text-6xl">{categoryEmojis[selected.category] || '⚠️'}</span>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-white font-bold text-lg">{selected.title}</h2>
                    <span className={`text-sm font-medium ${statusColors[selected.status]}`}>● {selected.status}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{selected.description}</p>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-gray-400 text-xs">Category</p>
                      <p className="text-white text-sm font-medium">{categoryEmojis[selected.category]} {selected.category}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-gray-400 text-xs">Severity</p>
                      <p className="text-white text-sm font-medium">{'⭐'.repeat(selected.severity || 1)}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-gray-400 text-xs">Location</p>
                      <p className="text-white text-sm font-medium">{selected.location?.city || 'Unknown'}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-gray-400 text-xs">Upvotes</p>
                      <p className="text-white text-sm font-medium">❤️ {selected.upvotes?.length || 0}</p>
                    </div>
                  </div>
                  <Link href={`/issues/${selected.id}`}>
                    <button className="w-full bg-amber-400 hover:bg-amber-500 text-black font-bold py-3 rounded-xl transition-all">
                      View Full Report →
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <p className="text-6xl mb-4">👆</p>
              <p className="text-lg font-medium text-white">Select an issue from the list</p>
              <p className="text-sm mt-2">Click any issue on the left to see details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}