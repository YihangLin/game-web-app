import { useState, useEffect, useRef } from 'react';
import { useAuthContext } from './useAuthContext';
import { useNavigate } from 'react-router';

export const useLogin = () => {
  // const [data, setData] = useState(null);
  // const [redirect, setRedirect] = useState(null);
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch, cart } = useAuthContext();
  const controller = new AbortController();
  const navigate = useNavigate();

  const controllerRef = useRef(controller).current;

  const login = async (email, password) => {
    setError(null);
    setIsPending(true);
    // dispatch({ type: 'IS_PENDING' });

    try {
      const user = {
        email,
        password,
        cart
      }
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user),
        signal: controllerRef.signal
      },)

      // console.log('RES: ', res.status);
      // console.log('TYPE: ', typeof(res.status));

      if (!res.ok) {
        switch(res.status) {
          case 401:
            throw new Error('Incorrect password or email.');
          case 404:
            throw new Error('User not found.');
          case 500:
            throw new Error('Database: error retrieving data.');
          default:
            throw new Error(res.statusText);
        }
      }

      const data = await res.json();

      dispatch({ type: 'LOGIN', payload: data });
      localStorage.clear();

      if (!isCancelled) {
        setIsPending(false);
        setError(null);
        // setRedirect(true);
        navigate(-1);
      }


    } catch (err) {
      // console.log('LOGIN ERROR: ', err.message);

      if (err.name === 'AbortError') {
        console.log('the fetch was aborted.')
      } else {
        if (!isCancelled) {
          setError(err.message);
          setIsPending(false);
        }
      }
    }
  }

  useEffect(() => {
   

    return () => {
      setIsCancelled(true);
      controllerRef.abort();
    }
  }, [controllerRef])

  return { isPending, error, login }
}