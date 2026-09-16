import { db } from './firebase';
import { collection, doc, writeBatch, getDocs, limit, query } from 'firebase/firestore';
import { Issue, UserProfile } from '@/types';

// Simple colorful SVG placeholders for different categories to keep it lightweight but visually stunning
const SVG_POTHOLE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <rect width="100%" height="100%" fill="%23334155"/>
  <path d="M 150 450 Q 400 200 650 450 Q 500 550 300 520 Z" fill="%231e293b"/>
  <path d="M 250 400 Q 400 300 550 420" stroke="%23f59e0b" stroke-width="8" fill="none" stroke-linecap="round"/>
  <circle cx="350" cy="380" r="40" fill="%230f172a"/>
  <circle cx="480" cy="420" r="30" fill="%230f172a"/>
  <text x="50%" y="80" fill="%23f8fafc" font-family="Outfit, sans-serif" font-size="32" font-weight="bold" text-anchor="middle">🚨 CRITICAL ROAD POTHOLE</text>
  <text x="50%" y="120" fill="%2394a3b8" font-family="Inter, sans-serif" font-size="18" text-anchor="middle">Location: Main Junction</text>
</svg>`;

const SVG_STREETLIGHT = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <rect width="100%" height="100%" fill="%230f172a"/>
  <line x1="400" y1="600" x2="400" y2="200" stroke="%23475569" stroke-width="16"/>
  <path d="M 350 200 L 450 200 L 420 150 L 380 150 Z" fill="%2364748b"/>
  <circle cx="400" cy="220" r="25" fill="%23fef08a" opacity="0.2"/>
  <path d="M 320 600 L 480 600 L 400 200 Z" fill="%23eab308" opacity="0.05"/>
  <text x="50%" y="80" fill="%23f8fafc" font-family="Outfit, sans-serif" font-size="32" font-weight="bold" text-anchor="middle">💡 BROKEN STREETLIGHT</text>
  <text x="50%" y="120" fill="%2394a3b8" font-family="Inter, sans-serif" font-size="18" text-anchor="middle">Dark Street & Safety Hazard</text>
</svg>`;

const SVG_WATER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <rect width="100%" height="100%" fill="%230284c7"/>
  <path d="M 0 450 Q 200 400 400 450 T 800 450 L 800 600 L 0 600 Z" fill="%230369a1"/>
  <path d="M 0 500 Q 200 470 400 520 T 800 500 L 800 600 L 0 600 Z" fill="%23075985"/>
  <circle cx="300" cy="250" r="15" fill="%23e0f2fe" opacity="0.8"/>
  <circle cx="500" cy="200" r="25" fill="%23e0f2fe" opacity="0.6"/>
  <circle cx="400" cy="320" r="20" fill="%23e0f2fe" opacity="0.9"/>
  <text x="50%" y="80" fill="%23f8fafc" font-family="Outfit, sans-serif" font-size="32" font-weight="bold" text-anchor="middle">💧 MAJOR WATER LEAKAGE</text>
  <text x="50%" y="120" fill="%23e0f2fe" font-family="Inter, sans-serif" font-size="18" text-anchor="middle">Main Pipeline Burst</text>
</svg>`;

const SVG_GARBAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <rect width="100%" height="100%" fill="%231e293b"/>
  <path d="M 200 500 L 600 500 L 550 350 L 250 350 Z" fill="%2316a34a" opacity="0.8"/>
  <rect x="220" y="300" width="360" height="50" rx="10" fill="%2315803d"/>
  <path d="M 180 500 Q 400 400 620 520 Q 500 580 300 550 Z" fill="%23854d0e" opacity="0.9"/>
  <text x="50%" y="80" fill="%23f8fafc" font-family="Outfit, sans-serif" font-size="32" font-weight="bold" text-anchor="middle">🗑️ OVERFLOWING DUMPSTER</text>
  <text x="50%" y="120" fill="%2394a3b8" font-family="Inter, sans-serif" font-size="18" text-anchor="middle">Garbage accumulation on pedestrian path</text>
</svg>`;

const SVG_FLOOD = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <rect width="100%" height="100%" fill="%23581c87"/>
  <path d="M 0 350 C 300 300 500 400 800 350 L 800 600 L 0 600 Z" fill="%236b21a8"/>
  <path d="M 0 450 C 200 420 600 480 800 430 L 800 600 L 0 600 Z" fill="%237e22ce"/>
  <text x="50%" y="80" fill="%23f8fafc" font-family="Outfit, sans-serif" font-size="32" font-weight="bold" text-anchor="middle">🌊 WATERLOGGING & FLOODING</text>
  <text x="50%" y="120" fill="%23e9d5ff" font-family="Inter, sans-serif" font-size="18" text-anchor="middle">Severe clogging after heavy rainfall</text>
