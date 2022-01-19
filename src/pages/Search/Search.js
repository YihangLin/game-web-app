import { useSearchParams } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";

import Loading from "../../components/Loading";
import Card from "../../components/Card";

export default function Search() {
  let [searchParams] = useSearchParams();
  const {data, error, isPending } = useFetch(`${process.env.REACT_APP_SERVER_URL}/search?q=${searchParams.get('q')}`);

  return (
    <div>
      {isPending && <Loading />}
      {error && <div className='error'>{error}</div>}
      {data && data.games.length !== 0 ?
        <div className='games-category'>
          <div>{data.games.length} Results for {searchParams.get('q')}:</div>
          <div className='games-category-games'>
            {data.games.map(game => (
              <Card key={game.game_id} game={game} />
            ))}
          </div>
        </div>
      :
        <div className='games-category'>
          <div>0 Results for {searchParams.get('q')}:</div>
        </div>
      }    
    </div>


  )
}
