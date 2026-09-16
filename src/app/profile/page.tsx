'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const categoryEmojis: Record<string, string> = {
  'Pothole': '🕳️', 'Streetlight': '💡', 'Water Leakage': '💧',
  'Waste/Garbage': '🗑️', 'Flooding': '🌊', 'Other': '⚠️',
};

const statusColors: Record<string, string> = {
  'Open': 'bg-red-500/20 text-red-400',
  'Verified': 'bg-yellow-500/20 text-yellow-400',
  'In Progress': 'bg-blue-500/20 text-blue-400',
  'Resolved': 'bg-green-500/20 text-green-400',
};

function getBadge(points: number) {
  if (points >= 500) return { label: 'City Champion', emoji: '🏆', color: 'text-yellow-400' };
  if (points >= 201) return { label: 'Community Hero', emoji: '🦸', color: 'text-purple-400' };
  if (points >= 51) return { label: 'Active Citizen', emoji: '⭐', color: 'text-blue-400' };
  return { label: 'Newcomer', emoji: '🌱', color: 'text-green-400' };
}

const allBadges = [
  { emoji: '🌱', label: 'Newcomer', desc: 'Join CivicPulse', points: 0 },
  { emoji: '⭐', label: 'Active Citizen', desc: 'Earn 51+ points', points: 51 },
  { emoji: '🦸', label: 'Community Hero', desc: 'Earn 201+ points', points: 201 },
  { emoji: '🏆', label: 'City Champion', desc: 'Earn 500+ points', points: 500 },
  { emoji: '🔥', label: 'Streak Warrior', desc: 'Report 7 days in a row', points: 999 },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [myIssues, setMyIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchIssues = async () => {
      try {
        const q = query(
          collection(db, 'issues'),
          where('reportedBy.uid', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        setMyIssues(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchIssues();
  }, [user]);

  if (!user) return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
      <div className="text-center bg-[#0d1f38] border border-white/10 rounded-2xl p-10">
        <p className="text-5xl mb-4">🔒</p>
        <h2 className="text-white text-2xl font-bold mb-2">Login Required</h2>
        <p className="text-gray-400 mb-6">Please login to view your profile</p>
        <button onClick={() => router.push('/')} className="bg-amber-400 text-black font-bold px-6 py-3 rounded-xl">
          Go to Home
        </button>
      </div>
    </div>
  );

  const points = myIssues.length * 10;
  const badge = getBadge(points);
  const resolved = myIssues.filter(i => i.status === 'Resolved').length;
  const verified = myIssues.filter(i => (i.verifiedBy?.length || 0) > 0).length;

  const timeAgo = (ts: any) => {
    if (!ts) return 'Recently';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="min-h-screen bg-[#0a1628]">
      {/* Cover Banner */}
      <div className="h-40 bg-gradient-to-r from-[#1a3c5e] via-[#0d1f38] to-amber-900/30 relative">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #f59e0b 0%, transparent 50%), radial-gradient(circle at 80% 50%, #1a3c5e 0%, transparent 50%)' }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-16 pb-12">
        {/* Avatar & Name */}
        <div className="flex flex-col md:flex-row items-start md:items-end gap-4 mb-8">
          <div className="relative">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || ''} className="w-24 h-24 rounded-2xl border-4 border-[#0a1628] shadow-xl" />
            ) : (
              <div className="w-24 h-24 rounded-2xl border-4 border-[#0a1628] bg-amber-400 flex items-center justify-center text-black text-3xl font-bold shadow-xl">
                {user.displayName?.[0] || 'U'}
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 bg-[#0d1f38] border border-white/10 rounded-lg px-2 py-0.5 text-xs text-amber-400 font-bold">
              {badge.emoji} {badge.label}
            </div>
          </div>
          <div className="flex-1 mt-4 md:mt-0">
            <h1 className="text-white text-2xl font-bold">{user.displayName || 'Anonymous'}</h1>
            <p className="text-gray-400 text-sm">{user.email}</p>
          </div>
          <Link href="/report">
            <button className="bg-amber-400 hover:bg-amber-500 text-black font-bold px-6 py-2 rounded-xl transition-all">
              + Report Issue
            </button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Issues Filed', value: myIssues.length, emoji: '📝' },
            { label: 'Resolved', value: resolved, emoji: '✅' },
            { label: 'Verified', value: verified, emoji: '👁️' },
            { label: 'Points', value: points, emoji: '⚡' },
          ].map(stat => (
            <div key={stat.label} className="bg-[#0d1f38] border border-white/10 rounded-2xl p-5 text-center hover:border-amber-400/30 transition-all">
              <p className="text-3xl mb-2">{stat.emoji}</p>
              <p className="text-white text-2xl font-bold">{stat.value}</p>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Badges */}
          <div className="bg-[#0d1f38] border border-white/10 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-4">🏅 Badges</h2>
            <div className="space-y-3">
              {allBadges.map(b => {
                const unlocked = points >= b.points;
                return (
                  <div key={b.label} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${unlocked ? 'bg-amber-400/10 border border-amber-400/20' : 'bg-white/5 opacity-50'}`}>
                    <span className={`text-2xl ${!unlocked ? 'grayscale' : ''}`}>{b.emoji}</span>
                    <div>
                      <p className={`text-sm font-bold ${unlocked ? 'text-white' : 'text-gray-500'}`}>{b.label}</p>
                      <p className="text-xs text-gray-400">{b.desc}</p>
                    </div>
                    {unlocked && <span className="ml-auto text-green-400 text-xs font-bold">✓</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Points Progress */}
          <div className="bg-[#0d1f38] border border-white/10 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-4">⚡ Points Progress</h2>
            <div className="text-center mb-6">
              <p className="text-5xl font-bold text-amber-400">{points}</p>
              <p className="text-gray-400 text-sm mt-1">Total Points</p>
              <p className={`text-lg font-bold mt-2 ${badge.color}`}>{badge.emoji} {badge.label}</p>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Next: Active Citizen', current: points, max: 51, color: 'bg-blue-400' },
                { label: 'Next: Community Hero', current: points, max: 201, color: 'bg-purple-400' },
                { label: 'Next: City Champion', current: points, max: 500, color: 'bg-yellow-400' },
              ].map(bar => (
                <div key={bar.label}>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>{bar.label}</span>
                    <span>{Math.min(bar.current, bar.max)}/{bar.max}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className={`${bar.color} h-2 rounded-full transition-all`}
                      style={{ width: `${Math.min(100, (bar.current / bar.max) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-white/5 rounded-xl p-3 text-xs text-gray-400 space-y-1">
              <p>📝 Report an issue = <span className="text-amber-400 font-bold">+10 pts</span></p>
              <p>✅ Verify an issue = <span className="text-amber-400 font-bold">+5 pts</span></p>
              <p>💬 Leave a comment = <span className="text-amber-400 font-bold">+2 pts</span></p>
              <p>❤️ Upvote an issue = <span className="text-amber-400 font-bold">+1 pt</span></p>
            </div>
          </div>

          {/* My Issues */}
          <div className="bg-[#0d1f38] border border-white/10 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-4">📋 My Reports ({myIssues.length})</h2>
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white/5 rounded-xl h-16 animate-pulse" />
                ))}
              </div>
            ) : myIssues.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-gray-400 text-sm">No reports yet</p>
                <Link href="/report">
                  <button className="mt-3 bg-amber-400 text-black text-xs font-bold px-4 py-2 rounded-lg">
                    File First Report
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {myIssues.map(issue => (
                  <Link href={`/issues/${issue.id}`} key={issue.id}>
                    <div className="bg-white/5 hover:bg-white/10 rounded-xl p-3 transition-all cursor-pointer border border-white/5 hover:border-amber-400/20">
                      <div className="flex items-start gap-2">
                        <span className="text-lg">{categoryEmojis[issue.category] || '⚠️'}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs font-medium line-clamp-1">{issue.title}</p>
                          <p className="text-gray-500 text-xs mt-0.5">{timeAgo(issue.createdAt)}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${statusColors[issue.status] || ''}`}>
                          {issue.status}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}