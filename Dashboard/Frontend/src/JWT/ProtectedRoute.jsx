import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/isLoggedIn';

const ProtectedRoute = ({ element: Component }) => {
  const { state, refreshToken } = useAuth();
  const { isAuthenticated, loading } = state;

  const [triedRefresh, setTriedRefresh] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    const tryRefresh = async () => {
      if (!isAuthenticated && !loading && !triedRefresh) {
        console.log("Trying to refresh token...");
        setRefreshing(true);
        const success = await refreshToken();
        setTriedRefresh(true);
        setRefreshing(false);
      }
    };
    tryRefresh();
  }, [isAuthenticated, loading, triedRefresh, refreshToken]);

  if (loading || refreshing) {
    return <div>Loading...</div>;
  }

  // ✅ Only redirect *after* a failed refresh
  if (!isAuthenticated && triedRefresh) {
    return <Navigate to="/" replace />;
  }

  return isAuthenticated ? Component : <div>Loading...</div>; // still waiting to try refresh
};

export default ProtectedRoute;
