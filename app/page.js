'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-dark">
      <div className="text-center">
        <span className="material-symbols-outlined animate-spin text-primary text-5xl mb-4">
          progress_activity
        </span>
        <p className="text-slate-400 text-sm">Loading...</p>
      </div>
    </div>
  );
}
