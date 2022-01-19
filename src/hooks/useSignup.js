import { useState, useEffect, useRef } from 'react';
import { useAuthContext } from './useAuthContext';
import { useNavigate } from 'react-router';

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch, cart } = useAuthContext();
  const controller = new AbortController();
  const navigate = useNavigate();

  const controllerRef = useRef(controller).current;

  const signup = async (email, password, name) => {
    setError(null);
    setIsPending(true);

    try {
      const user = {
        email,
        password,
        name,
        cart
      }
      const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/signup`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user),
        signal: controllerRef.signal
      },)

      if (!res.ok) {
        switch (res.status) {
          case 409:
            throw new Error('Email has been registered.');
          case 500:
            throw new Error('Database registration error.')
          default:
            throw new Error(res.statusText);
        }
      }

      const data = await res.json();

      dispatch({ type: 'SIGN_UP', payload: data });
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

  return { isPending, error, signup }
}