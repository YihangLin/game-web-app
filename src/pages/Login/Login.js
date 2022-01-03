import './Login.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Email: ', email);
    console.log('Password: ', password);
  }

  return (
    <div className='form-section'>
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <label>
          <span>Email: </span>
          <input 
            required
            type="email" 
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </label>
        <label>
          <span>Password: </span>
          <input
            required
            type="password" 
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </label>
        <button>Login</button>
        <Link to='/signup'>
          <span>Don't have an account?</span>
          Sign Up!
        </Link>
      </form>
    </div>
  )
}
