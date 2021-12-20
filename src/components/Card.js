import './Card.css';
import { Link } from 'react-router-dom';

export default function Card({ game }) {
  return (
    <Link to={`/detail/${game.game_id}`} className='game-card'>
      <img src={game.game_display_img} alt="game img" />
      {game.discount_percent === 0 ?
        <div className='game-info'>
          <div className='game-info-name game-name-limit'>{game.game_name}</div>
          <div className='game-info-price'>CDN$ {game.game_price / 100}</div>
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
              <span className='game-original-price'>CDN$ {game.game_price / 100}</span>
              <div>CDN$ {(game.game_price * (100 - game.discount_percent) / 10000).toFixed(2)}</div>
            </div>
          </div>
        </div>
      }
    </Link>
    // <div className='group-show-one'>
    //   <img src={game.game_display_img} alt="game img" />
    //   {game.discount_percent === 0 ?
    //     <div className='game-info'>
    //       <div className='game-name game-info-split-55'>{game.game_name}</div>
    //       <div className='game-info-price game-info-split-45'>CDN$ {(game.game_price / 100).toFixed(2)}</div>
    //     </div>
    //     :
    //     <div className='game-info'>
    //       <div className='game-info-split-55'>
    //         <div className='game-name'>{game.game_name}</div>
    //         <div className='game-offer'>
    //           <div>Offer ends</div>
    //           <div>{new Date(game.discount_expires).toLocaleString()}</div>
    //         </div>
    //       </div>
    //       <div className='game-discount-price game-info-split-45'>
    //         <div className='game-discount-percent'>-{game.discount_percent}%</div>
    //         <div className='game-info-price'>
    //           <div className='game-info-discount'>CDN$ {game.game_price / 100}</div>
    //           <div>CDN$ {(game.game_price * (100 - game.discount_percent) / 10000).toFixed(2)}</div>
    //         </div>
    //       </div>
    //     </div>
    //   }
    // </div>
  )
}
