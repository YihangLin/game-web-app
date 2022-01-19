import './OrderHistory.css';

import { useFetch } from '../../hooks/useFetch';
import Loading from '../../components/Loading';

export default function History() {
  const { data, error, isPending } = useFetch(`${process.env.REACT_APP_SERVER_URL}/orders`);

  return (
    <div className='cart-container'>
      <p>Your Orders:</p>
      {isPending && <Loading />}
      {error && <div className='error'>{error}</div>}
      {data && data.orders.length !== 0 &&
        data.orders.map(order => (
          <div key={order.order_id} className='order'>
            <div className='order-id-time'>
              <p>Order ID: {order.order_id}</p>
              <p>At {new Date(order.order_complete_time).toLocaleString()}</p>
            </div>
            {order.order_games.map(game => (
              <div key={game.game_name} className='cart-each-game'>
                <div className='cart-game-info-container'>
                  <div className='cart-img-container'>
                    <img src={game.game_display_img} alt="game" />
                  </div>
                  <p>{game.game_name}</p>
                </div>
                
                <div className='cart-game-price'>
                  <p>CDN {(game.game_price / 100).toLocaleString('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>   
              </div>
            ))}
          </div>
        ))
      }
      {(!data || data.orders.length === 0) &&
        <div>
          You haven't placed any orders yet.
        </div>
      }
    </div>
  )
}
