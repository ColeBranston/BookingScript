import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/isLoggedIn';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [password, setPassword]       = useState('');
  const [accessDenied, setAccessDenied] = useState(false);
  const [responseText, setResponseText] = useState('');
  const { dispatch }                   = useAuth();
  const navigate                       = useNavigate();

  // Try refreshing token on mount (browser will automatically send the HttpOnly cookie)
  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const resp = await fetch('https://bookingbackend.vercel.app/refresh-token', {
          method: 'POST',
          credentials: 'include'
        });
        if (resp.ok) {
          const { accessToken } = await resp.json();
          localStorage.setItem('accessToken', accessToken);
          dispatch({ type: 'LOGIN', payload: accessToken });
          navigate('/Dashboard');
        }
      } catch (err) {
        console.error('Auto-refresh failed:', err);
      }
    };
    tryRefresh();
  }, [dispatch, navigate]);

  const send = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('https://bookingbackend.vercel.app/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',      // ← needed to accept Set-Cookie
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Server Response:', data);

        if (data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken);
          dispatch({ type: 'LOGIN', payload: data.accessToken });
          setAccessDenied(false);
          navigate('/Dashboard');
        }
      } else {
        setAccessDenied(true);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setAccessDenied(true);
    } finally {
      setPassword('');
    }
  };

  const verify = async () => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await fetch('https://bookingbackend.vercel.app/isUserAuth', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${accessToken}` },
        credentials: 'include'
      });
      if (response.ok) setResponseText('You are Authenticated!');
      else             setResponseText('You are not Authenticated!');
    } catch (error) {
      console.error('Error during fetch:', error);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const resp = await fetch('https://bookingbackend.vercel.app/refresh-token', {
        method: 'POST',
        credentials: 'include'
      });
      if (resp.ok) {
        const { accessToken } = await resp.json();
        localStorage.setItem('accessToken', accessToken);
        dispatch({ type: 'LOGIN', payload: accessToken });
        setResponseText('Access token granted');
      } else {
        const errorData = await resp.json();
        setResponseText(errorData.message || 'Error refreshing token.');
      }
    } catch (err) {
      setResponseText('An unexpected error occurred.');
      console.error('Error refreshing access token:', err);
    }
  };

  // LOGOUT FUNCTION
  // const logout = () => {
  //   localStorage.removeItem('accessToken');
  //   dispatch({ type: 'LOGOUT' });
  //   navigate('/login');
  // };

  // Old Login Check
  // useEffect(() => {
  //   const user = localStorage.getItem("user");
  //   if (user) {
  //     setIsLoggedIn(true);
  //     console.log("Username found in localStorage:", user);
  //   }
  // }, []);

  return (
    <div className="formPage">
      <div className="formContainer">
        <form onSubmit={send}>
          <input
            className="mainInput"
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="hidden" type="submit">Submit</button>
        </form>
      </div>
      {accessDenied
        ? <p className="deniedText">Access Denied</p>
        : <p className="hidden">Access Denied</p>}
    </div>
  );
};

export default LoginForm;