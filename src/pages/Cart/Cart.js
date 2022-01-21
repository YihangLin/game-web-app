import { useState, useEffect } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCartItems } from '../../hooks/useCartItems';
import { useAddRemoveCart } from '../../hooks/useAddRemoveCart';
import { useCheckout } from '../../hooks/useCheckout';
import { Link } from 'react-router-dom';

import './Cart.css';
import Loading from '../../components/Loading';

export default function Cart() {
  const { cart, user } = useAuthContext();
  const { error, isPending, data } = useCartItems(cart);
  const { checkout, sessionError, sessionIsPending } = useCheckout();
  const { removeFromCart } = useAddRemoveCart();
  const removeError = useAddRemoveCart().error;
  const removeIsPending = useAddRemoveCart().isPending;
  const [cartDetail, setCartDetail] = useState(null);
  const [total, setTotal] = useState(null);

  const handleClick = (game) => {
    // remove the game from cart
    setCartDetail(prevItems => prevItems.filter(item => item.game_id !== game.game_id));

    //substract the price
    if (game.discount_percent !== 0) {
      setTotal(preValue => preValue - Math.round(game.game_price * (100 - game.discount_percent) / 100));
    } else {
      setTotal(preValue => preValue - game.game_price);
    }
  }

  useEffect(() => {
    if (data) {
      setCartDetail(data.games);
      //calculate the total price
      let sum = data.games.reduce((previousValue, currentValue) => {
        if (data.games.discount_percent !== 0) {
          return previousValue + Math.round(currentValue.game_price * (100 - currentValue.discount_percent) / 100);
        } else {
          return previousValue + currentValue.game_price;
        }
      }, 0);

      setTotal(sum);
    } 

  }, [data])

  return (
    <div className='cart-container'>
      <p>Your Shopping Cart: </p>
      {isPending && <Loading />}
      {error && <div className='error'>{error}</div>}
      {removeError && <div className='error'>{removeError}</div>}
      
      {cart.length !== 0 ?
        <div>
          {cartDetail && cartDetail.map(game => (
            <div key={game.game_id} className='cart-each-game'>
              <Link to={`/detail/${game.game_id}`} className='cart-game-info-container'>
                <div className='cart-img-container'>
                  <img src={game.game_display_img} alt="game" />
                </div>
                <p>{game.game_name}</p>
              </Link>
              {game.discount_percent === 0 ?
                <div className='cart-game-price'>
                  <p>CDN {(game.game_price / 100).toLocaleString('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  {removeIsPending && <p className='cart-remove'>Loading</p>}
                  {!removeIsPending && <p className='cart-remove' onClick={()=> {removeFromCart(game.game_id); handleClick(game)}}>Remove</p>}
                </div>
              :
                <div className='cart-game-price'>
                  <span>CDN {(game.game_price / 100).toLocaleString('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <p>CDN {(game.game_price * (100 - game.discount_percent) / 10000).toLocaleString('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  {removeIsPending && <p className='cart-remove'>Loading</p>}
                  {!removeIsPending && <p className='cart-remove' onClick={()=> {removeFromCart(game.game_id); handleClick(game)}}>Remove</p>}
                </div>
              }
            </div>
          ))}
        </div>
      :
        <p>Empty</p>
      }

      {cart.length !== 0 && 
        <div className='cart-checkout-container'>
          <div className='cart-total'>
            <p>Estimated total:</p> 
            <p>CAD {(total / 100).toLocaleString('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div className='cart-continue-btn'>
            {user ?
              <>
                {sessionIsPending && <button disabled>Loading</button>}
                {!sessionIsPending && <button onClick={()=> checkout()}>Continue to Checkout</button>}
              </>
              :
              <Link to='/login'>Continue to Checkout</Link>
            }
          </div>
        </div>
      }

      {sessionError && <div className='error'>{sessionError}</div>}

      <Link to='/' className='cart-shopping'>Continue Shopping</Link>

      <div className='hint'>
        <p>For payment test, use card#: 4242 4242 4242 4242</p>
        <p>Date: Any date in the future</p>
        <p>CVC: Any number is ok</p>
        <p>Name on Card: any names will work</p>
        <p>Postal Code: any number</p>
      </div>
    </div>
  )
}
