import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Cookies from 'js-cookie';
import { useAuth } from '../contexts/isLoggedIn';
import { Link, useNavigate } from 'react-router-dom';


const LoginForm = () => {

  const [password, setPassword] = useState('');
  const [accessDenied, setAccessDenied] = useState(false)
  const { dispatch } = useAuth();


  const send = async (event) => {
    event.preventDefault();
  
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "password": password }),
      });
  
      if (response.ok) {
        const contentType = response.headers.get("Content-Type");
  
        let data;
        if (contentType && contentType.includes("application/json")) {
          data = await response.json(); // Parse JSON if the response is JSON
        } else {
          data = await response.text(); // Parse as text if it's not JSON
        }
  
        console.log("Server Response:", data);
  
        // If the response contains an access token in JSON, handle it
        if (typeof data === "object" && data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken);
          dispatch({ type: 'LOGIN', payload: data.accessToken });
          setAccessDenied(false);
        } else {
          console.log("Non-JSON successful response:", data);
          setAccessDenied(false);
        }
  
      } else {
        setAccessDenied(true);
      }
  
      setPassword(''); // Clears the password state
    } catch (error) {
      console.error("Error during login:", error);
      setAccessDenied(true); // Handle errors properly
    }
  };

  const verify = async () => {
    const accessToken = localStorage.getItem('accessToken');
  
    try {
      const response = await fetch('http://localhost:3000/isUserAuth', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      if (response.ok) {
        const data = await response.text();
        console.log(data);
        setResponseText("You are Authenticated!");
      } else {
        console.error('Failed to authenticate:', response.statusText);
        setResponseText("You are not Authenticated!");
      }
    } catch (error) {
      console.error('Error during fetch:', error);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const response = await fetch('http://localhost:3000/refresh-token', {
        method: 'POST',
        credentials: 'include'
      });
    
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);
        dispatch({ type: 'LOGIN', payload: data.accessToken });
        setResponseText("Access token granted");
      } else {
        const errorData = await response.json();
        setResponseText(errorData.message || 'An error occurred while refreshing the token.');
      }
    } catch (error) {
      setResponseText('An unexpected error occurred.');
      console.error('Error refreshing access token:', error);
    }
  };

  // LOGOUT FUNCTION

  // const logout = () => {

  //   localStorage.removeItem('accessToken'); // Remove the access token
    
  //   dispatch({ type: 'LOGOUT' });

  //   navigate('/login'); // Redirect to the login page
  // };

  // Old Login Check

  // useEffect(() => {
  //   const user = localStorage.getItem("user"); //Gets the user from the local storage
  //   if (user) { //If the user is indeed, logged in this will trigger refreshing the app for corresponding content
  //       setIsLoggedIn(true)
  //       console.log("Username found in localStorage:", user);
  //     } else {
  //       console.log("No username found in localStorage");
  //   }
  // }, []);

  return (
    <>
    <div className="formPage">
      <div className="formContainer">
        <form onSubmit={send}>
          <input
            className="mainInput"
            required
            type="password"
            value={password} // Add the value attribute
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className='hidden' type="submit">Submit</button>
        </form>
      </div>
      {accessDenied? <p className='deniedText'>Access Denied</p> : <p className='hidden'>Access Denied</p>}
    </div>
    </>
  );
};

export default LoginForm;
