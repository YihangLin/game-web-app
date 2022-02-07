import './Detail.css';
import PlayBtn from '../../assets/play.png';
import Loading from '../../components/Loading';

import { useState, useEffect, useLayoutEffect, createRef } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useParams } from 'react-router';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateCartAPI } from '../../redux/reducers/cartReducer';
import { updateCart, setCartError } from '../../redux/actions/cartActions';

export default function Detail() {
  const { gameid } = useParams();
  const { data, error, isPending } = useFetch(`${process.env.REACT_APP_SERVER_URL}/games/${gameid}`);
  const [mainImg, setMainImg] = useState('');
  const [playVideo, setPlayVideo] = useState(true);
  const [descriptionLimit, setDescriptionLimit] = useState(true);
  const [requirmentsLimit, setRequirmentsLimit] = useState(true);
  const descriptionRef = createRef();
  const requirmentsRef = createRef();
  let navigate = useNavigate();

  const { cart, cartIsPending, cartError } = useSelector((state) => state.cartReducer);
  const { user } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    // reset cart error state
    dispatch(setCartError(null));

    if (data !== null) {
      setMainImg(data.game_img_link[0]);
    }
  }, [data, dispatch])

  useLayoutEffect(() => {
    if (data !== null) {
      //show READ MORE if actual height is larger than current height
      if (descriptionRef.current.clientHeight === descriptionRef.current.scrollHeight) {
        setDescriptionLimit(false);
      }

      if (requirmentsRef.current.clientHeight === requirmentsRef.current.scrollHeight) {
        setRequirmentsLimit(false);
      }
    }
  }, [descriptionRef, requirmentsRef, data])

  const handleImg = (gameimg) => {
    setPlayVideo(false);
    setMainImg(gameimg);
  }

  const handleAddToCart = (game) => {
    // if user is logged, update cart in database
    if (user) {
      dispatch(updateCartAPI('add', game));
      
    } else {
      // for guest, update cart in localstorage
      let currentItems = JSON.parse(localStorage.getItem('cart'));
      currentItems.push(game);

      localStorage.setItem('cart', JSON.stringify(currentItems));
      
      dispatch(updateCart(currentItems));
    }
  }

  return (
    <div>
      {error && <div className='error'>{error}</div>}
      {isPending && <Loading />}
      {data && 
      <div className='game-detail'>
        <div className='game-detail-info'>
          <h2 className='top-title'>{data.game_name}</h2>
          <div className='game-detail-imgs'>
            {playVideo ? 
              <video autoPlay controls muted>
                <source src={data.game_video_link} type='video/webm'/>
              </video> 
            :
              <img src={mainImg} alt="main game img" />
            }
            <div className='game-detail-small-img'>
              <div onClick={() => setPlayVideo(true)} className='game-detail-video'>
                <img src={PlayBtn} alt="video play" />
              </div>
              {data.game_img_link && data.game_img_link.map(gameimg => (
                <div onClick={() => handleImg(gameimg)} key={gameimg}>
                  <img src={gameimg} alt="game img" />
                </div>
              ))}
            </div>
          </div>

          <div className='game-detail-tags-price'>
            <div>
              <img src={data.game_display_img} alt="display img" />
              <h2>{data.game_name}</h2>
              <h3>{data.game_name}</h3>
            </div>

            <div className='game-detail-tags'>
              <p className='game-detail-tag-color'>Tags</p>
              <div className='tags-wrap'>
                {data.game_category && data.game_category.map(tag => (
                  <Link to={`/games/${tag}`} key={tag}>{tag}</Link>
                ))}
              </div>
            </div>

            <div className='game-detail-price-bg-color'>
              <p>Buy {data.game_name}</p>
              {data.discount_percent === 0 ?
                <div className='game-detail-price'>
                  <span className='game-price-nodiscount'>CDN {(data.game_price / 100).toLocaleString('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  {cart.includes(data.game_id) ?
                    <button className='game-detail-btn' onClick={()=> navigate('/cart')}>In Cart</button>
                  :
                  <>
                    {cartIsPending && <button className='game-detail-btn' disabled>Loading</button>}
                    {!cartIsPending && <button className='game-detail-btn' onClick={()=> handleAddToCart(data.game_id)}>Add to Cart</button>}
                  </>
                  }
                </div>
              :
                <div>
                  <div className='game-detail-offer-ends'>Offer ends {new Date(data.discount_expires).toLocaleString()}</div>
                  <div className='align-price-right'>
                    <div className='game-detail-price'>
                    <span className='game-detail-discount-percent'>-{data.discount_percent}%</span>
                    <div className='game-detail-discount'>
                      <div className='game-detail-orignal-price'>CDN {(data.game_price / 100).toLocaleString('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      <div>CDN {(data.game_price * (100 - data.discount_percent) / 10000).toLocaleString('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                    {cart.includes(data.game_id) ?
                      <button className='game-detail-btn' onClick={()=> navigate('/cart')}>In Cart</button>
                    :
                      <>
                        {cartIsPending && <button className='game-detail-btn' disabled>Loading</button>}
                        {!cartIsPending && <button className='game-detail-btn' onClick={()=> handleAddToCart(data.game_id)}>Add to Cart</button>}
                      </>
                    }
                    </div>
                  </div>
                </div>
              }
              {cartError && <div className='error'>{cartError}</div>}
            </div>
          </div>
        </div>

        <div className='game-description-requirments'>
          <h3 className='game-detail-section-h3'>ABOUT THIS GAME</h3>
          <p ref={descriptionRef} className={`game-description ${descriptionLimit ? 'text-limit' : ''}`}>{data.game_description}</p>
          {descriptionLimit && <p onClick={()=> setDescriptionLimit(false)} className='read-more'>READ MORE</p>}
        </div>

        <div className='game-description-requirments'>
        <h3 className='game-detail-section-h3'> SYSTEM REQUIREMENTS</h3>
        <div ref={requirmentsRef} className={`requirments ${requirmentsLimit ? 'text-limit' : ''}`}>
          <div>
            <p>MINIMUM:</p>
            <p>OS: {data.min_requirement_os}</p>
            <p>Processor: {data.min_requirement_processor}</p>
            <p>Memory: {data.min_requirement_memory}</p>
            <p>Graphics: {data.min_requirement_graphic}</p>
            <p>DirectX: {data.min_requirement_directx}</p>
            <p className='requirments-margin'>Storage: {data.min_requirement_storage}</p>
          </div>
        
          <div>
            <p>RECOMMENDED:</p>
            <p>OS: {data.rec_requirement_os}</p>
            <p>Processor: {data.rec_requirement_processor}</p>
            <p>Memory: {data.rec_requirement_memory}</p>
            <p>Graphics: {data.rec_requirement_graphic}</p>
            <p>DirectX: {data.rec_requirement_directx}</p>
            <p>Storage: {data.rec_requirement_storage}</p>
          </div>
        </div>
        {requirmentsLimit && <p onClick={() => setRequirmentsLimit(false)} className='read-more'>READ MORE</p>}
        </div>
      </div>}
    </div>
  )
}
