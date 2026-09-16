'use client';

import { useState, useEffect } from 'react';
import { Issue, Comment } from '@/types';
import { subscribeToIssue, subscribeToComments } from '@/lib/firestore';

export function useIssue(id: string) {
  const [issue, setIssue] = useState<Issue | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    const unsubscribeIssue = subscribeToIssue(id, (fetchedIssue) => {
      setIssue(fetchedIssue);
      setLoading(false);
    });

    setCommentsLoading(true);
    const unsubscribeComments = subscribeToComments(id, (fetchedComments) => {
      setComments(fetchedComments);
      setCommentsLoading(false);
    });

    return () => {
      unsubscribeIssue();
      unsubscribeComments();
    };
  }, [id]);

  return { issue, comments, loading, commentsLoading };
}
