import { useState, useEffect, useRef } from 'react';
import { useAuthContext } from './useAuthContext';
import { useNavigate } from 'react-router';

export const useLogin = () => {
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

    try {
      const user = {
        email,
        password,
        cart
      }
      const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user),
        signal: controllerRef.signal
      },)

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
        navigate(-1);
      }

    } catch (err) {
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