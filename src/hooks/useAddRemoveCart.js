import { useState, useEffect, useRef } from 'react';
import { useAuthContext } from './useAuthContext';
import { useNavigate } from 'react-router';

export const useAddRemoveCart = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch, user } = useAuthContext();
  let navigate = useNavigate();
  const controller = new AbortController();
  const controllerRef = useRef(controller).current;

  const putData = async (url, game) => {
    setError(null);
    setIsPending(true);

    try {
      const res = await fetch(url, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          game: game
        }),
        signal: controllerRef.signal
      },)

      if (!res.ok) {
          if (res.status === 500) {
            throw new Error('Database: error adding/removing data.');
          } else {
            throw new Error(res.statusText);
          }
      }

      const data = await res.json();

      if (data.user) {
        dispatch({ type: 'UPDATE_CART', payload: data.cart })
      } else {
        navigate('/login');
      }

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

  const addToCart = async (game) => {
    if (user) {
      putData(`${process.env.REACT_APP_SERVER_URL}/add`, game);
      
    } else {
      let currentItems = JSON.parse(localStorage.getItem('cart'));
      currentItems.push(game);

      localStorage.setItem('cart', JSON.stringify(currentItems));
      
      dispatch({ type: 'UPDATE_CART', payload: currentItems });
    }

  }

  const removeFromCart = async (game) => {
    if (user) {
     putData(`${process.env.REACT_APP_SERVER_URL}/remove`, game);
    } else {
      const currentItems = JSON.parse(localStorage.getItem('cart'));
      const afterRemove = currentItems.filter(item => game !== item);

      localStorage.setItem('cart', JSON.stringify(afterRemove));

      dispatch({ type: 'UPDATE_CART', payload: afterRemove });
    }
  }

  useEffect(() => {
    return () => {
      setIsCancelled(true);
      controllerRef.abort();
    }
  }, [controllerRef])

  return { isPending, error, addToCart, removeFromCart }
}