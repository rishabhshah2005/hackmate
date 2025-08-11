import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  skills: string[];
  interests: string[];
  experience: string;
  github?: string;
  linkedin?: string;
  leetcode?: string;
  bio?: string;
  rating?: number;
  location?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  isLoading: boolean;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth token
    const token = localStorage.getItem('authToken');
    if (token) {
      // Mock user data - in real app, decode token or fetch user
      setUser({
        id: '1',
        name: 'Alex Johnson',
        email: 'alex@example.com',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        skills: ['React', 'Node.js', 'Python', 'Machine Learning'],
        interests: ['AI/ML', 'Web Development', 'Mobile Apps'],
        experience: 'intermediate',
        github: 'alexj',
        linkedin: 'alexjohnson',
        bio: 'Passionate full-stack developer with ML experience',
        rating: 4.8,
        location: 'San Francisco, CA'
      });
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Mock login - replace with actual API call
    setTimeout(() => {
      localStorage.setItem('authToken', 'mock-jwt-token');
      setUser({
        id: '1',
        name: 'Alex Johnson',
        email,
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        skills: ['React', 'Node.js', 'Python', 'Machine Learning'],
        interests: ['AI/ML', 'Web Development', 'Mobile Apps'],
        experience: 'intermediate',
        github: 'alexj',
        linkedin: 'alexjohnson',
        bio: 'Passionate full-stack developer with ML experience',
        rating: 4.8,
        location: 'San Francisco, CA'
      });
      setIsLoading(false);
    }, 1000);
  };

  const signup = async (userData: any) => {
    setIsLoading(true);
    // Mock signup - replace with actual API call
    setTimeout(() => {
      localStorage.setItem('authToken', 'mock-jwt-token');
      setUser({
        id: Date.now().toString(),
        ...userData,
        rating: 0
      });
      setIsLoading(false);
    }, 1000);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const updateProfile = async (userData: Partial<User>) => {
    setIsLoading(true);
    // Mock update - replace with actual API call
    setTimeout(() => {
      if (user) {
        setUser({ ...user, ...userData });
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      updateProfile,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};