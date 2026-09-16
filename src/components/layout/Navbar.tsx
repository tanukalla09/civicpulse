'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthContext } from '../auth/AuthProvider';
import { useUser } from '@/hooks/useUser';
import { MobileMenu } from './MobileMenu';
import { 
  PlusCircle, 
  Map, 
  List, 
  LayoutDashboard, 
  Trophy, 
  Sparkles,
  LogOut,
  User,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, loginWithGoogle, logout } = useAuthContext();
  const { profile } = useUser(user?.uid);
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Live Map', href: '/map', icon: Map },
    { name: 'Issues Feed', href: '/issues', icon: List },
    { name: 'Impact Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
  ];

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeDropdown = () => setDropdownOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full glassmorphism border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="text-2xl"
          >
            🏙️
          </motion.div>
          <span className="font-heading font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-amber-400 bg-clip-text text-transparent">
            Civic<span className="text-amber-400 font-extrabold">Pulse</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <span className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                }`}>
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/report">
            <motion.span 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-lg shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
            >
              <PlusCircle className="w-4 h-4 stroke-[3px]" />
              <span>Report Issue</span>
            </motion.span>
          </Link>

          {user ? (
            <div className="relative">
              <button 
                onClick={toggleDropdown}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="relative p-[2px] rounded-full bg-gradient-to-r from-amber-400 to-blue-500 hover:scale-105 transition-transform">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80'} 
                    alt="User Avatar" 
                    className="w-8 h-8 rounded-full object-cover border-2 border-slate-900"
                  />
                </div>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <>
                    {/* Overlay to close dropdown */}
                    <div className="fixed inset-0 z-10" onClick={closeDropdown} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 glassmorphism-modal rounded-xl py-2 z-20 overflow-hidden"
                    >
                      <div className="px-4 py-2 border-b border-white/5">
                        <p className="text-xs text-slate-400">Signed in as</p>
                        <p className="font-semibold text-sm text-white truncate">{user.displayName}</p>
                        {profile && (
                          <div className="flex items-center space-x-1 mt-1 text-xs text-amber-400">
                            <Sparkles className="w-3 h-3" />
                            <span>{profile.points} pts · {profile.badge}</span>
                          </div>
                        )}
                      </div>

                      <Link href="/profile" onClick={closeDropdown}>
                        <span className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 cursor-pointer">
                          <User className="w-4 h-4" />
                          <span>My Profile</span>
                        </span>
                      </Link>

                      <button 
                        onClick={() => { closeDropdown(); logout(); }}
                        className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => loginWithGoogle()}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium text-sm border border-white/10 transition-all"
            >
              Google Login
            </motion.button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-slate-300 hover:text-white focus:outline-none p-1"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <MobileMenu 
            navLinks={navLinks} 
            user={user} 
            profile={profile}
            onClose={() => setMobileOpen(false)} 
            login={loginWithGoogle}
            logout={logout}
          />
        )}
      </AnimatePresence>
    </header>
  );
}
