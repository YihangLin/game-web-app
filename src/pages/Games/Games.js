import './Games.css';
import { useParams } from 'react-router';
import { useFetch } from '../../hooks/useFetch';
import Loading from '../../components/Loading';
import Card from '../../components/Card';

export default function Games() {
  const { category } = useParams();
  const { data, error, isPending } = useFetch(`${process.env.REACT_APP_SERVER_URL}/category/${category}`);

  return (
    <div>
      {error && <div className='error'>{error}</div>}
      {isPending && <Loading />}
      {data && 
        <div className='games-category'>
          <div>{data.games.length} Results for {category}:</div>
          <div className='games-category-games'>
            {data.games.map(game => (
              <Card key={game.game_id} game={game} />
            ))}
          </div>
        </div>
      }
    </div>
  )
}
