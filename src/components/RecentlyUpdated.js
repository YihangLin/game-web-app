import './RecentlyUpdated.css';
import { Link } from 'react-router-dom';

export default function RecentlyUpdated({ games }) {
  return (
    <div className='updated-games'>
      {games.map(game => (
        <Link key={game.game_id} to={`/detail/${game.game_id}`}>
          <div className='updated-game'>
            <img src={game.game_display_img} alt="game img" />
            <div className='updated-game-info'>
              <div className='updated-game-name'>{game.game_name}</div>
              <div className='updated-game-category'>
                {game.game_category.map(category => (
                  <span key={category}>{category}</span>
                ))}
              </div>
              {game.discount_percent === 0 ?
                <span className='updated-game-price updated-game-nodiscount'>CDN {(game.game_price / 100).toLocaleString('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                :
                <div className='updated-game-price'>
                  <span className='updated-discount-percent'>-{game.discount_percent}%</span>
                  <span className='updated-original-price'>CDN {(game.game_price / 100).toLocaleString('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <span>CDN {(game.game_price * (100 - game.discount_percent) / 10000).toLocaleString('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              }
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
