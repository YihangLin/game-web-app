import { useEffect, useState } from "react"

export const useFetch = (url) => {
  const [isPending, setIsPending] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setIsPending(true);

      try {
        const res = await fetch(url, {
          credentials: 'include',
          signal: controller.signal 
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data);
        }

        setIsPending(false);
        setData(data);
        setError(null);

      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('The fetch was aborted.');
        } else {
          setIsPending(false);
          setError(err.message);
        }
      }
    }

    fetchData();

    return () => {
      controller.abort();
    }

  }, [url])

  return { data, isPending, error };
}