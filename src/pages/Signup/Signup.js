import './Signup.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPasswordError(null);

    if (password !== confirmPassword) {
      setPasswordError('Password and Confirm Password does not match.')
    }

    console.log('Name: ', name);
    console.log('Email: ', email);
    console.log('Password: ', password);
    console.log('Confirm Password: ', confirmPassword);
  }

  return (
    <div className='form-section'>
      <form onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        <label>
          <span>Display Name: </span>
          <input
            required
            type="text" 
            pattern='.{1,12}'
            title='Display Name must be at most 12 characters'
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </label>

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
          <span>Password</span>
          <input
            required
            type="password"
            pattern='.{6,}'
            title='Password must be at least 6 characters'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </label>

        <label>
          <span>Confirm Password</span>
          <input
            required
            type="password" 
            pattern='.{6,}'
            title='Password must be at least 6 characters'
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
          />
        </label>

        <button>Sign Up</button>
        <Link to='/login'>
          <span>Already have an account?</span>
          Login!
        </Link>

      {passwordError && <div className='error'>{passwordError}</div>}
      </form>
    </div>
  )
}
