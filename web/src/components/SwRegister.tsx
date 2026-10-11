'use client';

import { useEffect } from 'react';

// Registers /sw.js once. No UI, no interference with auth/data flows.
export default function SwRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Offline/PWA is best-effort; app works without it.
      });
    }
  }, []);
  return null;
}
