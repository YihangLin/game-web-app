import './Dropdown.css'

const sports = ['Competitive', 'Racing', 'Driving', 'Soccer'];
const simulation = ['Crafting', 'Survival', 'Farming', 'Agriculture'];
const action = ['FPS', 'Difficult', 'Co-op', 'Open World'];
const indie = ['Relaxing', 'Puzzle', '2D', 'Sandbox'];
const strategy = ['Sci-fi', 'RTS', 'Multiplayer', 'War'];
const adventure = ['Fantasy', 'Stealth', 'Exploration', 'Story Rich'];
const rpg = ['JRPG', 'Atmospheric', 'Singleplayer', 'Anime'];
const rougelike = ['Pixel Graphics', 'Magic', 'Roguelite', 'Bullet Hell'];


export default function Dropdown() {
  return (
    <div className='dropdown'>
      <div className='dropdown-section'>
        <div>
          <a className='tag' href='/games/Action'>Action</a>
          <ul>
            {action && action.map(category => (
              <li key={category}><a href={`/games/${category}`}>{category}</a></li>
            ))}
          </ul>
        </div>
      
        <div>
          <a className='tag' href='/games/Adventure'>Adventure</a>
          <ul>
            {adventure && adventure.map(category => (
              <li key={category}><a href={`/games/${category}`}>{category}</a></li>
            ))}
          </ul>
        </div>
      </div>

      <div className='dropdown-section'>
        <div>
          <a className='tag' href='/games/RPG'>RPG</a>
          <ul>
            {rpg && rpg.map(category => (
              <li key={category}><a href={`/games/${category}`}>{category}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <a className='tag' href='/games/Indie'>Indie</a>
          <ul>
            {indie && indie.map(category => (
              <li key={category}><a href={`/games/${category}`}>{category}</a></li>
            ))}
          </ul>
        </div>
      </div>

      <div className='dropdown-section'>
        <div>
          <a className='tag' href='/games/Simulation'>Simulation</a>
          <ul>
            {simulation && simulation.map(category => (
              <li key={category}><a href={`/games/${category}`}>{category}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <a className='tag' href='/games/Strategy'>Strategy</a>
          <ul>
            {strategy && strategy.map(category => (
              <li key={category}><a href={`/games/${category}`}>{category}</a></li>
            ))}
          </ul>
        </div>
      </div>

      <div className='dropdown-section'>
        <div>
          <a className='tag' href='/games/Sports'>Sports</a>
          <ul>
            {sports && sports.map(category => (
              <li key={category}><a href={`/games/${category}`}>{category}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <a className='tag' href='/games/Rougelike'>Rougelike</a>
          <ul>
            {rougelike && rougelike.map(category => (
              <li key={category}><a href={`/games/${category}`}>{category}</a></li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
