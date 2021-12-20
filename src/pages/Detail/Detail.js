import './Detail.css';
import PlayBtn from '../../assets/play.png';
import { useState, useEffect, useLayoutEffect, createRef } from 'react';
import Loading from '../../components/Loading';
import { useFetch } from '../../hooks/useFetch';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

export default function Detail() {
  const { gameid } = useParams();
  const { data, error, isPending } = useFetch(`http://localhost:5000/games/${gameid}`);
  const [mainImg, setMainImg] = useState('');
  const [playVideo, setPlayVideo] = useState(true);
  const [descriptionLimit, setDescriptionLimit] = useState(true);
  const [requirmentsLimit, setRequirmentsLimit] = useState(true);
  const descriptionRef = createRef();
  const requirmentsRef = createRef();

  useEffect(() => {
    if (data !== null) {
      setMainImg(data.game_img_link[0]);
    }
  }, [data])

  useLayoutEffect(() => {
    if (data !== null) {

      if (descriptionRef.current.clientHeight === descriptionRef.current.scrollHeight) {
        //  console.log(heightRef.current.clientHeight);
          // console.log('s height', heightRef.current.scrollHeight);
        // console.log('setting');
        setDescriptionLimit(false);
      }

      if (requirmentsRef.current.clientHeight === requirmentsRef.current.scrollHeight) {
        setRequirmentsLimit(false);
      }
      // else {
        // console.log(heightRef.current.clientHeight);
    // console.log('s height', heightRef.current.scrollHeight);
      // }
    // console.log(heightRef.current.clientHeight);
    // console.log('s height', heightRef.current.scrollHeight);
    // if (heightRef.current.)
    }
  }, [descriptionRef, requirmentsRef, data])

  const handleImg = (gameimg) => {
    setPlayVideo(false);
    setMainImg(gameimg);
  }

  // console.log(data);
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
              // <div className='main-video-img'>
                <video autoPlay controls muted>
                  <source src={data.game_video_link} type='video/webm'/>
                </video> 
              // </div>
              :
              // <div className='main-video-img'>
                <img src={mainImg} alt="main game img" />
              // </div>
              }
            <div className='game-detail-small-img'>
              <div className='game-detail-video' onClick={() => setPlayVideo(true)}>
                <img className='filter-img' src={data.game_img_link[0]} alt="img for video" />
                <span className='play-btn'>
                  <img src={PlayBtn} alt="play btn" />
                </span>
              </div>
              {data.game_img_link && data.game_img_link.map(gameimg => (
                <div key={gameimg}>
                  <img onClick={() => handleImg(gameimg)} src={gameimg} alt="game img" />
                </div>
              ))}
             
            </div>
          </div>

          <div className='game-detail-tags-price'>
            <div>
              <img src={data.game_display_img} alt="display img" />
              <h2>{data.game_name}</h2>
              <h3>{data.game_name}</h3>
              {/* <p className='game-detail-short-description'>{data.game_description}</p> */}
            </div>


            <div className='game-detail-tags'>
              <p className='game-detail-tag-color'>Tags</p>
              <div className='tags-wrap'>
                {data.game_category && data.game_category.map(tag => (
                  <Link to={`/games/${tag}`} key={tag}>{tag}</Link>
                ))}
              </div>
              {/* <Link to='/'>Strategy</Link> */}
              {/* <Link to={`/games/${tag}`} key={tag}>{tag}</Link> */}
            </div>
            <div className='game-detail-price-bg-color'>
              <p>Buy {data.game_name}</p>
              {data.discount_percent === 0 ?
                <div className='game-detail-price'>
                  <span className='game-price-nodiscount'>CDN$ {data.game_price / 100}</span>
                  <button className='game-detail-btn'>Add to Cart</button>
                </div>
                :
                <div>
                  <div className='game-detail-offer-ends'>Offer ends {new Date(data.discount_expires).toLocaleString()}</div>
                  <div className='align-price-right'>
                    <div className='game-detail-price'>
                    <span className='game-detail-discount-percent'>-{data.discount_percent}%</span>
                    <div className='game-detail-discount'>
                      <div className='game-detail-orignal-price'>CDN$ {data.game_price / 100}</div>
                      <div>CDN$ {(data.game_price * (100 - data.discount_percent) / 10000).toFixed(2)}</div>
                    </div>
                    <button className='game-detail-btn'>Add to Cart</button>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
        {/* <div className='game-detail-small-img'>
              <div className='game-detail-video' onClick={() => setPlayVideo(true)}>
                <img className='filter-img' src={data.game_img_link[0]} alt="img for video" />
                <span className='play-btn'>
                  <img src={PlayBtn} alt="play btn" />
                </span>
              </div>
              {data.game_img_link && data.game_img_link.map(gameimg => (
                <div key={gameimg}>
                  <img onClick={() => handleImg(gameimg)} src={gameimg} alt="game img" />
                </div>
              ))}
             
            </div> */}

       
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
