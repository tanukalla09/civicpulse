'use client';

import { useEffect, useState } from 'react';
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove, addDoc, collection, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const categoryEmojis: Record<string, string> = {
  'Pothole': '🕳️', 'Streetlight': '💡', 'Water Leakage': '💧',
  'Waste/Garbage': '🗑️', 'Flooding': '🌊', 'Other': '⚠️',
};

const statusSteps = ['Open', 'Verified', 'In Progress', 'Resolved'];

const statusColors: Record<string, string> = {
  'Open': 'text-red-400', 'Verified': 'text-yellow-400',
  'In Progress': 'text-blue-400', 'Resolved': 'text-green-400',
};

export default function IssueDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [issue, setIssue] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const unsub = onSnapshot(doc(db, 'issues', id as string), (snap) => {
      if (snap.exists()) setIssue({ id: snap.id, ...snap.data() });
      setLoading(false);
    });
    return () => unsub();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const q = query(collection(db, 'issues', id as string, 'comments'), orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      setComments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [id]);

  const handleUpvote = async () => {
    if (!user || !issue) return;
    const ref = doc(db, 'issues', issue.id);
    const hasUpvoted = issue.upvotes?.includes(user.uid);
    await updateDoc(ref, {
      upvotes: hasUpvoted ? arrayRemove(user.uid) : arrayUnion(user.uid)
    });
  };

  const handleVerify = async () => {
    if (!user || !issue) return;
    const ref = doc(db, 'issues', issue.id);
    const hasVerified = issue.verifiedBy?.includes(user.uid);
    await updateDoc(ref, {
      verifiedBy: hasVerified ? arrayRemove(user.uid) : arrayUnion(user.uid)
    });
  };

  const handleComment = async () => {
    if (!user || !comment.trim() || !id) return;
    await addDoc(collection(db, 'issues', id as string, 'comments'), {
      text: comment.trim(),
      userId: user.uid,
      userName: user.displayName || 'Anonymous',
      userPhoto: user.photoURL || '',
      createdAt: serverTimestamp(),
    });
    setComment('');
  };

  const timeAgo = (ts: any) => {
    if (!ts) return 'Recently';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const handleEscalate = () => {
    if (!issue) return;
    const subject = encodeURIComponent(`Civic Issue Report: ${issue.title}`);
    const body = encodeURIComponent(`Dear Authority,\n\nI am writing to report a civic issue in our community.\n\nIssue: ${issue.title}\nCategory: ${issue.category}\nLocation: ${issue.location?.address || issue.location?.city}\nSeverity: ${issue.severity}/5\nStatus: ${issue.status}\nDescription: ${issue.description}\n\nThis issue has been verified by ${issue.verifiedBy?.length || 0} citizens and upvoted by ${issue.upvotes?.length || 0} people.\n\nPlease take immediate action.\n\nThank you.`);
    window.open(`mailto:authority@municipalcorp.gov.in?subject=${subject}&body=${body}`);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
      <div className="text-white text-xl animate-pulse">Loading issue...</div>
    </div>
  );

  if (!issue) return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
      <div className="text-center">
        <p className="text-6xl mb-4">😕</p>
        <p className="text-white text-xl">Issue not found</p>
        <Link href="/issues"><button className="mt-4 bg-amber-400 text-black px-6 py-2 rounded-full font-bold">Back to Issues</button></Link>
      </div>
    </div>
  );

  const currentStep = statusSteps.indexOf(issue.status);
  const hasUpvoted = user && issue.upvotes?.includes(user.uid);
  const hasVerified = user && issue.verifiedBy?.includes(user.uid);

  return (
    <div className="min-h-screen bg-[#0a1628]">
      {/* Hero Image */}
      <div className="relative h-64 md:h-96 bg-gradient-to-br from-[#1a3c5e] to-[#0d1f38] flex items-center justify-center overflow-hidden">
        {issue.imageBase64 ? (
          <img src={issue.imageBase64} alt={issue.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-8xl">{categoryEmojis[issue.category] || '⚠️'}</span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] to-transparent" />
        <div className="absolute bottom-6 left-6">
          <Link href="/issues" className="text-gray-400 hover:text-white text-sm">← Back to Issues</Link>
          <h1 className="text-2xl md:text-4xl font-bold text-white mt-2">{issue.title}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Timeline */}
            <div className="bg-[#0d1f38] border border-white/10 rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-6">Issue Status</h2>
              <div className="flex items-center justify-between">
                {statusSteps.map((step, idx) => (
                  <div key={step} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                        idx <= currentStep
                          ? 'bg-amber-400 border-amber-400 text-black'
                          : 'bg-transparent border-white/20 text-gray-500'
                      }`}>
                        {idx <= currentStep ? '✓' : idx + 1}
                      </div>
                      <p className={`text-xs mt-2 text-center font-medium ${idx <= currentStep ? 'text-amber-400' : 'text-gray-500'}`}>
                        {step}
                      </p>
                    </div>
                    {idx < statusSteps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 ${idx < currentStep ? 'bg-amber-400' : 'bg-white/10'}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="bg-[#0d1f38] border border-white/10 rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-4">Issue Details</h2>
              <p className="text-gray-300 leading-relaxed mb-6">{issue.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Category', value: `${categoryEmojis[issue.category]} ${issue.category}` },
                  { label: 'Severity', value: '⭐'.repeat(issue.severity || 1) },
                  { label: 'Location', value: issue.location?.city || 'Unknown' },
                  { label: 'Urgency', value: issue.urgency || 'Medium' },
                ].map(item => (
                  <div key={item.label} className="bg-white/5 rounded-xl p-3">
                    <p className="text-gray-400 text-xs mb-1">{item.label}</p>
                    <p className="text-white text-sm font-medium">{item.value}</p>
                  </div>
                ))}
              </div>
              {issue.location?.address && (
                <div className="mt-4 bg-white/5 rounded-xl p-3">
                  <p className="text-gray-400 text-xs mb-1">📍 Full Address</p>
                  <p className="text-white text-sm">{issue.location.address}</p>
                </div>
              )}
            </div>

            {/* Comments */}
            <div className="bg-[#0d1f38] border border-white/10 rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-4">Community Discussion ({comments.length})</h2>
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {comments.length === 0 && (
                  <p className="text-gray-400 text-sm text-center py-4">No comments yet. Be the first!</p>
                )}
                {comments.map(c => (
                  <div key={c.id} className="flex gap-3">
                    {c.userPhoto ? (
                      <img src={c.userPhoto} alt={c.userName} className="w-8 h-8 rounded-full flex-shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-black text-xs font-bold flex-shrink-0">
                        {c.userName?.[0] || 'A'}
                      </div>
                    )}
                    <div className="flex-1 bg-white/5 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white text-xs font-medium">{c.userName}</span>
                        <span className="text-gray-500 text-xs">{timeAgo(c.createdAt)}</span>
                      </div>
                      <p className="text-gray-300 text-sm">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              {user ? (
                <div className="flex gap-3">
                  <img src={user.photoURL || ''} alt="" className="w-8 h-8 rounded-full flex-shrink-0" />
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleComment()}
                      placeholder="Add a comment..."
                      className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-amber-400"
                    />
                    <button onClick={handleComment} className="bg-amber-400 hover:bg-amber-500 text-black font-bold px-4 py-2 rounded-xl transition-all">
                      Send
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm text-center">Login to add a comment</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Upvote */}
            <div className="bg-[#0d1f38] border border-white/10 rounded-2xl p-6 text-center">
              <button
                onClick={handleUpvote}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  hasUpvoted ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-red-500/20'
                }`}
              >
                {hasUpvoted ? '❤️' : '🤍'} {issue.upvotes?.length || 0} Upvotes
              </button>
              <p className="text-gray-400 text-xs mt-2">{hasUpvoted ? 'Click to remove upvote' : 'Click to upvote this issue'}</p>
            </div>

            {/* Verify */}
            <div className="bg-[#0d1f38] border border-white/10 rounded-2xl p-6 text-center">
              <button
                onClick={handleVerify}
                className={`w-full py-4 rounded-xl font-bold transition-all ${
                  hasVerified ? 'bg-green-500 text-white' : 'bg-white/10 text-white hover:bg-green-500/20'
                }`}
              >
                {hasVerified ? '✅ Verified!' : '👁️ Verify Issue'}
              </button>
              <p className="text-gray-400 text-xs mt-2">{issue.verifiedBy?.length || 0} citizens verified this</p>
            </div>

            {/* Reporter */}
            <div className="bg-[#0d1f38] border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-3">Reported By</h3>
              <div className="flex items-center gap-3">
                {issue.reportedBy?.photoURL ? (
                  <img src={issue.reportedBy.photoURL} alt="" className="w-10 h-10 rounded-full" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-black font-bold">
                    {issue.reportedBy?.name?.[0] || 'A'}
                  </div>
                )}
                <div>
                  <p className="text-white text-sm font-medium">{issue.reportedBy?.name || 'Anonymous'}</p>
                  <p className="text-gray-400 text-xs">{timeAgo(issue.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Share & Escalate */}
            <div className="bg-[#0d1f38] border border-white/10 rounded-2xl p-6 space-y-3">
              <h3 className="text-white font-bold mb-3">Actions</h3>
              <button
                onClick={() => { navigator.clipboard.writeText(window.location.href); }}
                className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-xl text-sm font-medium transition-all"
              >
                🔗 Copy Link
              </button>
              
                href={`https://wa.me/?text=Check this civic issue: ${encodeURIComponent(issue.title)} - ${encodeURIComponent(window.location.href)}`}
                target="_blank"
                className="block w-full bg-green-600/20 hover:bg-green-600/30 text-green-400 py-2 rounded-xl text-sm font-medium transition-all text-center"
              >
                📱 Share on WhatsApp
              </a>
              <button
                onClick={handleEscalate}
                className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 rounded-xl text-sm font-medium transition-all"
              >
                🚨 Escalate to Authority
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}