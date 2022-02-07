import './Login.css';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser } from '../../redux/reducers/userReducer';
import { setAuthError } from '../../redux/actions/userActions';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { authError, authIsPending, user } = useSelector((state) => state.userReducer);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(loginUser(email, password));
  }

  useEffect(() => {
    // reset error state
    dispatch(setAuthError(null));
    // redirect if user is logged in
    if (user) {
      navigate(-1);
    }
  }, [user, navigate, dispatch])

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
        {!authIsPending && <button>Login</button>}
        {authIsPending && <button disabled>Loading</button>}
        <Link to='/signup'>
          <span>Don't have an account?</span>
          Sign Up Here!
        </Link>

        {authError && <div className='error'>{authError}</div>}
      </form>
    </div>
  )
}
