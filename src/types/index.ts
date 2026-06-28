export type Category = 'Pothole' | 'Streetlight' | 'Water Leakage' | 'Waste/Garbage' | 'Flooding' | 'Other';

export type Status = 'Open' | 'Verified' | 'In Progress' | 'Resolved';

export type Urgency = 'Low' | 'Medium' | 'High' | 'Critical';

export type BadgeType = 'Newcomer' | 'Active Citizen' | 'Community Hero' | 'City Champion' | 'Streak Warrior';

export interface Location {
  lat: number;
  lng: number;
  address: string;
  city: string;
}

export interface ReportedBy {
  uid: string;
  name: string;
  photoURL: string;
}

export interface Comment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userPhotoURL: string;
  createdAt: number;
  parentId?: string;
}

export interface Issue {
  id: string;
  title: string;
  category: Category;
  description: string;
  imageBase64: string;
  location: Location;
  severity: number;
  urgency: Urgency;
  status: Status;
  reportedBy: ReportedBy;
  upvotes: string[];
  verifiedBy: string[];
  createdAt: number;
  updatedAt: number;
  resolvedAt?: number;
  aiConfidence: number;
  comments?: Comment[];
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  points: number;
  badge: BadgeType;
  city: string;
  issuesReported: number;
  issuesVerified: number;
  upvotesGiven: number;
  streak: number;
  lastActiveDate: string;
  createdAt: number;
}

export interface AIAnalysis {
  category: Category;
  severity: number;
  description: string;
  confidence: number;
  urgency: Urgency;
}

export interface CategoryInfo {
  name: Category;
  emoji: string;
  color: string;
  bgColor: string;
  markerColor: string;
}

export interface BadgeInfo {
  name: BadgeType;
  emoji: string;
  minPoints: number;
  maxPoints: number;
  description: string;
}
