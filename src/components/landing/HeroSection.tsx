'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertCircle, Map, ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-20 px-4">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-[#0f172a] -z-20" />
      
      {/* Radial glows and animated background elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.2, 0.4],
          x: [0, -70, 0],
          y: [0, 60, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[150px] -z-10"
      />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] -z-10" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs font-semibold text-amber-400 mb-8 backdrop-blur-sm"
        >
          <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          <span>Empowering Communities Through AI</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-heading font-extrabold text-4xl sm:text-6xl md:text-7xl tracking-tight text-white mb-6 leading-[1.1]"
        >
          Your City. <br className="sm:hidden" />
          <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
            Your Voice.
          </span>{' '}
          <br className="sm:hidden" />
          Your Power.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
        >
          CivicPulse is an AI-powered civic engagement platform that connects citizens directly with community leaders. Snap a photo of an issue, let our AI analyze it, and watch the community verify and resolve it in real-time.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4"
        >
          <Link href="/report" className="w-full sm:w-auto">
            <motion.span
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-base rounded-xl shadow-xl shadow-amber-500/20 cursor-pointer transition-all"
            >
              <AlertCircle className="w-5 h-5 stroke-[2.5px]" />
              <span>Report an Issue</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </motion.span>
          </Link>

          <Link href="/map" className="w-full sm:w-auto">
            <motion.span
              whileHover={{ scale: 1.05, y: -2, backgroundColor: 'rgba(255,255,255,0.08)' }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center space-x-2 px-8 py-4 bg-white/5 border border-white/10 hover:border-white/20 text-white font-semibold text-base rounded-xl cursor-pointer transition-all backdrop-blur-sm"
            >
              <Map className="w-5 h-5 text-slate-300" />
              <span>View Live Map</span>
            </motion.span>
          </Link>
        </motion.div>
      </div>

      {/* Subtle bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0f172a] to-transparent pointer-events-none" />
    </section>
  );
}
