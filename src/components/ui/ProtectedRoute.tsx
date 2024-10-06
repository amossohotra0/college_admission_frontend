import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      router.push('/auth/login');
    }
  }, [loading, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated() ? <>{children}</> : null;
};

export default ProtectedRoute;