</svg>`;

const SVG_OTHER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <rect width="100%" height="100%" fill="%234b5563"/>
  <circle cx="400" cy="300" r="100" fill="none" stroke="%23f59e0b" stroke-width="12"/>
  <path d="M 400 240 L 400 320 M 400 360 L 400 370" stroke="%23f59e0b" stroke-width="16" stroke-linecap="round"/>
  <text x="50%" y="80" fill="%23f8fafc" font-family="Outfit, sans-serif" font-size="32" font-weight="bold" text-anchor="middle">⚠️ OTHER CIVIC CONCERN</text>
  <text x="50%" y="120" fill="%23d1d5db" font-family="Inter, sans-serif" font-size="18" text-anchor="middle">Reported by local community</text>
</svg>`;

const DEMO_USERS: UserProfile[] = [
  {
    uid: 'user1',
    name: 'Aarav Sharma',
    email: 'aarav@civicpulse.org',
    photoURL: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120',
    points: 450,
    badge: 'Community Hero',
    city: 'Bengaluru',
    issuesReported: 15,
    issuesVerified: 40,
    upvotesGiven: 100,
    streak: 5,
    lastActiveDate: new Date().toISOString().split('T')[0],
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
  },
  {
    uid: 'user2',
    name: 'Ananya Iyer',
    email: 'ananya@civicpulse.org',
    photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    points: 580,
    badge: 'City Champion',
    city: 'Chennai',
    issuesReported: 22,
    issuesVerified: 55,
    upvotesGiven: 120,
    streak: 8,
    lastActiveDate: new Date().toISOString().split('T')[0],
    createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
  },
  {
    uid: 'user3',
    name: 'Vikram Reddy',
    email: 'vikram@civicpulse.org',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    points: 240,
    badge: 'Community Hero',
    city: 'Hyderabad',
    issuesReported: 8,
    issuesVerified: 25,
    upvotesGiven: 65,
    streak: 3,
    lastActiveDate: new Date().toISOString().split('T')[0],
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
  },
  {
    uid: 'user4',
    name: 'Priyanka Sen',
    email: 'priyanka@civicpulse.org',
    photoURL: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120',
    points: 120,
    badge: 'Active Citizen',
    city: 'Bengaluru',
    issuesReported: 4,
    issuesVerified: 12,
    upvotesGiven: 40,
    streak: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
  },
  {
    uid: 'user5',
    name: 'Kabir Mehta',
    email: 'kabir@civicpulse.org',
    photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    points: 35,
    badge: 'Newcomer',
    city: 'Mumbai',
    issuesReported: 1,
    issuesVerified: 3,
    upvotesGiven: 10,
    streak: 0,
    lastActiveDate: new Date().toISOString().split('T')[0],
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  }
];

