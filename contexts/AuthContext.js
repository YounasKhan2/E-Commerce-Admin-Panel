'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { account } from '@/lib/appwrite/client';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({
  user: null,
  session: null,
  isLoading: true,
  error: null,
  login: async () => {},
  logout: async () => {},
  checkAuth: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Check if user is authenticated
   */
  const checkAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get current session
      const currentSession = await account.getSession('current');
      setSession(currentSession);
      
      // Get user details
      const currentUser = await account.get();
      setUser(currentUser);
    } catch (err) {
      // User is not authenticated
      setUser(null);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   */
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);

      // Create email session
      const newSession = await account.createEmailPasswordSession(email, password);
      setSession(newSession);

      // Get user details
      const currentUser = await account.get();
      setUser(currentUser);

      // Redirect to dashboard
      router.push('/dashboard');
      
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout current user
   */
  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Delete current session
      await account.deleteSession('current');
      
      // Clear state
      setUser(null);
      setSession(null);

      // Redirect to login
      router.push('/login');
      
      return { success: true };
    } catch (err) {
      console.error('Logout error:', err);
      setError(err.message || 'Failed to logout');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    error,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
