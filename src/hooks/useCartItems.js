import { useEffect, useState, useRef } from "react"

export const useCartItems = (cart) => {
  const [isPending, setIsPending] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const cartRef = useRef(cart).current;
  // console.log('CartRef: ', cartRef);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setIsPending(true);

      try {
        const res = await fetch('http://localhost:5000/cart', { 
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            cart: cartRef
          }),
          signal: controller.signal 
        });
        if (!res.ok) {
          throw new Error(res.statusText);
        }

        const data = await res.json();
        setIsPending(false);
        setData(data);
        setError(null);

      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('The fetch was aborted.');
        } else {
          setIsPending(false);
          setError('Could not fetch the data');
        }
      }
    }

    console.log('cart hook fetched once');

    if (cartRef && cartRef.length !== 0) {
      fetchData();
    } else {
      setData(null);
    }

    return () => {
      controller.abort();
    }

  }, [cartRef])

  return { data, isPending, error };
}