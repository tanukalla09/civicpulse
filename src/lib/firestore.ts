import { db } from './firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  where,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  increment,
  serverTimestamp,
  Timestamp,
  setDoc,
  Unsubscribe,
} from 'firebase/firestore';
import { Issue, UserProfile, Comment } from '@/types';
import toast from 'react-hot-toast';

const ISSUES_COLLECTION = 'issues';
const USERS_COLLECTION = 'users';
const COMMENTS_SUBCOLLECTION = 'comments';

// ==================== ISSUES ====================

export async function createIssue(issue: Omit<Issue, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, ISSUES_COLLECTION), {
      ...issue,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    toast.success('Issue reported successfully!');
    return docRef.id;
  } catch (error) {
    console.error('Error creating issue:', error);
    toast.error('Failed to report issue. Please try again.');
    throw error;
  }
}

export async function getIssues(filters?: {
  category?: string;
  status?: string;
  city?: string;
  sortBy?: string;
  limitCount?: number;
}): Promise<Issue[]> {
  try {
    let q = query(collection(db, ISSUES_COLLECTION), orderBy('createdAt', 'desc'));
    
    if (filters?.limitCount) {
      q = query(q, limit(filters.limitCount));
    }
    
    const snapshot = await getDocs(q);
    let issues = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Issue[];

    // Client-side filtering (Firestore has limitations on compound queries)
    if (filters?.category && filters.category !== 'All') {
      issues = issues.filter(i => i.category === filters.category);
    }
    if (filters?.status && filters.status !== 'All') {
      issues = issues.filter(i => i.status === filters.status);
    }
    if (filters?.city) {
      issues = issues.filter(i => i.location.city === filters.city);
    }

    // Client-side sorting
    if (filters?.sortBy === 'upvotes') {
      issues.sort((a, b) => (b.upvotes?.length || 0) - (a.upvotes?.length || 0));
    } else if (filters?.sortBy === 'verified') {
      issues.sort((a, b) => (b.verifiedBy?.length || 0) - (a.verifiedBy?.length || 0));
    }

    return issues;
  } catch (error) {
    console.error('Error fetching issues:', error);
    toast.error('Failed to load issues.');
    return [];
  }
}

export async function getIssue(id: string): Promise<Issue | null> {
  try {
    const docRef = doc(db, ISSUES_COLLECTION, id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() } as Issue;
  } catch (error) {
    console.error('Error fetching issue:', error);
    toast.error('Failed to load issue.');
    return null;
  }
}

export function subscribeToIssues(callback: (issues: Issue[]) => void): Unsubscribe {
  const q = query(collection(db, ISSUES_COLLECTION), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const issues = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Issue[];
    callback(issues);
  }, (error) => {
    console.error('Error subscribing to issues:', error);
  });
}

export function subscribeToIssue(id: string, callback: (issue: Issue | null) => void): Unsubscribe {
  const docRef = doc(db, ISSUES_COLLECTION, id);
  return onSnapshot(docRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback(null);
      return;
    }
    callback({ id: snapshot.id, ...snapshot.data() } as Issue);
  }, (error) => {
    console.error('Error subscribing to issue:', error);
  });
}

export async function toggleUpvote(issueId: string, userId: string): Promise<void> {
  try {
    const issueRef = doc(db, ISSUES_COLLECTION, issueId);
    const issueSnap = await getDoc(issueRef);
    if (!issueSnap.exists()) return;
    
    const issue = issueSnap.data() as Issue;
    const hasUpvoted = issue.upvotes?.includes(userId);
    
    await updateDoc(issueRef, {
      upvotes: hasUpvoted ? arrayRemove(userId) : arrayUnion(userId),
      updatedAt: Date.now(),
    });

    // Update user points
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      await updateDoc(userRef, {
        upvotesGiven: increment(hasUpvoted ? -1 : 1),
        points: increment(hasUpvoted ? -1 : 1),
      });
    }
  } catch (error) {
    console.error('Error toggling upvote:', error);
    toast.error('Failed to update vote.');
  }
}

