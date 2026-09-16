'use client';

import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiEffectProps {
  /**
   * Changing this value (e.g., incrementing a counter) will trigger a new confetti burst.
   */
  trigger?: boolean | number;
  /**
   * Whether to trigger a confetti burst immediately when the component mounts.
   * @default true
   */
  fireOnMount?: boolean;
  /**
   * The style of the confetti animation.
   * @default 'burst'
   */
  type?: 'burst' | 'side-shoots' | 'fireworks' | 'civic-pride';
  /**
   * Duration in milliseconds for continuous effects like 'fireworks' or 'civic-pride'.
   * @default 3000
   */
  duration?: number;
}

export default function ConfettiEffect({
  trigger,
  fireOnMount = true,
  type = 'burst',
  duration = 3000,
}: ConfettiEffectProps) {
  const isFirstMount = useRef(true);

  const fire = () => {
    const civicColors = ['#1a3c5e', '#f59e0b', '#3b82f6', '#1e293b', '#fbbf24'];

    if (type === 'burst') {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: civicColors,
        disableForReducedMotion: true,
      });
    } else if (type === 'side-shoots') {
      const count = 60;
      const defaults = {
        origin: { y: 0.8 },
        colors: civicColors,
        disableForReducedMotion: true,
      };

      confetti({
        ...defaults,
        particleCount: count,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.8 },
      });
      confetti({
        ...defaults,
        particleCount: count,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.8 },
      });
    } else if (type === 'fireworks') {
      const animationEnd = Date.now() + duration;
      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // since particles fall down, animate a bit higher than random
        confetti({
          particleCount,
          startVelocity: 30,
          spread: 360,
          origin: { x: Math.random(), y: Math.random() - 0.2 },
          colors: civicColors,
          disableForReducedMotion: true,
        });
      }, 250);

      return () => clearInterval(interval);
    } else if (type === 'civic-pride') {
      // Alternating side shoots of navy and gold
      const end = Date.now() + duration;
      const interval = setInterval(() => {
        if (Date.now() > end) {
          return clearInterval(interval);
        }

        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.85 },
          colors: ['#1a3c5e', '#3b82f6'],
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.85 },
          colors: ['#f59e0b', '#fbbf24'],
        });
      }, 150);

      return () => clearInterval(interval);
    }
  };

  useEffect(() => {
    // Handle mount trigger
    if (isFirstMount.current) {
      isFirstMount.current = false;
      if (fireOnMount) {
        const cleanup = fire();
        if (cleanup) return cleanup;
      }
      return;
    }

    // Handle subsequent trigger changes
    const cleanup = fire();
    if (cleanup) return cleanup;
  }, [trigger]);

  // This component doesn't render any visible UI element directly,
  // as canvas-confetti creates its own canvas elements on the body.
  return null;
}
