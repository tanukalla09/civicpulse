import { BadgeType } from '@/types';
import { BADGES, POINTS } from './constants';

export function calculatePoints(actions: {
  issuesReported: number;
  issuesVerified: number;
  commentsGiven: number;
  upvotesGiven: number;
}): number {
  return (
    actions.issuesReported * POINTS.REPORT +
    actions.issuesVerified * POINTS.VERIFICATION +
    actions.commentsGiven * POINTS.COMMENT +
    actions.upvotesGiven * POINTS.UPVOTE
  );
}

export function getBadgeForPoints(points: number): BadgeType {
  if (points > 500) return 'City Champion';
  if (points > 200) return 'Community Hero';
  if (points > 50) return 'Active Citizen';
  return 'Newcomer';
}

export function getBadgeProgress(points: number): { current: typeof BADGES[0]; next: typeof BADGES[0] | null; progress: number } {
  const current = BADGES.find(b => points >= b.minPoints && points <= b.maxPoints) || BADGES[0];
  const currentIndex = BADGES.findIndex(b => b.name === current.name);
  const next = currentIndex < BADGES.length - 2 ? BADGES[currentIndex + 1] : null;
  
  if (!next) return { current, next: null, progress: 100 };
  
  const range = next.minPoints - current.minPoints;
  const progress = Math.min(100, ((points - current.minPoints) / range) * 100);
  
  return { current, next, progress };
}

export function checkStreak(lastActiveDate: string): { streak: number; isActive: boolean } {
  const last = new Date(lastActiveDate);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 1) return { streak: 1, isActive: true };
  return { streak: 0, isActive: false };
}
