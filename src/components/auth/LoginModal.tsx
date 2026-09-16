'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, MapPin, ShieldCheck, Activity } from 'lucide-react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import toast from 'react-hot-toast';

interface LoginModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  subtitle?: string;
}

const CAROUSEL_ITEMS = [
  {
    icon: MapPin,
    title: 'Pin Local Issues',
    description: 'Report potholes, broken streetlights, or water leaks instantly with precise GPS tagging and AI classification.',
    color: 'text-rose-400',
  },
  {
    icon: Award,
    title: 'Earn Badges & Points',
    description: 'Get recognized for your civic duty. Earn points for reporting and verifying issues to become a City Champion.',
    color: 'text-amber-400',
  },
  {
    icon: Activity,
    title: 'Track Real-time Progress',
    description: 'Stay updated as issues move from Open to Resolved. See the direct impact of your contributions in your community.',
    color: 'text-blue-400',
  },
];

export default function LoginModal({
  isOpen,
  onClose,
  title = 'Empower Your Community',
  subtitle = 'Join CivicPulse to report issues, verify community reports, and earn civic points.',
}: LoginModalProps) {
  const { loginWithGoogle } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-play feature carousel
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % CAROUSEL_ITEMS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const toastId = toast.loading('Connecting with Google...');
    try {
      await loginWithGoogle();
      toast.success('Welcome to CivicPulse!', { id: toastId });
      if (onClose) onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to sign in. Please try again.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const CurrentIcon = CAROUSEL_ITEMS[activeSlide].icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Glassmorphic Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-4xl h-[550px] md:h-[600px] bg-slate-900/90 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row z-10"
          >
            {/* Close Button */}
            {onClose && (
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="absolute top-4 right-4 z-20 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white p-2 rounded-full border border-white/10 transition-all duration-200 cursor-pointer"
              >
                <X size={18} />
              </motion.button>
            )}

            {/* Left Section: Visuals & Carousel (Hidden on Mobile) */}
            <div className="hidden md:flex md:w-1/2 relative bg-gradient-to-br from-[#1a3c5e] to-slate-950 p-10 flex-col justify-between border-r border-white/5">
              {/* Grid decorative overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

              {/* Logo / Brand */}
              <div className="flex items-center gap-2.5 z-10">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <span className="font-heading text-lg font-black text-slate-950">C</span>
                </div>
                <span className="font-heading text-xl font-extrabold text-white tracking-tight">
                  Civic<span className="text-amber-500">Pulse</span>
                </span>
              </div>

              {/* Illustration Area */}
              <div className="relative w-full flex justify-center items-center h-48 my-auto z-10">
                <svg className="w-64 h-64 text-slate-400" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Floating City Landscape */}
                  <path d="M20 150H180V135H160V100H135V115H110V80H80V110H65V95H45V125H20V150Z" fill="currentColor" fillOpacity="0.05" />
                  <path d="M35 150H165" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
                  {/* Map Pin */}
                  <motion.g
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  >
                    <path d="M100 40C85 40 73 52 73 67C73 87 100 115 100 115C100 115 127 87 127 67C127 52 115 40 100 40Z" fill="#1a3c5e" stroke="#f59e0b" strokeWidth="3" />
                    <circle cx="100" cy="67" r="8" fill="#f59e0b" />
                  </motion.g>
                  {/* Surrounding Nodes representing community reports */}
                  <circle cx="50" cy="110" r="5" fill="#3b82f6" opacity="0.6" />
                  <line x1="50" y1="110" x2="75" y2="85" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
                  <circle cx="150" cy="95" r="5" fill="#22c55e" opacity="0.6" />
                  <line x1="150" y1="95" x2="125" y2="75" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
                </svg>
              </div>

              {/* Text Carousel */}
              <div className="z-10 min-h-[120px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlide}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <CurrentIcon className={`w-5 h-5 ${CAROUSEL_ITEMS[activeSlide].color}`} />
                      <h4 className="font-heading text-lg font-bold text-white">
                        {CAROUSEL_ITEMS[activeSlide].title}
                      </h4>
                    </div>
                    <p className="font-body text-sm text-slate-300 leading-relaxed">
                      {CAROUSEL_ITEMS[activeSlide].description}
                    </p>
                  </motion.div>
                </AnimatePresence>
                {/* Dots Indicator */}
                <div className="flex gap-2 mt-4">
                  {CAROUSEL_ITEMS.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === activeSlide ? 'w-6 bg-amber-500' : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Section: Sign In Actions */}
            <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-between bg-slate-900">
              {/* Header Info */}
              <div className="my-auto space-y-6">
                {/* Mobile-only logo */}
                <div className="flex md:hidden items-center gap-2.5 mb-8">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
                    <span className="font-heading text-md font-black text-slate-950">C</span>
                  </div>
                  <span className="font-heading text-lg font-extrabold text-white tracking-tight">
                    Civic<span className="text-amber-500">Pulse</span>
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight leading-tight">
                    {title}
                  </h2>
                  <p className="font-body text-sm text-slate-400 leading-relaxed">
                    {subtitle}
                  </p>
                </div>

                {/* Google Sign In Button */}
                <div className="space-y-4 pt-2">
                  <motion.button
                    disabled={loading}
                    whileHover={{ scale: 1.01, translateY: -1 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleGoogleSignIn}
                    className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl bg-white text-slate-900 hover:bg-slate-50 text-sm font-semibold transition-all duration-200 shadow-xl shadow-black/10 cursor-pointer border border-white/10 disabled:opacity-75 disabled:cursor-not-allowed font-body"
                  >
                    {loading ? (
                      <svg className="animate-spin h-5 w-5 text-slate-900" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#EA4335"
                          d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.41 0-6.19-2.78-6.19-6.19 0-3.41 2.78-6.19 6.19-6.19 1.482 0 2.844.526 3.918 1.397l3.103-3.103C18.17 1.802 15.35 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.875 0 10.844-4.223 10.844-11.24 0-.67-.068-1.317-.18-1.955H12.24z"
                        />
                      </svg>
                    )}
                    <span>Continue with Google</span>
                  </motion.button>
                </div>
              </div>

              {/* Footer Terms & Security */}
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-body border-t border-slate-800/60 pt-6">
                <ShieldCheck className="w-4 h-4 text-emerald-500/80" />
                <span>Secure Google Authentication</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
