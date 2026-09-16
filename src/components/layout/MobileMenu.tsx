'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from 'firebase/auth';
import { UserProfile } from '@/types';
import { 
  PlusCircle, 
  LogOut,
  User as UserIcon,
  Sparkles,
  LucideIcon
} from 'lucide-react';
import { motion } from 'framer-motion';

interface MobileMenuProps {
  navLinks: { name: string; href: string; icon: LucideIcon }[];
  user: User | null;
  profile: UserProfile | null;
  onClose: () => void;
  login: () => Promise<User>;
  logout: () => Promise<void>;
}

export default function MobileMenu({ navLinks, user, profile, onClose, login, logout }: MobileMenuProps) {
  const pathname = usePathname();

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="md:hidden w-full bg-slate-900/95 backdrop-blur-xl border-b border-white/5 overflow-hidden"
    >
      <div className="px-4 pt-2 pb-6 space-y-4">
        {/* Navigation Links */}
        <div className="flex flex-col space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} onClick={onClose}>
                <span className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all ${
                  isActive 
                    ? 'bg-amber-500/10 text-amber-400 border-l-4 border-amber-500' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}>
                  <Icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </span>
              </Link>
            );
          })}
        </div>

        {/* User Info & Actions */}
        <div className="pt-4 border-t border-white/5 flex flex-col space-y-3">
          {user ? (
            <>
              <div className="flex items-center space-x-3 px-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80'} 
                  alt="User Avatar" 
                  className="w-10 h-10 rounded-full object-cover border border-white/10"
                />
                <div>
                  <p className="font-semibold text-white text-sm truncate">{user.displayName}</p>
                  {profile && (
                    <div className="flex items-center space-x-1 text-xs text-amber-400">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{profile.points} pts · {profile.badge}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link href="/profile" onClick={onClose} className="w-full">
                  <span className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white font-medium text-sm rounded-lg border border-white/10 cursor-pointer">
                    <UserIcon className="w-4 h-4" />
                    <span>Profile</span>
                  </span>
                </Link>

                <button 
                  onClick={() => { onClose(); logout(); }}
                  className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/25 text-red-400 font-medium text-sm rounded-lg border border-red-500/20"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => { onClose(); login(); }}
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg border border-white/10 transition-all text-center"
            >
              Google Login
            </button>
          )}

          {/* Report Button */}
          <Link href="/report" onClick={onClose} className="w-full block">
            <span className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-lg shadow-lg shadow-amber-500/25 cursor-pointer text-center">
              <PlusCircle className="w-5 h-5 stroke-[2.5px]" />
              <span>Report An Issue</span>
            </span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
