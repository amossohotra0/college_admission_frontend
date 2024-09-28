import Cookies from 'js-cookie';
import { authService } from './services';
import { User, LoginData, RegisterData } from '@/types';

// Cookie options
const cookieOptions = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
};

// Auth helper functions
export const auth = {
  // Set tokens in cookies
  setTokens(access: string, refresh: string): void {
    Cookies.set('access_token', access, cookieOptions);
    Cookies.set('refresh_token', refresh, cookieOptions);
  },

  // Get tokens from cookies
  getTokens(): { access: string | undefined; refresh: string | undefined } {
    return {
      access: Cookies.get('access_token'),
      refresh: Cookies.get('refresh_token'),
    };
  },

  // Clear tokens from cookies
  clearTokens(): void {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    Cookies.remove('user');
  },

  // Store user in cookie
  setUser(user: User): void {
    Cookies.set('user', JSON.stringify(user), cookieOptions);
  },

  // Get user from cookie
  getUser(): User | null {
    const userStr = Cookies.get('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!Cookies.get('access_token');
  },

  // Check if user has specific role
  hasRole(role: string): boolean {
    const user = this.getUser();
    return user?.role?.role === role;
  },

  // Login user
  async login(credentials: LoginData): Promise<User> {
    const { access, refresh } = await authService.login(credentials);
    this.setTokens(access, refresh);
    const user = await authService.getUserProfile();
    this.setUser(user);
    return user;
  },

  // Register user
  async register(data: RegisterData): Promise<any> {
    return await authService.register(data);
  },

  // Logout user
  logout(): void {
    this.clearTokens();
    window.location.href = '/auth/login';
  },

  // Refresh token
  async refreshToken(): Promise<boolean> {
    try {
      const { refresh } = this.getTokens();
      if (!refresh) return false;

      const { access } = await authService.refreshToken(refresh);
      Cookies.set('access_token', access, cookieOptions);
      return true;
    } catch (error) {
      this.clearTokens();
      return false;
    }
  },
};

export default auth;