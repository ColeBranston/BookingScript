import React, { useState } from 'react';
import { useContext } from 'react';
import { checkLogin } from '../contexts/isLoggedIn';
import { Navigate } from 'react-router-dom';

const LoginForm = () => {

  const {isLoggedIn, setIsLoggedIn} = useContext(checkLogin)

  const [password, setPassword] = useState('');
  const [accessDenied, setAccessDenied] = useState(false)

  const send = async (event) => {
    event.preventDefault();

    const response = await fetch("http://localhost:4000/api/login", {method:"POST", headers:{
      'Content-Type': 'application/json'
        }, body: JSON.stringify({
            "password" : password
        })})

    if (response.ok) {
      setIsLoggedIn(true)
      setAccessDenied(false)
    } else {
      setAccessDenied(true)
    }

    setPassword(''); // Clears the password state
  };

  return (
    <>
    {isLoggedIn? <Navigate to="/Dashboard"/> : null}
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
