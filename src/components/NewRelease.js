import './NewRelease.css';
import { Link } from 'react-router-dom';
// import { useState } from 'react';

export default function NewRelease({ game }) {
  // const [mainImg, setMainImg] = useState(game.game_display_img);

  return (
    <Link to={`/detail/${game.game_id}`} className='home-new-release'>
    <p>NEW RELEASE</p>
    <div className='home-mobile'>
    {/* <div className='home-new-release-img' style={{backgroundImage: `url(${data.newGame.game_display_img})`}}> */}
      <div className='home-new-release-img'>
        <img className='' src={game.game_display_img} alt="new release game img" />
        <button>Discover More</button>
      </div>
      <h2>{game.game_name} - Now Available</h2>
    </div>

    <div className='home-desktop'>
      <div className='main-img'>
        <img src={game.game_display_img} alt="new release game img" />
      </div>
      <div className='main-info'>
        <h2>{game.game_name}</h2>
        <div className='new-imgs'>
          <div className='new-imgs-two'>
            <div>
              <img src={game.game_img_link[1]} alt="imgs" />
            </div>
            <div className='right-img'>
              <img src={game.game_img_link[2]} alt="imgs" />
            </div>
          </div>
          <div className='new-imgs-one'>
            <img src={game.game_img_link[0]} alt="imgs" />
          </div>
         
          
          {/* {data.newGame.game_img_link.map(img_link => (
            <img src={img_link} key={img_link} alt="img links" />
          ))} */}
        </div>
        <h2>Now Available</h2>
        {game.discount_percent !== 0 ? 
          <p>
            <span className='desktop-discount'>-{game.discount_percent}%</span>
            <span className='original-price'>CDN$ {game.game_price / 100}</span>
            CDN$ {(game.game_price * (100 - game.discount_percent) / 10000).toFixed(2)}
          </p> 
          : 
          <p>CDN$ {game.game_price / 100}</p>}
      </div>
    </div>
  </Link>
  )
}
