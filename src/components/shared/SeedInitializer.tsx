'use client';

import { useEffect } from 'react';

export default function SeedInitializer() {
  useEffect(() => {
    // Call the seed API endpoint on first load
    fetch('/api/seed')
      .then((res) => res.json())
      .then((data) => {
        if (data.seeded) {
          console.log(`[CivicPulse] Successfully seeded ${data.count} demo issues.`);
        }
      })
      .catch((err) => {
        console.error('[CivicPulse] Failed to run database seed check:', err);
      });
  }, []);

  return null;
}
