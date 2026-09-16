'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Cpu, Users2, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Snap',
    emoji: '📸',
    icon: Camera,
    color: 'from-blue-500 to-cyan-500',
    borderColor: 'group-hover:border-blue-500/30',
    iconColor: 'text-blue-400',
    description: 'Take a photo of the civic issue—whether it is a pothole, broken streetlight, or water leakage. Quick and simple.',
  },
  {
    number: '02',
    title: 'AI Analyzes',
    emoji: '🤖',
    icon: Cpu,
    color: 'from-amber-500 to-yellow-500',
    borderColor: 'group-hover:border-amber-500/30',
    iconColor: 'text-amber-400',
    description: 'Our built-in Gemini AI instantly analyzes your photo to determine the category, severity level, and description details.',
  },
  {
    number: '03',
    title: 'Community Acts',
    emoji: '🏛️',
    icon: Users2,
    color: 'from-emerald-500 to-teal-500',
    borderColor: 'group-hover:border-emerald-500/30',
    iconColor: 'text-emerald-400',
    description: 'Fellow citizens verify the issue, upvote it to increase urgency, and push local authorities to resolve it.',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 12 }
  },
};

export default function HowItWorks() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-blue-500/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-white mb-4">
            How It Works
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
            Empowering your civic actions with a simple, transparent 3-step process.
          </p>
        </div>

        {/* Steps Container */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div 
                key={step.number} 
                variants={cardVariants}
                className="group relative bg-white/5 border border-white/5 hover:bg-white/10 rounded-2xl p-8 transition-all duration-300 flex flex-col items-start"
              >
                {/* Step Number Badge */}
                <div className={`absolute top-6 right-6 font-heading font-black text-4xl bg-gradient-to-br ${step.color} bg-clip-text text-transparent opacity-30`}>
                  {step.number}
                </div>

                {/* Icon Container */}
                <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-7 h-7 ${step.iconColor}`} />
                </div>

                {/* Title */}
                <h3 className="font-heading font-bold text-xl text-white mb-3 flex items-center space-x-2">
                  <span>{step.emoji}</span>
                  <span>{step.title}</span>
                </h3>

                {/* Description */}
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
                  {step.description}
                </p>

                {/* Arrow for desktop connecting steps */}
                {index < 2 && (
                  <div className="hidden lg:block absolute -right-6 top-1/2 -translate-y-1/2 z-10 text-slate-700">
                    <ArrowRight className="w-6 h-6 animate-pulse" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
