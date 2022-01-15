import './Home.css';

import { useFetch } from '../../hooks/useFetch';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading';
import NewRelease from '../../components/NewRelease';
import RecentlyUpdated from '../../components/RecentlyUpdated';
import Card from '../../components/Card';

export default function Home() {
  const { data, isPending, error } = useFetch('http://localhost:5000/homepage');

  return (
    <div className='home-container'>
      {error && <div className='error'>{error}</div>}
      {isPending && <Loading />}
      {data && <>
        <NewRelease game={data.newGame}/>
          <p>FEATURED & RECOMMENDED</p>
          <div className='game-groups'>
            {data.popularGames.map(game => (
              <Card key={game.game_id} game={game}/>
            ))}
          </div>

          <p>SPECIAL OFFERS</p>
          <div className='game-groups'>
            {data.saleGames.map(game => (
              <Card key={game.game_id} game={game}/>
            ))}
          </div>

        <p>POPULAR TAGS</p>
        <ul>
          <li><Link to='/games/Action'>Action</Link></li>
          <li><Link to='/games/RPG'>RPG</Link></li>
          <li><Link to='/games/Adventure'>Adventure</Link></li>
          <li><Link to='/games/FPS'>FPS</Link></li>
        </ul>

        <p>RECENTLY UPDATED</p>
        <RecentlyUpdated games={data.recentlyUpdated} />
      </>}
    </div>
    
  )
}
