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

    // const response = await fetch("https://bookingbackend.vercel.app/api/login", {method:"POST", headers:{
    //   'Content-Type': 'application/json'
    //     }, body: JSON.stringify({
    //         "password" : password
    //     })})

    const response = await fetch("http://localhost:3000/login", {method:"POST", headers:{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        credentials: 'include'

      }}
      )

    if (response.ok) {
      const data = await res.json();
      localStorage.setItem('accessToken', data.accessToken);
      dispatch({ type: 'LOGIN', payload: data.accessToken });

      setAccessDenied(false)

    } else {
      setAccessDenied(true)
    }

    setPassword(''); // Clears the password state
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

    {/* This is a Break */}

    <div className='w-[100%] h-screen flex flex-col justify-center items-center'>
      <div className='md:w-[30%] lg:w-[30%] rounded-xl flex flex-col p-5 justify-center items-center mt-3 bg-[#d6f5d5]'>
        <h1 className='my-5 text-[20px]'>Register</h1>
        <form className='flex flex-col' onSubmit={register}>
          <input ref={username1} required type='text' className='my-3 p-2 focus:outline-none rounded-xl focus:bg-[#c9e6c8]' placeholder='Username' />
          <input ref={password1} required type='password' className='my-3 p-2 focus:outline-none rounded-xl focus:bg-[#c9e6c8]' placeholder='Password' />
          <button className='bg-[#dbc1e8] rounded-full my-3 p-2 w-[50%] mx-auto hover:bg-[#eea4fc]' type='submit'>Submit</button>
        </form>
      </div>
      <div className='md:w-[30%] lg:w-[30%] rounded-xl flex flex-col p-5 justify-center items-center mt-3 bg-[#d6f5d5]'>
        <h1 className='my-5 text-[20px]'>Login</h1>
        <form className='flex flex-col' onSubmit={login}>
          <input ref={username2} required type='text' className='my-3 p-2 focus:outline-none rounded-xl focus:bg-[#c9e6c8]' placeholder='Username' />
          <input ref={password2} required type='password' className='my-3 p-2 focus:outline-none rounded-xl focus:bg-[#c9e6c8]' placeholder='Password' />
          <button className='bg-[#dbc1e8] rounded-full my-3 p-2 w-[50%] mx-auto hover:bg-[#eea4fc]' type='submit'>Submit</button>
        </form>
      </div>
      <button onClick={() => verify()} className='bg-[#dbc1e8] rounded-full my-3 p-2 w-[10%] mx-auto hover:bg-[#eea4fc]'>Verify</button>
      <button onClick={() => refreshAccessToken()} className='bg-[#dbc1e8] rounded-full my-3 p-2 w-[10%] mx-auto hover:bg-[#eea4fc]'>Generate Valid Access Token</button>
      <button onClick={logout} className='bg-[#dbc1e8] rounded-full my-3 p-2 w-[10%] mx-auto hover:bg-[#eea4fc]'>Logout</button>
      <button className='bg-[#dbc1e8] rounded-full my-3 p-2 w-[10%] mx-auto hover:bg-[#eea4fc]'><Link to="/home">HomePage</Link></button>
      <p className='text-[red]'>{responseText}</p>
    </div>
    </>
  );
};

export default LoginForm;
