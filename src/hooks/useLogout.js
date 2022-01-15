import { useState, useEffect, useRef } from 'react';
import { useAuthContext } from './useAuthContext';

export const useLogout = () => {
  // const [data, setData] = useState(null);
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();
  const controller = new AbortController();

  const controllerRef = useRef(controller).current;

  const logout = async () => {
    setError(null);
    setIsPending(true);
    // dispatch({ type: 'IS_PENDING' });

    try {
      const res = await fetch('http://localhost:5000/logout', {
        credentials: 'include',
        signal: controllerRef.signal
      },)

      // console.log('RES: ', res.status);
      // console.log('TYPE: ', typeof(res.status));

      if (!res.ok) {
        throw new Error(res.statusText);
      }

      const data = await res.json();

      dispatch({ type: 'LOGOUT', payload: data });
      localStorage.setItem('cart', JSON.stringify([]));

      // localStorage.clear();
      console.log(data);

      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }

    } catch (err) {
      // console.log('LOGOUT ERROR: ', err.message);

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