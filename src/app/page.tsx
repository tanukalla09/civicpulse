'use client';

import HeroSection from '@/components/landing/HeroSection';
import LiveTicker from '@/components/landing/LiveTicker';
import HowItWorks from '@/components/landing/HowItWorks';
import WhyCivicPulse from '@/components/landing/WhyCivicPulse';
import AnimatedCounter from '@/components/landing/AnimatedCounter';
import RecentIssues from '@/components/landing/RecentIssues';
import ImpactMetrics from '@/components/landing/ImpactMetrics';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a1628]">
      <LiveTicker />
      <HeroSection />
      <AnimatedCounter />
      <HowItWorks />
      <WhyCivicPulse />
      <RecentIssues />
      <ImpactMetrics />
    </main>
  );
}