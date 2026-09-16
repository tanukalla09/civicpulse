'use client';

import { useState, useEffect } from 'react';
import { UserProfile } from '@/types';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export function useUser(uid: string | undefined) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      doc(db, 'users', uid),
      (docSnap) => {
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        } else {
          setProfile(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error subscribing to user profile:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [uid]);

  return { profile, loading };
}
