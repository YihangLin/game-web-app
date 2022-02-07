import '../Login/Login.css';

import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signupUser } from '../../redux/reducers/userReducer';


export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null);
  const navigate = useNavigate();
  const { authIsPending, authError, user } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    setPasswordError(null);

    if (password !== confirmPassword) {
      setPasswordError('Password and Confirm Password does not match.')
    } else {
      dispatch(signupUser(email, password, name));
    }
  }

  useEffect(() => {
    // redirect if user has logged in
    if (user) {
      navigate(-1);
    }
  }, [user, navigate])

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

        {!authIsPending && <button>Sign Up</button>}
        {authIsPending && <button disabled>Loading</button>}
        <Link to='/login'>
          <span>Already have an account?</span>
          Login Here!
        </Link>

      {authError && <div className='error'>{authError}</div>}
      {passwordError && <div className='error'>{passwordError}</div>}
      </form>
    </div>
  )
}
