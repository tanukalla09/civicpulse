'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Radio, Sparkles, CheckSquare, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: Radio,
    title: 'Real-Time Tracking',
    description: 'Watch your reported issues move from "Open" to "Verified", "In Progress", and finally "Resolved" in real-time. No black holes.',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: Sparkles,
    title: 'AI Categorization',
    description: 'Submit in seconds. Our Gemini AI automatically detects the category, severity level, and description so you do not have to fill out long forms.',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
  },
  {
    icon: CheckSquare,
    title: 'Community Verification',
    description: 'Ensure transparency and trust. The platform relies on fellow local citizens to upvote, comment on, and physically verify reported issues.',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
  },
  {
    icon: BarChart3,
    title: 'Impact Analytics',
    description: 'Earn points, unlock civic badges, and climb the city leaderboard. Track your individual and community contribution metrics over time.',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: 'spring', stiffness: 120, damping: 14 }
  },
};

export default function WhyCivicPulse() {
  return (
    <section className="py-20 px-4 bg-slate-950/40 border-y border-white/5 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-white mb-4">
            Why CivicPulse?
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
            Traditional civic portals are slow and opaque. CivicPulse is built on transparency, AI speed, and community trust.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -5 }}
                className="flex gap-6 bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm transition-all duration-300"
              >
                <div className={`shrink-0 w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
