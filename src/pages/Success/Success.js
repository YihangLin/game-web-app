import { useEffect } from 'react';
import { useSearchParams } from "react-router-dom"
import { useFetch } from "../../hooks/useFetch";
// import { useAuthContext } from '../../hooks/useAuthContext';

import { useDispatch } from 'react-redux';
import { updateCart } from '../../redux/actions/cartActions';

import Loading from "../../components/Loading";
import '../Cart/Cart.css';

export default function Success() {
  let [searchParams] = useSearchParams();
  const {data, error, isPending } = useFetch(`${process.env.REACT_APP_SERVER_URL}/success?q=${searchParams.get('q')}`);
  // const { dispatch } = useAuthContext();
  const dispatch = useDispatch();

  useEffect(() => {
    // console.log('success dispath');
    if (data) {
      dispatch(updateCart([]));
      // dispatch({ type: 'UPDATE_CART', payload: []});
    }
  }, [data, dispatch])

  return (
    <div>
      {isPending && <Loading />}
      {error && <div className='error'>{error}</div>}
      {data && 
        <div className='cart-container'>
          <h2>{data}</h2>
        </div>
      }
    </div>
  )
}
