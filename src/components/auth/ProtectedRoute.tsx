'use client';

import React from 'react';
import { useAuthContext } from './AuthProvider';
import { motion } from 'framer-motion';
import { ShieldAlert, Sparkles } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, loginWithGoogle } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-slate-700/50"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-amber-500 animate-spin"></div>
        </div>
        <p className="mt-4 text-slate-400 font-medium">Loading your profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background Decorative Blurs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -z-10 animate-pulse delay-75" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center shadow-2xl"
        >
          <div className="mx-auto w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mb-6">
            <ShieldAlert className="w-8 h-8 text-amber-400" />
          </div>

          <h2 className="font-heading font-bold text-2xl text-white mb-2">
            Authentication Required
          </h2>
          <p className="text-slate-400 text-sm mb-8">
            You need to be signed in to report issues and earn impact points. Join our community of active citizens today!
          </p>

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => loginWithGoogle()}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
            >
              <span>Sign in with Google</span>
            </motion.button>
            
            <div className="flex items-center justify-center space-x-1 text-xs text-slate-500">
              <Sparkles className="w-3.5 h-3.5 text-amber-500/60" />
              <span>Get +10 points for your first report!</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
