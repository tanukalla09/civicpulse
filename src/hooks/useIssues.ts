'use client';

import { useState, useEffect } from 'react';
import { Issue } from '@/types';
import { subscribeToIssues } from '@/lib/firestore';

export function useIssues(filters?: {
  category?: string;
  status?: string;
  city?: string;
  sortBy?: string;
  searchQuery?: string;
}) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToIssues((fetchedIssues) => {
      setIssues(fetchedIssues);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let result = [...issues];

    if (filters?.category && filters.category !== 'All') {
      result = result.filter((issue) => issue.category === filters.category);
    }

    if (filters?.status && filters.status !== 'All') {
      result = result.filter((issue) => issue.status === filters.status);
    }

    if (filters?.city && filters.city !== 'All') {
      result = result.filter((issue) => issue.location.city === filters.city);
    }

    if (filters?.searchQuery) {
      const queryStr = filters.searchQuery.toLowerCase();
      result = result.filter(
        (issue) =>
          issue.title.toLowerCase().includes(queryStr) ||
          issue.description.toLowerCase().includes(queryStr) ||
          issue.location.address.toLowerCase().includes(queryStr)
      );
    }

    if (filters?.sortBy) {
      if (filters.sortBy === 'recent') {
        result.sort((a, b) => b.createdAt - a.createdAt);
      } else if (filters.sortBy === 'upvotes') {
        result.sort((a, b) => (b.upvotes?.length || 0) - (a.upvotes?.length || 0));
      } else if (filters.sortBy === 'verified') {
        result.sort((a, b) => (b.verifiedBy?.length || 0) - (a.verifiedBy?.length || 0));
      }
    }

    setFilteredIssues(result);
  }, [issues, filters?.category, filters?.status, filters?.city, filters?.sortBy, filters?.searchQuery]);

  return { issues: filteredIssues, allIssues: issues, loading };
}
