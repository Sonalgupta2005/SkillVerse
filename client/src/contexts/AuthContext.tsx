import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { User, apiService } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signin: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signup: (userData: { email: string; password: string; name: string; location?: string; skillsOffered?: {name: string; level: string}[]; skillsWanted?: {name: string; level: string}[] }) => Promise<{ success: boolean; message: string }>;
  signout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<{ success: boolean; message: string }>;
  toggleProfileVisibility: (isPublic: boolean) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      // Check if user is authenticated by calling the backend
      // No localStorage checking needed with HTTP-only cookies
      const currentUser = await apiService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const signin = async (email: string, password: string) => {
    setIsLoading(true);
    const response = await apiService.signin({ email, password });
    
    if (response.success && response.user) {
      setUser(response.user);
    }
    
    setIsLoading(false);
    return { success: response.success, message: response.message };
  };

  const signup = async (userData: { email: string; password: string; name: string; location?: string; skillsOffered?: {name: string; level: string}[]; skillsWanted?: {name: string; level: string}[] }) => {
    setIsLoading(true);
    const response = await apiService.signup(userData);
    
    if (response.success && response.user) {
      setUser(response.user);
    }
    
    setIsLoading(false);
    console.log(response);
    return { success: response.success, message: response.message };
  };

  const signout = async () => {
    setIsLoading(true);
    await apiService.signout();
    setUser(null);
    queryClient.clear();
    setIsLoading(false);
  };

  const updateUser = async (userData: Partial<User>) => {
    const response = await apiService.updateProfile(userData);
    
    if (response.success && response.user) {
      setUser(response.user);
    }
    
    return { success: response.success, message: response.message };
  };

  const toggleProfileVisibility = async (isPublic: boolean) => {
    const response = await apiService.toggleProfileVisibility(isPublic);
    
    if (response.success && user) {
      setUser({ ...user, profileVisibility: isPublic ? 'public' : 'private' });
    }
    
    return response;
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signin,
    signup,
    signout,
    updateUser,
    toggleProfileVisibility
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};