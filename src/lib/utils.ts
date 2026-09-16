import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { BadgeType } from '@/types';
import { BADGES } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export function getBadge(points: number): BadgeType {
  if (points > 500) return 'City Champion';
  if (points > 200) return 'Community Hero';
  if (points > 50) return 'Active Citizen';
  return 'Newcomer';
}

export function getBadgeInfo(badge: BadgeType) {
  return BADGES.find(b => b.name === badge) || BADGES[0];
}

export function getNextBadge(points: number) {
  const currentBadge = getBadge(points);
  const currentIndex = BADGES.findIndex(b => b.name === currentBadge);
  if (currentIndex < BADGES.length - 2) {
    return BADGES[currentIndex + 1];
  }
  return null;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