const SEED_ISSUES: Omit<Issue, 'id'>[] = [
  // Bengaluru
  {
    title: 'Massive Pothole on Outer Ring Road',
    category: 'Pothole',
    description: 'A deep, dangerous pothole near the Intel flyover. It is causing severe traffic jams and is highly risky for two-wheelers during night hours.',
    imageBase64: SVG_POTHOLE,
    location: {
      lat: 12.9224,
      lng: 77.6765,
      address: 'Outer Ring Road, near Intel Office, Bellandur, Bengaluru, Karnataka 560103',
      city: 'Bengaluru',
    },
    severity: 5,
    urgency: 'Critical',
    status: 'Open',
    reportedBy: {
      uid: 'user1',
      name: 'Aarav Sharma',
      photoURL: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120',
    },
    upvotes: ['user2', 'user3', 'user4', 'user5'],
    verifiedBy: ['user2', 'user3'],
    createdAt: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
    updatedAt: Date.now() - 2 * 60 * 60 * 1000,
    aiConfidence: 0.96,
  },
  {
    title: 'Flickering Streetlights in Koramangala 4th Block',
    category: 'Streetlight',
    description: 'Three consecutive streetlights are flickering constantly. The lane is extremely dark and feels unsafe for pedestrians.',
    imageBase64: SVG_STREETLIGHT,
    location: {
      lat: 12.9324,
      lng: 77.6244,
      address: '8th Main Rd, Koramangala 4th Block, Bengaluru, Karnataka 560034',
      city: 'Bengaluru',
    },
    severity: 3,
    urgency: 'Medium',
    status: 'In Progress',
    reportedBy: {
      uid: 'user4',
      name: 'Priyanka Sen',
      photoURL: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120',
    },
    upvotes: ['user1', 'user2'],
    verifiedBy: ['user1', 'user3', 'user2'],
    createdAt: Date.now() - 24 * 60 * 60 * 1000, // 1 day ago
    updatedAt: Date.now() - 12 * 60 * 60 * 1000,
    aiConfidence: 0.91,
  },
  {
    title: 'Water Leakage from Main Supply Pipe',
    category: 'Water Leakage',
    description: 'Clean drinking water is gushing out of a cracked pipe onto the road. Thousands of liters are being wasted.',
    imageBase64: SVG_WATER,
    location: {
      lat: 12.9716,
      lng: 77.5946,
      address: 'Kasturba Rd, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka 560001',
      city: 'Bengaluru',
    },
    severity: 4,
    urgency: 'High',
    status: 'Verified',
    reportedBy: {
      uid: 'user1',
      name: 'Aarav Sharma',
      photoURL: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120',
    },
    upvotes: ['user2', 'user3', 'user4'],
    verifiedBy: ['user2', 'user3', 'user4', 'user5'],
    createdAt: Date.now() - 5 * 60 * 60 * 1000, // 5 hours ago
    updatedAt: Date.now() - 4 * 60 * 60 * 1000,
    aiConfidence: 0.88,
  },
  {
    title: 'Unattended Garbage Dump near Indiranagar Metro',
    category: 'Waste/Garbage',
    description: 'A large pile of household and commercial plastic waste has accumulated right next to the metro station entrance. Foul smell is spreading.',
    imageBase64: SVG_GARBAGE,
    location: {
      lat: 12.9784,
      lng: 77.6408,
      address: '100 Feet Rd, Stage 3, Indiranagar, Bengaluru, Karnataka 560038',
      city: 'Bengaluru',
    },
    severity: 4,
    urgency: 'High',
    status: 'Resolved',
    reportedBy: {
      uid: 'user2',
      name: 'Ananya Iyer',
      photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    },
    upvotes: ['user1', 'user3', 'user4', 'user5'],
    verifiedBy: ['user1', 'user3', 'user4'],
    createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000, // 4 days ago
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    resolvedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    aiConfidence: 0.95,
  },

  // Chennai
  {
    title: 'Severe Waterlogging after Monsoon Showers',
    category: 'Flooding',
    description: 'Knee-deep waterlogging on T-Nagar main road. Drains are completely blocked with plastic waste, stopping the water from receding.',
    imageBase64: SVG_FLOOD,
    location: {
      lat: 13.0418,
      lng: 80.2341,
      address: 'Thyagaraya Rd, T. Nagar, Chennai, Tamil Nadu 600017',
      city: 'Chennai',
    },
    severity: 5,
    urgency: 'Critical',
    status: 'Open',
    reportedBy: {
      uid: 'user2',
      name: 'Ananya Iyer',
      photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    },
    upvotes: ['user1', 'user3', 'user4', 'user5'],
    verifiedBy: ['user3', 'user4'],
    createdAt: Date.now() - 1 * 60 * 60 * 1000, // 1 hour ago
    updatedAt: Date.now() - 1 * 60 * 60 * 1000,
    aiConfidence: 0.98,
  },
  {
    title: 'Open Manhole near Marina Beach Road',
    category: 'Other',
    description: 'An open manhole on the pedestrian walkway of Kamarajar Salai. Extremely dangerous for evening joggers and children.',
    imageBase64: SVG_OTHER,
    location: {
      lat: 13.0475,
      lng: 80.2824,
      address: 'Kamarajar Salai, Marina Beach, Triplicane, Chennai, Tamil Nadu 600005',
      city: 'Chennai',
    },
    severity: 5,
    urgency: 'Critical',
    status: 'Verified',
    reportedBy: {
      uid: 'user2',
      name: 'Ananya Iyer',
      photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    },
    upvotes: ['user1', 'user3', 'user4', 'user5'],
    verifiedBy: ['user1', 'user3', 'user4', 'user5'],
    createdAt: Date.now() - 12 * 60 * 60 * 1000, // 12 hours ago
    updatedAt: Date.now() - 10 * 60 * 60 * 1000,
    aiConfidence: 0.97,
  },
  {
    title: 'Broken Streetlight on Adyar Bridge',
    category: 'Streetlight',
    description: 'The streetlight on the middle of the bridge is completely broken and hanging dangerously by a wire.',
    imageBase64: SVG_STREETLIGHT,
    location: {
      lat: 13.0114,
      lng: 80.2524,
      address: 'Adyar Bridge Road, Adyar, Chennai, Tamil Nadu 600020',
      city: 'Chennai',
    },
    severity: 4,
    urgency: 'High',
    status: 'Resolved',
    reportedBy: {
      uid: 'user2',
      name: 'Ananya Iyer',
      photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    },
    upvotes: ['user1', 'user3'],
    verifiedBy: ['user1', 'user3'],
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    resolvedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    aiConfidence: 0.94,
  },
  {
    title: 'Pothole Cluster near Mylapore Temple',
    category: 'Pothole',
    description: 'Multiple small potholes clustered together making the road extremely bumpy and difficult for cars to navigate.',
    imageBase64: SVG_POTHOLE,
    location: {
      lat: 13.0329,
      lng: 80.2694,
      address: 'Kutchery Rd, Mylapore, Chennai, Tamil Nadu 600004',
      city: 'Chennai',
    },
    severity: 3,
    urgency: 'Medium',
    status: 'Open',
    reportedBy: {
      uid: 'user3',
      name: 'Vikram Reddy',
      photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    },
    upvotes: ['user1', 'user2'],
    verifiedBy: ['user2'],
    createdAt: Date.now() - 3 * 60 * 60 * 1000,
    updatedAt: Date.now() - 3 * 60 * 60 * 1000,
    aiConfidence: 0.89,
  },

  // Hyderabad
  {
    title: 'Waterlogging at Hitec City Metro Pillar 1200',
    category: 'Flooding',
    description: 'Heavy water stagnation right under the metro pillar causing massive traffic gridlocks towards Mindspace.',
    imageBase64: SVG_FLOOD,
    location: {
      lat: 17.4483,
      lng: 78.3741,
      address: 'Hitec City Rd, Madhapur, Hyderabad, Telangana 500081',
      city: 'Hyderabad',
    },
    severity: 4,
    urgency: 'High',
    status: 'In Progress',
    reportedBy: {
      uid: 'user3',
      name: 'Vikram Reddy',
      photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    },
    upvotes: ['user1', 'user2', 'user4', 'user5'],
    verifiedBy: ['user1', 'user2', 'user4'],
    createdAt: Date.now() - 18 * 60 * 60 * 1000,
    updatedAt: Date.now() - 10 * 60 * 60 * 1000,
    aiConfidence: 0.93,
  },
  {
    title: 'Sewage Overflow on Banjara Hills Road No 12',
    category: 'Water Leakage',
    description: 'Disgusting sewage water overflowing from a manhole and running down the main road. Creating a terrible stench.',
    imageBase64: SVG_WATER,
    location: {
      lat: 17.4124,
      lng: 78.4483,
      address: 'Road No 12, Banjara Hills, Hyderabad, Telangana 500034',
      city: 'Hyderabad',
    },
    severity: 5,
    urgency: 'Critical',
    status: 'Verified',
    reportedBy: {
      uid: 'user3',
      name: 'Vikram Reddy',
      photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    },
    upvotes: ['user1', 'user2', 'user4'],
    verifiedBy: ['user1', 'user2', 'user4', 'user5'],
    createdAt: Date.now() - 8 * 60 * 60 * 1000,
    updatedAt: Date.now() - 6 * 60 * 60 * 1000,
    aiConfidence: 0.95,
  },
  {
    title: 'Overflowing Trash Bins in Jubilee Hills',
    category: 'Waste/Garbage',
    description: 'Commercial waste and food scrap bins overflowing in front of popular cafes. Attracting stray dogs and monkeys.',
    imageBase64: SVG_GARBAGE,
    location: {
      lat: 17.4312,
      lng: 78.4012,
      address: 'Road No 36, Jubilee Hills, Hyderabad, Telangana 500033',
      city: 'Hyderabad',
    },
    severity: 3,
    urgency: 'Medium',
    status: 'Open',
    reportedBy: {
      uid: 'user5',
      name: 'Kabir Mehta',
      photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    },
    upvotes: ['user3'],
    verifiedBy: [],
    createdAt: Date.now() - 4 * 60 * 60 * 1000,
    updatedAt: Date.now() - 4 * 60 * 60 * 1000,
    aiConfidence: 0.90,
  },
  {
    title: 'Dangerous Pothole near Charminar Chowk',
    category: 'Pothole',
    description: 'Deep pothole right in the middle of the narrow pedestrian path leading to Charminar. Heavy footfall makes it highly hazardous.',
    imageBase64: SVG_POTHOLE,
    location: {
      lat: 17.3616,
      lng: 78.4747,
      address: 'Charminar Rd, Charminar, Old City, Hyderabad, Telangana 500002',
      city: 'Hyderabad',
    },
    severity: 4,
    urgency: 'High',
    status: 'Resolved',
    reportedBy: {
      uid: 'user3',
      name: 'Vikram Reddy',
      photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    },
    upvotes: ['user1', 'user2', 'user5'],
    verifiedBy: ['user1', 'user2'],
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    resolvedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    aiConfidence: 0.92,
  }
];

export async function seedDemoData(): Promise<void> {
  const batch = writeBatch(db);

  // Seed Users
  for (const user of DEMO_USERS) {
    const userRef = doc(db, 'users', user.uid);
    batch.set(userRef, user);
  }

  // Seed Issues
  for (const issue of SEED_ISSUES) {
    const issueRef = doc(collection(db, 'issues'));
    batch.set(issueRef, issue);
  }

  await batch.commit();
  console.log('Demo data seeded successfully!');
}
