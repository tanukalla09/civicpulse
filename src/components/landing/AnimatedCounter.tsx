'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { subscribeToIssues } from '@/lib/firestore';
import { FileText, CheckCircle2, MapPin, Users } from 'lucide-react';

interface StatItemProps {
  value: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  suffix?: string;
}

function StatCard({ value, label, icon: Icon, suffix = '' }: StatItemProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, {
        duration: 2,
        ease: 'easeOut',
      });
      return () => controls.stop();
    }
  }, [value, isInView, count]);

  // Subscribe to changes in the motion value to update state for rendering
  useEffect(() => {
    return rounded.on('change', (latest) => {
      setDisplayValue(latest);
    });
  }, [rounded]);

  return (
    <div
      ref={ref}
      className="bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl p-6 flex flex-col items-center text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1"
    >
      <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-amber-400" />
      </div>
      <div className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-2">
        {displayValue.toLocaleString()}
        {suffix}
      </div>
      <div className="text-slate-400 text-sm font-medium">{label}</div>
    </div>
  );
}

export default function AnimatedCounter() {
  const [stats, setStats] = useState({
    totalReports: 1428,
    resolvedIssues: 946,
    citiesActive: 3,
    citizensJoined: 842,
  });

  useEffect(() => {
    const unsubscribe = subscribeToIssues((issues) => {
      const dbTotal = issues.length;
      const dbResolved = issues.filter((i) => i.status === 'Resolved').length;
      
      // Calculate unique cities in DB
      const uniqueCities = new Set(issues.map((i) => i.location.city));
      // Add default cities to the set
      ['Chennai', 'Bengaluru', 'Hyderabad'].forEach(c => uniqueCities.add(c));

      // Calculate unique users who reported
      const uniqueReporters = new Set(issues.map((i) => i.reportedBy?.uid).filter(Boolean));

      setStats({
        totalReports: 1428 + dbTotal,
        resolvedIssues: 946 + dbResolved,
        citiesActive: uniqueCities.size,
        citizensJoined: 842 + uniqueReporters.size,
      });
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          value={stats.totalReports}
          label="Total Reports"
          icon={FileText}
        />
        <StatCard
          value={stats.resolvedIssues}
          label="Issues Resolved"
          icon={CheckCircle2}
        />
        <StatCard
          value={stats.citiesActive}
          label="Cities Active"
          icon={MapPin}
        />
        <StatCard
          value={stats.citizensJoined}
          label="Citizens Joined"
          icon={Users}
          suffix="+"
        />
      </div>
    </section>
  );
}
