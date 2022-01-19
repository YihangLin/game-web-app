import { useState, useEffect, useRef } from 'react';
import { useAuthContext } from './useAuthContext';

export const useLogout = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();
  const controller = new AbortController();

  const controllerRef = useRef(controller).current;

  const logout = async () => {
    setError(null);
    setIsPending(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/logout`, {
        credentials: 'include',
        signal: controllerRef.signal
      },)

      if (!res.ok) {
        throw new Error(res.statusText);
      }

      const data = await res.json();

      dispatch({ type: 'LOGOUT', payload: data });
      localStorage.setItem('cart', JSON.stringify([]));

      if (!isCancelled) {
        setIsPending(false);
        setError(null);
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

  return { isPending, error, logout }
}