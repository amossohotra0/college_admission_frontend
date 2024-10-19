'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function HomePage() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated()) {
        if (user?.role?.role === 'applicant') {
          router.push('/dashboard');
        } else {
          router.push('/admin');
        }
      } else {
        router.push('/landing');
      }
    }
  }, [isAuthenticated, loading, router, user]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="large" />
    </div>
  );
}