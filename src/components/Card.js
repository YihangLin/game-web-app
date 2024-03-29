import './Card.css';
import { Link } from 'react-router-dom';

export default function Card({ game }) {
  return (
    <Link to={`/detail/${game.game_id}`} className='game-card'>
      <img src={game.game_display_img} alt="game img" />
      {game.discount_percent === 0 ?
        <div className='game-info'>
          <div className='game-info-name game-name-limit'>{game.game_name}</div>
          <div className='game-info-price'>CDN {(game.game_price / 100).toLocaleString('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
        :
        <div className='game-info'>
          <div className='game-name-limit'>
            <div className='game-info-name'>{game.game_name}</div>
            <span>Offer ends</span>
            <span>{new Date(game.discount_expires).toLocaleString()}</span>
          </div>

          <div className='game-price-with-discount'>
            <div className='game-info-discount'>-{game.discount_percent}%</div>
            <div className='game-info-price'>
              <span className='game-original-price'>CDN {(game.game_price / 100).toLocaleString('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <div>CDN {(game.game_price * (100 - game.discount_percent) / 10000).toLocaleString('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
          </div>
        </div>
      }
    </Link>
  )
}
