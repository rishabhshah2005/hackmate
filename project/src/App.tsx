import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout/Layout';
import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';
import Dashboard from './components/Dashboard/Dashboard';
import HackathonList from './components/Hackathons/HackathonList';
import MatchingPage from './components/Matching/MatchingPage';
import TeamsPage from './components/Teams/TeamsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" /> : <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={
        <PublicRoute>
          <LoginForm />
        </PublicRoute>
      } />
      <Route path="/signup" element={
        <PublicRoute>
          <SignupForm />
        </PublicRoute>
      } />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="hackathons" element={<HackathonList />} />
        <Route path="matching" element={<MatchingPage />} />
        <Route path="teams" element={<TeamsPage />} />
        <Route path="profile" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile page coming soon</h2></div>} />
        <Route path="settings" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings page coming soon</h2></div>} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <AppRoutes />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;