export async function toggleVerification(issueId: string, userId: string): Promise<void> {
  try {
    const issueRef = doc(db, ISSUES_COLLECTION, issueId);
    const issueSnap = await getDoc(issueRef);
    if (!issueSnap.exists()) return;
    
    const issue = issueSnap.data() as Issue;
    const hasVerified = issue.verifiedBy?.includes(userId);
    
    const updates: Record<string, unknown> = {
      verifiedBy: hasVerified ? arrayRemove(userId) : arrayUnion(userId),
      updatedAt: Date.now(),
    };

    // Auto-update status to Verified if 3+ verifications
    if (!hasVerified && (issue.verifiedBy?.length || 0) >= 2 && issue.status === 'Open') {
      updates.status = 'Verified';
    }
    
    await updateDoc(issueRef, updates);

    // Update user points
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      await updateDoc(userRef, {
        issuesVerified: increment(hasVerified ? -1 : 1),
        points: increment(hasVerified ? -5 : 5),
      });
    }
    
    toast.success(hasVerified ? 'Verification removed' : 'Issue verified! +5 points');
  } catch (error) {
    console.error('Error toggling verification:', error);
    toast.error('Failed to verify issue.');
  }
}

// ==================== COMMENTS ====================

export async function addComment(issueId: string, comment: Omit<Comment, 'id'>): Promise<void> {
  try {
    await addDoc(collection(db, ISSUES_COLLECTION, issueId, COMMENTS_SUBCOLLECTION), {
      ...comment,
      createdAt: Date.now(),
    });
    toast.success('Comment added!');
  } catch (error) {
    console.error('Error adding comment:', error);
    toast.error('Failed to add comment.');
  }
}

export async function getComments(issueId: string): Promise<Comment[]> {
  try {
    const q = query(
      collection(db, ISSUES_COLLECTION, issueId, COMMENTS_SUBCOLLECTION),
      orderBy('createdAt', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Comment[];
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

export function subscribeToComments(issueId: string, callback: (comments: Comment[]) => void): Unsubscribe {
  const q = query(
    collection(db, ISSUES_COLLECTION, issueId, COMMENTS_SUBCOLLECTION),
    orderBy('createdAt', 'asc')
  );
  return onSnapshot(q, (snapshot) => {
    const comments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Comment[];
    callback(comments);
  });
}

// ==================== USERS ====================

export async function createOrUpdateUser(user: Partial<UserProfile> & { uid: string }): Promise<void> {
  try {
    const userRef = doc(db, USERS_COLLECTION, user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        name: 'Anonymous',
        email: '',
        photoURL: '',
        points: 0,
        badge: 'Newcomer',
        city: '',
        issuesReported: 0,
        issuesVerified: 0,
        upvotesGiven: 0,
        streak: 0,
        lastActiveDate: new Date().toISOString().split('T')[0],
        createdAt: Date.now(),
        ...user,
      });
    } else {
      await updateDoc(userRef, {
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        lastActiveDate: new Date().toISOString().split('T')[0],
      });
    }
  } catch (error) {
    console.error('Error creating/updating user:', error);
  }
}

export async function getUser(uid: string): Promise<UserProfile | null> {
  try {
    const docRef = doc(db, USERS_COLLECTION, uid);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return snapshot.data() as UserProfile;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function getLeaderboard(cityFilter?: string, timeFilter?: string): Promise<UserProfile[]> {
  try {
    const q = query(
      collection(db, USERS_COLLECTION),
      orderBy('points', 'desc'),
      limit(20)
    );
    const snapshot = await getDocs(q);
    let users = snapshot.docs.map(doc => doc.data()) as UserProfile[];

    if (cityFilter && cityFilter !== 'All') {
      users = users.filter(u => u.city === cityFilter);
    }

    return users;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}

// ==================== SEED CHECK ====================

export async function isCollectionEmpty(): Promise<boolean> {
  try {
    const q = query(collection(db, ISSUES_COLLECTION), limit(1));
    const snapshot = await getDocs(q);
    return snapshot.empty;
  } catch (error) {
    console.error('Error checking collection:', error);
    return true;
  }
}
