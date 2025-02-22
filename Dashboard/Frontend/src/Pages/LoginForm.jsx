import React, { useState } from 'react';

const LoginForm = () => {
  const [password, setPassword] = useState('');

  const send = async (event) => {
    event.preventDefault();
    setPassword(''); // Clears the password state
  };

  return (
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
    </div>
  );
};

export default LoginForm;
