'use client';

import { useState, useRef } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const categories = ['Pothole', 'Streetlight', 'Water Leakage', 'Waste/Garbage', 'Flooding', 'Other'];
const categoryEmojis: Record<string, string> = {
  'Pothole': '🕳️', 'Streetlight': '💡', 'Water Leakage': '💧',
  'Waste/Garbage': '🗑️', 'Flooding': '🌊', 'Other': '⚠️',
};

function compressImage(base64: string, maxWidth = 800): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = Math.min(1, maxWidth / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.src = base64;
  });
}

export default function ReportPage() {
  const { user } = useAuth();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [imageBase64, setImageBase64] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reportId, setReportId] = useState('');

  const [form, setForm] = useState({
    title: '',
    category: 'Pothole',
    description: '',
    severity: 3,
    address: '',
    city: '',
    lat: 0,
    lng: 0,
    urgency: 'Medium',
  });

  const handleFile = async (file: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('File too large! Max 5MB'); return; }
    const reader = new FileReader();
    reader.onload = async (e) => {
      const raw = e.target?.result as string;
      const compressed = await compressImage(raw);
      setImageBase64(compressed);
      setStep(2);
      await analyzeImage(compressed);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (base64: string) => {
    setAnalyzing(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64 }),
      });
      const data = await res.json();
      if (data.result) {
        setAiResult(data.result);
        setForm(prev => ({
          ...prev,
          category: data.result.category || 'Other',
          description: data.result.description || '',
          severity: data.result.severity || 3,
          urgency: data.result.urgency || 'Medium',
          title: `${data.result.category || 'Issue'} reported`,
        }));
      }
    } catch (e) {
      toast.error('AI analysis failed, please fill details manually');
    }
    setAnalyzing(false);
    setStep(3);
  };

  const handleSubmit = async () => {
    if (!user) { toast.error('Please login first'); return; }
    if (!form.title || !form.city) { toast.error('Please fill title and city'); return; }
    setSubmitting(true);
    try {
      const docRef = await addDoc(collection(db, 'issues'), {
        title: form.title,
        category: form.category,
        description: form.description,
        imageBase64,
        location: { lat: form.lat, lng: form.lng, address: form.address, city: form.city },
        severity: form.severity,
        urgency: form.urgency,
        status: 'Open',
        reportedBy: { uid: user.uid, name: user.displayName, photoURL: user.photoURL },
        upvotes: [],
        verifiedBy: [],
        aiConfidence: aiResult?.confidence || 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setReportId(docRef.id);
      setSubmitted(true);
      setStep(4);
      toast.success('Issue reported successfully!');
    } catch (e) {
      toast.error('Failed to submit. Try again.');
    }
    setSubmitting(false);
  };

  if (!user) return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
      <div className="text-center bg-[#0d1f38] border border-white/10 rounded-2xl p-10">
        <p className="text-5xl mb-4">🔒</p>
        <h2 className="text-white text-2xl font-bold mb-2">Login Required</h2>
        <p className="text-gray-400 mb-6">You need to be logged in to report an issue</p>
        <button onClick={() => router.push('/')} className="bg-amber-400 text-black font-bold px-6 py-3 rounded-xl">
          Go to Home & Login
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a1628] py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Report an Issue</h1>
          <p className="text-gray-400">Help your community by reporting civic problems</p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-8">
          {['📸 Upload', '🤖 AI Analysis', '✏️ Details', '✅ Done'].map((label, idx) => (
            <div key={label} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                  step > idx + 1 ? 'bg-green-500 border-green-500 text-white' :
                  step === idx + 1 ? 'bg-amber-400 border-amber-400 text-black' :
                  'bg-transparent border-white/20 text-gray-500'
                }`}>
                  {step > idx + 1 ? '✓' : idx + 1}
                </div>
                <p className={`text-xs mt-1 hidden md:block ${step >= idx + 1 ? 'text-amber-400' : 'text-gray-500'}`}>
                  {label}
                </p>
              </div>
              {idx < 3 && <div className={`flex-1 h-0.5 mx-2 ${step > idx + 1 ? 'bg-amber-400' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Upload */}
        {step === 1 && (
          <div className="bg-[#0d1f38] border border-white/10 rounded-2xl p-8">
            <h2 className="text-white font-bold text-xl mb-6 text-center">📸 Upload a Photo</h2>
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
              className="border-2 border-dashed border-white/20 hover:border-amber-400 rounded-2xl p-16 text-center cursor-pointer transition-all group"
            >
              <p className="text-5xl mb-4 group-hover:scale-110 transition-transform">📷</p>
              <p className="text-white font-medium mb-2">Drop your photo here or click to upload</p>
              <p className="text-gray-400 text-sm">JPEG, PNG • Max 5MB</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
          </div>
        )}

        {/* Step 2: AI Analyzing */}
        {step === 2 && (
          <div className="bg-[#0d1f38] border border-white/10 rounded-2xl p-8 text-center">
            <div className="mb-6">
              <img src={imageBase64} alt="uploaded" className="w-full h-48 object-cover rounded-xl mb-4" />
            </div>
            {analyzing ? (
              <div>
                <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white font-bold text-xl mb-2">🤖 AI is analyzing your photo...</p>
                <p className="text-gray-400">Detecting issue type, severity & description</p>
              </div>
            ) : (
              <div>
                <p className="text-green-400 text-xl font-bold mb-2">✅ Analysis Complete!</p>
                <p className="text-gray-400">Moving to details...</p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Details Form */}
        {step === 3 && (
          <div className="bg-[#0d1f38] border border-white/10 rounded-2xl p-8 space-y-5">
            <h2 className="text-white font-bold text-xl mb-2">✏️ Review & Edit Details</h2>

            {/* AI Result Banner */}
            {aiResult && (
              <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl p-4 mb-4">
                <p className="text-amber-400 font-bold text-sm mb-1">🤖 AI detected with {Math.round((aiResult.confidence || 0) * 100)}% confidence</p>
                <div className="flex gap-4 flex-wrap">
                  <span className="text-white text-sm">{categoryEmojis[aiResult.category]} {aiResult.category}</span>
                  <span className="text-white text-sm">Severity: {'⭐'.repeat(aiResult.severity || 1)}</span>
                  <span className={`text-sm font-medium ${aiResult.urgency === 'Critical' ? 'text-red-400' : aiResult.urgency === 'High' ? 'text-orange-400' : 'text-yellow-400'}`}>
                    🚨 {aiResult.urgency}
                  </span>
                </div>
              </div>
            )}

            {/* Image preview */}
            <img src={imageBase64} alt="uploaded" className="w-full h-36 object-cover rounded-xl" />

            {/* Title */}
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Issue Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                placeholder="e.g. Large pothole on main road"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Category</label>
              <select
                value={form.category}
                onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400"
              >
                {categories.map(c => (
                  <option key={c} value={c} className="bg-[#0d1f38]">{categoryEmojis[c]} {c}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                rows={3}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 resize-none"
                placeholder="Describe the issue in detail..."
              />
            </div>

            {/* Severity */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Severity: {'⭐'.repeat(form.severity)}</label>
              <input
                type="range" min={1} max={5} value={form.severity}
                onChange={e => setForm(p => ({ ...p, severity: Number(e.target.value) }))}
                className="w-full accent-amber-400"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Minor</span><span>Moderate</span><span>Critical</span>
              </div>
            </div>

            {/* City */}
            <div>
              <label className="text-gray-400 text-sm mb-1 block">City *</label>
              <input
                type="text"
                value={form.city}
                onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                placeholder="e.g. Hyderabad"
              />
            </div>

            {/* Address */}
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Street Address</label>
              <input
                type="text"
                value={form.address}
                onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                placeholder="e.g. Near Hitech City Metro Station"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-amber-400 hover:bg-amber-500 text-black font-bold py-4 rounded-xl transition-all disabled:opacity-50 text-lg"
            >
              {submitting ? '⏳ Submitting...' : '🚀 Submit Report'}
            </button>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="bg-[#0d1f38] border border-white/10 rounded-2xl p-10 text-center">
            <div className="text-7xl mb-6 animate-bounce">🎉</div>
            <h2 className="text-white font-bold text-2xl mb-2">Issue Reported!</h2>
            <p className="text-gray-400 mb-2">Your report has been submitted to the community</p>
            <p className="text-amber-400 text-sm mb-8 font-mono">ID: #{reportId.slice(0, 8).toUpperCase()}</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => router.push(`/issues/${reportId}`)} className="bg-amber-400 hover:bg-amber-500 text-black font-bold py-3 rounded-xl transition-all">
                Track My Issue →
              </button>
              <button onClick={() => router.push('/issues')} className="bg-white/10 hover:bg-white/20 text-white font-medium py-3 rounded-xl transition-all">
                View All Issues
              </button>
              <button onClick={() => { setStep(1); setImageBase64(''); setAiResult(null); setSubmitted(false); }} className="text-gray-400 hover:text-white text-sm transition-all">
                Report Another Issue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}