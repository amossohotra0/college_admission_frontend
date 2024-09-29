import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import { LoginData, RegisterData, User } from '@/types';
import { toast } from 'react-hot-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is in cookie
    const storedUser = auth.getUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginData) => {
    try {
      setLoading(true);
      const loggedInUser = await auth.login(credentials);
      setUser(loggedInUser);
      
      // Redirect based on role
      if (loggedInUser.role.role === 'applicant') {
        router.push('/dashboard');
      } else {
        router.push('/admin');
      }
      
      return loggedInUser;
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      const result = await auth.register(data);
      toast.success('Registration successful! Please login.');
      router.push('/auth/login');
      return result;
    } catch (error: any) {
      const errorMessage = error.response?.data?.email || 
                          error.response?.data?.password || 
                          'Registration failed';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    auth.logout();
    setUser(null);
  };

  const isAuthenticated = () => {
    return auth.isAuthenticated();
  };

  const hasRole = (role: string) => {
    return auth.hasRole(role);
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    hasRole,
  };
};