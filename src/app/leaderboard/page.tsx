'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

function getBadge(points: number) {
  if (points >= 500) return { label: 'City Champion', emoji: '🏆' };
  if (points >= 201) return { label: 'Community Hero', emoji: '🦸' };
  if (points >= 51) return { label: 'Active Citizen', emoji: '⭐' };
  return { label: 'Newcomer', emoji: '🌱' };
}

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState('All');

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const snap = await getDocs(collection(db, 'issues'));
        const issues = snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];

        const userMap: Record<string, any> = {};
        issues.forEach(issue => {
          const uid = issue.reportedBy?.uid;
          if (!uid) return;
          if (!userMap[uid]) {
            userMap[uid] = {
              uid,
              name: issue.reportedBy?.name || 'Anonymous',
              photoURL: issue.reportedBy?.photoURL || '',
              city: issue.location?.city || 'Unknown',
              reports: 0,
              points: 0,
            };
          }
          userMap[uid].reports += 1;
          userMap[uid].points += 10;
        });

        const sorted = Object.values(userMap).sort((a, b) => b.points - a.points);
        setLeaders(sorted);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchLeaders();
  }, []);

  const cities = ['All', ...Array.from(new Set(leaders.map(l => l.city)))];
  const filtered = cityFilter === 'All' ? leaders : leaders.filter(l => l.city === cityFilter);
  const top3 = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  const podiumOrder = top3.length === 3 ? [top3[1], top3[0], top3[2]] : top3;
  const podiumHeights = ['h-24', 'h-32', 'h-16'];
  const podiumColors = ['bg-gray-400', 'bg-yellow-400', 'bg-amber-600'];
  const medals = ['🥈', '🥇', '🥉'];

  return (
    <div className="min-h-screen bg-[#0a1628]">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#0d1f38] to-[#0a1628] px-6 py-12 text-center border-b border-white/10">
        <h1 className="text-4xl font-bold text-white mb-2">🏆 Leaderboard</h1>
        <p className="text-gray-400">Top citizens making their cities better</p>

        {/* City Filter */}
        <div className="flex flex-wrap gap-2 justify-center mt-6">
          {cities.map(city => (
            <button
              key={city}
              onClick={() => setCityFilter(city)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                cityFilter === city ? 'bg-amber-400 text-black' : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {city === 'All' ? '🌏 All Cities' : `📍 ${city}`}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white/5 rounded-2xl h-20 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🏜️</p>
            <p className="text-white text-xl font-bold">No citizens yet!</p>
            <p className="text-gray-400 mt-2">Be the first hero in this city</p>
          </div>
        ) : (
          <>
            {/* Podium */}
            {top3.length === 3 && (
              <div className="flex items-end justify-center gap-4 mb-12">
                {podiumOrder.map((person, idx) => {
                  const badge = getBadge(person.points);
                  return (
                    <div key={person.uid} className="flex flex-col items-center gap-2">
                      <span className="text-2xl">{medals[idx]}</span>
                      {person.photoURL ? (
                        <img src={person.photoURL} alt={person.name}
                          className="w-14 h-14 rounded-full border-2 border-white/20" />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-amber-400 flex items-center justify-center text-black text-xl font-bold border-2 border-white/20">
                          {person.name?.[0] || 'U'}
                        </div>
                      )}
                      <p className="text-white text-xs font-bold text-center max-w-16 truncate">{person.name}</p>
                      <p className="text-amber-400 text-xs font-bold">{person.points} pts</p>
                      <div className={`${podiumHeights[idx]} ${podiumColors[idx]} w-20 rounded-t-xl flex items-start justify-center pt-2 opacity-80`}>
                        <span className="text-black font-bold text-lg">
                          {idx === 0 ? '2' : idx === 1 ? '1' : '3'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Full Rankings */}
            <div className="space-y-3">
              {filtered.map((person, idx) => {
                const badge = getBadge(person.points);
                const rankColors: Record<number, string> = {
                  0: 'border-yellow-400/50 bg-yellow-400/5',
                  1: 'border-gray-400/50 bg-gray-400/5',
                  2: 'border-amber-600/50 bg-amber-600/5',
                };
                return (
                  <div key={person.uid}
                    className={`flex items-center gap-4 bg-[#0d1f38] border rounded-2xl p-4 transition-all hover:scale-[1.01] ${rankColors[idx] || 'border-white/10'}`}>
                    {/* Rank */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 ${
                      idx === 0 ? 'bg-yellow-400 text-black' :
                      idx === 1 ? 'bg-gray-400 text-black' :
                      idx === 2 ? 'bg-amber-600 text-black' :
                      'bg-white/10 text-gray-400'
                    }`}>
                      {idx + 1}
                    </div>

                    {/* Avatar */}
                    {person.photoURL ? (
                      <img src={person.photoURL} alt={person.name} className="w-10 h-10 rounded-full flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-black font-bold flex-shrink-0">
                        {person.name?.[0] || 'U'}
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm truncate">{person.name}</p>
                      <p className="text-gray-400 text-xs">📍 {person.city} · {badge.emoji} {badge.label}</p>
                    </div>

                    {/* Stats */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-amber-400 font-bold text-lg">{person.points}</p>
                      <p className="text-gray-400 text-xs">{person.reports} reports</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}