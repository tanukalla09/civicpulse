import { CategoryInfo, BadgeInfo, Category, Status } from '@/types';

export const CATEGORIES: CategoryInfo[] = [
  { name: 'Pothole', emoji: '🕳️', color: '#ef4444', bgColor: 'bg-red-500/20', markerColor: '#dc2626' },
  { name: 'Streetlight', emoji: '💡', color: '#eab308', bgColor: 'bg-yellow-500/20', markerColor: '#ca8a04' },
  { name: 'Water Leakage', emoji: '💧', color: '#3b82f6', bgColor: 'bg-blue-500/20', markerColor: '#2563eb' },
  { name: 'Waste/Garbage', emoji: '🗑️', color: '#22c55e', bgColor: 'bg-green-500/20', markerColor: '#16a34a' },
  { name: 'Flooding', emoji: '🌊', color: '#a855f7', bgColor: 'bg-purple-500/20', markerColor: '#9333ea' },
  { name: 'Other', emoji: '⚠️', color: '#6b7280', bgColor: 'bg-gray-500/20', markerColor: '#4b5563' },
];

export const STATUS_CONFIG: Record<Status, { color: string; bgColor: string; emoji: string }> = {
  'Open': { color: '#ef4444', bgColor: 'bg-red-500/20 text-red-400', emoji: '🔴' },
  'Verified': { color: '#eab308', bgColor: 'bg-yellow-500/20 text-yellow-400', emoji: '🟡' },
  'In Progress': { color: '#3b82f6', bgColor: 'bg-blue-500/20 text-blue-400', emoji: '🔵' },
  'Resolved': { color: '#22c55e', bgColor: 'bg-green-500/20 text-green-400', emoji: '🟢' },
};

export const BADGES: BadgeInfo[] = [
  { name: 'Newcomer', emoji: '🌱', minPoints: 0, maxPoints: 50, description: 'Just getting started on your civic journey' },
  { name: 'Active Citizen', emoji: '⭐', minPoints: 51, maxPoints: 200, description: 'Making a real difference in your community' },
  { name: 'Community Hero', emoji: '🦸', minPoints: 201, maxPoints: 500, description: 'A true champion of civic engagement' },
  { name: 'City Champion', emoji: '🏆', minPoints: 501, maxPoints: Infinity, description: 'The ultimate civic warrior' },
  { name: 'Streak Warrior', emoji: '🔥', minPoints: 0, maxPoints: 0, description: '7-day reporting streak' },
];

export const POINTS = {
  REPORT: 10,
  VERIFICATION: 5,
  COMMENT: 2,
  UPVOTE: 1,
};

export const CITIES = ['Chennai', 'Bengaluru', 'Hyderabad'];

export const SEVERITY_LABELS = ['', 'Minor', 'Low', 'Moderate', 'High', 'Critical'];

export const getCategoryInfo = (category: Category): CategoryInfo => {
  return CATEGORIES.find(c => c.name === category) || CATEGORIES[5];
};

export const getStatusConfig = (status: Status) => {
  return STATUS_CONFIG[status] || STATUS_CONFIG['Open'];
};
