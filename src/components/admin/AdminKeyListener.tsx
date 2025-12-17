"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function AdminKeyListener() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Shift + Ctrl + A to open admin
      if (e.shiftKey && e.ctrlKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        router.push('/admin');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  return null;
}

