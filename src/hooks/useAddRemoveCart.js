import { useState, useEffect, useRef } from 'react';
import { useAuthContext } from './useAuthContext';
import { useNavigate } from 'react-router';

export const useAddRemoveCart = () => {
  // const [data, setData] = useState(null);
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch, user } = useAuthContext();
  let navigate = useNavigate();
  const controller = new AbortController();
  const controllerRef = useRef(controller).current;

  // console.log('data value: ', data);

  const putData = async (url, game) => {
    setError(null);
    setIsPending(true);

    console.log('id to delete', game);

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

      // console.log('RES: ', res.status);
      // console.log('TYPE: ', typeof(res.status));

      if (!res.ok) {
          if (res.status === 500) {
            throw new Error('Database: error adding/removing data.');
          } else {
            throw new Error(res.statusText);
          }
      }

      const data = await res.json();

      if (data.user) {
        console.log('HOOK UPDATE CART WITH USER!')
        dispatch({ type: 'UPDATE_CART', payload: data.cart })
      } else {
        navigate('/login');
      }

      // dispatch({ type: 'LOGIN', payload: data });
      // localStorage.clear();

      if (!isCancelled) {

        // console.log('setting data');

        // setData(data);
        setIsPending(false);
        setError(null);
      }

      // return data;

    } catch (err) {
      // console.log('Error Adding/Removing cart items: ', err.message);

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
    // console.log('enter add cart');

  
    if (user) {
      putData('http://localhost:5000/add', game);


      
    } else {
      let currentItems = JSON.parse(localStorage.getItem('cart'));

      currentItems.push(game);

      localStorage.setItem('cart', JSON.stringify(currentItems));
      
      console.log('UPDATE ADD CART WITHOUT USER!')

      dispatch({ type: 'UPDATE_CART', payload: currentItems });
    }

    // dispatch({ type: 'IS_PENDING' });

    
  }

  const removeFromCart = async (game) => {

    if (user) {
     putData('http://localhost:5000/remove', game);

      // console.log('datatata:', data);

      // if (!isCancelled) {


      //   setData(result);
      //   setIsPending(false);
      //   setError(null);
      // }

      // if (result.user) {
      //   console.log('User TRUE, REMOVED!')

      //   dispatch({ type: 'REMOVE_FROM_CART', payload: result.cart })
      // } else {
      //   navigate('/login');
      // }
    } else {
      const currentItems = JSON.parse(localStorage.getItem('cart'));
      const afterRemove = currentItems.filter(item => game !== item);

      console.log('current cart: ', currentItems);
      console.log('after cart: ', afterRemove);

      localStorage.setItem('cart', JSON.stringify(afterRemove));

      console.log('UPDATE REMOVE CART WITHOU USER!')

      dispatch({ type: 'UPDATE_CART', payload: afterRemove });
    }
   

    
  }

  useEffect(() => {

    console.log('add remove render');

    return () => {
      setIsCancelled(true);
      controllerRef.abort();
    }
  }, [controllerRef])

  return { isPending, error, addToCart, removeFromCart }
}