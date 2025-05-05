// src/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/isLoggedIn';

const ProtectedRoute = ({ element: Component }) => {
  const { state, refreshToken } = useAuth();
  const { isAuthenticated, loading } = state;

  React.useEffect(() => {
    if (!isAuthenticated && !loading) {
      console.log("Getting Refresh Token")
      refreshToken();
    }
  }, [isAuthenticated, loading, refreshToken]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? Component : <Navigate to="/" replace />;
};

export default ProtectedRoute;