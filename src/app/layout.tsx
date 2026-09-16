import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import { AuthProvider } from '@/components/auth/AuthProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import React from 'react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-heading',
});

export const metadata: Metadata = {
  title: 'CivicPulse — AI-Powered Civic Reporting & Impact Dashboard',
  description: 'AI-powered civic reporting platform that actually gets things fixed. Snap, report, verify, and track issues in real-time.',
};

// Seed data trigger component (runs once on application load)
import SeedInitializer from '@/components/shared/SeedInitializer';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans antialiased bg-[#0f172a] text-slate-100 min-h-screen flex flex-col">
        <AuthProvider>
          <Toaster 
            position="top-right" 
            toastOptions={{
              style: {
                background: '#1e293b',
                color: '#f8fafc',
                border: '1px solid rgba(255,255,255,0.05)',
              },
            }} 
          />
          <SeedInitializer />
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
