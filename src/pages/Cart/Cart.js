import './Cart.css';
import { useState, useEffect } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCartItems } from '../../hooks/useCartItems';
import { useAddRemoveCart } from '../../hooks/useAddRemoveCart';
import Loading from '../../components/Loading';

export default function Cart() {
  const { cart } = useAuthContext();
  const { error, isPending, data } = useCartItems(cart);
  const { removeFromCart } = useAddRemoveCart();
  const removeError = useAddRemoveCart().error;
  const removeIsPending = useAddRemoveCart().isPending;
  const [cartDetail, setCartDetail] = useState(null);
  const [total, setTotal] = useState(null);

  // console.log('cart: ', cart);
  // console.log('cart data: ', data);
  // console.log('cart data: ', error);
  // console.log('cart data: ', isPending);
  const handleClick = (game) => {
    setCartDetail(prevItems => prevItems.filter(item => item.game_id !== game.game_id));


    if (game.discount_percent !== 0) {
      setTotal(preValue => preValue - (game.game_price * ((100 - game.discount_percent) / 100)));
    } else {
      
      setTotal(preValue => preValue - game.game_price);
    }
  }


  useEffect(() => {
    
    console.log('cart detail render');
    if (data) {
      setCartDetail(data.games);
      // console.log(data.games);
      let sum = data.games.reduce((previousValue, currentValue) => {
        // console.log(previousValue);
          // return previousValue + currentValue.game_price;

        if (data.games.discount_percent !== 0) {
          return previousValue + (currentValue.game_price * ((100 - currentValue.discount_percent) / 100));
        } else {
          return previousValue + currentValue.game_price;
        }
      }, 0);

      setTotal(sum);
    } 

  }, [data])

  return (
    <div className='cart'>
      <h2>Your Shopping Cart: </h2>
      {isPending && <Loading />}
      {error && <div className='error'>{error}</div>}
      {removeError && <div className='error'>{removeError}</div>}
      {/* {cartDetail && cartDetail.map((game) => (
        <div key={game.game_id}>
          {game.game_name}
          {removeIsPending && <button disabled>Loading</button>}
          {!removeIsPending && <button onClick={()=> {removeFromCart(game.game_id); handleClick(game.game_id)}}>remove</button>}
        </div>
      )) } */}
      {cart.length !== 0 ?
        <div>
          {cartDetail && cartDetail.map(game => (
            <div key={game.game_id}>
              {game.game_name}
              {/* {game.game_price} */}
              {removeIsPending && <button disabled>Loading</button>}
              {!removeIsPending && <button onClick={()=> {removeFromCart(game.game_id); handleClick(game)}}>Remove</button>}
            </div>
          ))}
          Total: CAD {(total / 100).toLocaleString('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      :
          <p>Empty</p>
      }
      
    </div>
  )
}
