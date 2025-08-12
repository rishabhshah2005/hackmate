import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
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

  const login = async (email, password) => {
    setIsLoading(true);
    // Mock login - replace with actual API call
    return new Promise((resolve) => {
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
        resolve();
      }, 1000);
    });
  };

  const signup = async (userData) => {
    setIsLoading(true);
    // Mock signup - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem('authToken', 'mock-jwt-token');
        setUser({
          id: Date.now().toString(),
          ...userData,
          rating: 0
        });
        setIsLoading(false);
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const updateProfile = async (userData) => {
    setIsLoading(true);
    // Mock update - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        if (user) {
          setUser({ ...user, ...userData });
        }
        setIsLoading(false);
        resolve();
      }, 500);
    });
  };

  const value = {
    user,
    login,
    signup,
    logout,
    updateProfile,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
