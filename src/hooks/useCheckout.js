import { useAuthContext } from "./useAuthContext";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";

export const useCheckout = () => {
  const { cart } = useAuthContext();
  const [isCancelled, setIsCancelled] = useState(false);
  const [sessionError, setSessionError] = useState(null);
  const [sessionIsPending, setSessionIsPending] = useState(false);
  const controller = new AbortController();
  const controllerRef = useRef(controller).current;
  let navigate = useNavigate();

  const checkout = async () => {
    setSessionIsPending(true);
    setSessionError(null);

    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/checkout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cart
        }),
        signal: controllerRef.signal
      },)

      if (!res.ok) {
        throw new Error(res.statusText);
      }
      
      const data = await res.json();

      if (!isCancelled) {
        setSessionError(null);
        setSessionIsPending(false);

        if (data.url) {
          window.location = data.url;
        } else {
          navigate('/login');
        }
      }

    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('the fetch was aborted.')
      } else {
        if (!isCancelled) {
          setSessionError(err.message);
          setSessionIsPending(false);
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

  return { checkout, sessionError, sessionIsPending }

}