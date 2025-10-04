import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthUser, LoginRequest, RegisterRequest, UpdateProfileRequest } from '../types';
import { authService } from '../services/auth.service';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    console.log('[AuthContext] useEffect running - initializing auth');

    const initAuth = async () => {
      console.log('[AuthContext] initAuth started');
      const savedToken = localStorage.getItem('token');
      const savedUser = authService.getStoredUser();

      console.log('[AuthContext] savedToken:', !!savedToken);
      console.log('[AuthContext] savedUser:', !!savedUser);

      if (savedToken) {
        console.log('[AuthContext] Token found, setting token');
        setToken(savedToken);

        if (savedUser) {
          console.log('[AuthContext] Cached user found, setting user');
          setUser(savedUser);
        }

        // Validate token by fetching fresh profile
        console.log('[AuthContext] About to fetch profile from API');
        try {
          const freshProfile = await authService.getProfile();
          console.log('[AuthContext] Profile fetched successfully:', freshProfile);
          setUser(freshProfile);
        } catch (error) {
          // Token invalid, clear auth state
          console.error('[AuthContext] Failed to validate token:', error);
          authService.logout();
          setToken(null);
          setUser(null);
        }
      } else {
        console.log('[AuthContext] No token found in localStorage');
      }

      console.log('[AuthContext] initAuth complete, setting loading to false');
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      const response = await authService.login(credentials);
      setToken(response.data.token);

      // Fetch full user profile
      const profile = await authService.getProfile();
      setUser(profile);

      toast.success(`Welcome back, ${profile.fullName}!`);
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
      throw error;
    }
  }, []);

  // Register function
  const register = useCallback(async (data: RegisterRequest) => {
    try {
      const response = await authService.register(data);
      setToken(response.data.token);

      // Fetch full user profile
      const profile = await authService.getProfile();
      setUser(profile);

      toast.success(`Welcome, ${profile.fullName}!`);
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    authService.logout();
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  }, []);

  // Update profile function
  const updateProfile = useCallback(async (data: UpdateProfileRequest) => {
    try {
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
      throw error;
    }
  }, []);

  // Refresh profile function
  const refreshProfile = useCallback(async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile);
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    updateProfile,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
