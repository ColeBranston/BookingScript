import React, { useState, createContext, useContext, useReducer, useEffect, useCallback } from 'react';

const AuthContext = createContext();

const initialState = {
  isAuthenticated: false,
  accessToken: localStorage.getItem('accessToken') || null,
  loading: true
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isAuthenticated: true, accessToken: action.payload, loading: false };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, accessToken: null, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_AUTH':
      return { ...state, isAuthenticated: action.payload.isAuthenticated, accessToken: action.payload.accessToken, loading: false };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const verifyToken = useCallback(async (token) => {
    if (!token) {
      dispatch({ type: 'SET_AUTH', payload: { isAuthenticated: false, accessToken: null } });
      return false;
    }

    try {
      const response = await fetch('http://localhost:3000/isUserAuth', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        dispatch({ type: 'SET_AUTH', payload: { isAuthenticated: true, accessToken: token } });
        return true;
      } else {
        dispatch({ type: 'SET_AUTH', payload: { isAuthenticated: false, accessToken: null } });
        return false;
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      dispatch({ type: 'SET_AUTH', payload: { isAuthenticated: false, accessToken: null } });
      return false;
    }
  }, []);

  const refreshToken = useCallback(async () => {
    if (state.isAuthenticated) {
      try {
        const response = await fetch('http://localhost:3000/refresh-token', {
          method: 'POST',
          credentials: 'include' // Necessary if your refresh token is in an HttpOnly cookie
        });
  
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('accessToken', data.accessToken);
          dispatch({ type: 'SET_AUTH', payload: { isAuthenticated: true, accessToken: data.accessToken } });
          return true;
        } else {
          throw new Error('Failed to refresh token');
        }
      } catch (error) {
        console.error('Error refreshing token:', error);
        dispatch({ type: 'LOGOUT' });
        return false;
      }
    }
  }, [state.isAuthenticated]);

  useEffect(() => {
    const initAuth = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      const token = localStorage.getItem('accessToken');
      if (!(await verifyToken(token))) {
        await refreshToken();
      }
    };

    initAuth();
  }, [verifyToken, refreshToken]);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const token = localStorage.getItem('accessToken');
      if (!token && !(await verifyToken(token))) {
        await refreshToken();
      }
    }, 500); //Check every 6 seconds

    return () => clearInterval(intervalId);
  }, [verifyToken, refreshToken]);

  const contextValue = {
    state,
    dispatch,
    refreshToken
  };

  return (
    <AuthContext.Provider value={contextValue}>
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