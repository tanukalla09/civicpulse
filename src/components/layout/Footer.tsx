'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  
  if (pathname === '/map') return null;

  return (
    <footer className="w-full bg-[#080d19]/90 border-t border-white/5 py-12 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo and Tagline */}
        <div className="flex flex-col items-center md:items-start space-y-2 text-center md:text-left">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl">🏙️</span>
            <span className="font-heading font-bold text-lg tracking-tight bg-gradient-to-r from-white to-amber-400 bg-clip-text text-transparent">
              Civic<span className="text-amber-400 font-extrabold">Pulse</span>
            </span>
          </Link>
          <p className="text-xs text-slate-400 max-w-xs">
            Empowering citizens with AI-powered reporting to build better, safer, and cleaner cities.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
          <Link href="/map" className="hover:text-amber-400 transition-colors">Map</Link>
          <Link href="/issues" className="hover:text-amber-400 transition-colors">Issues</Link>
          <Link href="/dashboard" className="hover:text-amber-400 transition-colors">Dashboard</Link>
          <Link href="/leaderboard" className="hover:text-amber-400 transition-colors">Leaderboard</Link>
        </div>

        {/* Built with love tagline */}
        <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
          <span>Made with</span>
          <span className="text-red-500 animate-pulse text-sm">❤️</span>
          <span>for</span>
          <span className="text-amber-400 font-semibold flex items-center space-x-0.5">
            <span>Bharat</span>
            <Sparkles className="w-3.5 h-3.5 fill-amber-400/25 stroke-[1.5px]" />
          </span>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} CivicPulse. All rights reserved.</p>
        <div className="flex space-x-4">
          <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-slate-400 cursor-pointer transition-colors">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
