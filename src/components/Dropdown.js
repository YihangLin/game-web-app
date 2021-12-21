import './Dropdown.css'
import { Link } from 'react-router-dom'

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
        <Link className='tag' to='/games/Action'>Action</Link>
        <ul>
          {action && action.map(category => (
            <li key={category}><Link to={`/games/${category}`}>{category}</Link></li>
          ))}
        </ul>
      
        <Link className='tag' to='/games/Adventure'>Adventure</Link>
        <ul>
          {adventure && adventure.map(category => (
            <li key={category}><Link to={`/games/${category}`}>{category}</Link></li>
          ))}
        </ul>
      </div>

      <div className='dropdown-section'>
        <Link className='tag' to='/games/RPG'>RPG</Link>
        <ul>
          {rpg && rpg.map(category => (
            <li key={category}><Link to={`/games/${category}`}>{category}</Link></li>
          ))}
        </ul>
      
        <Link className='tag' to='/games/Indie'>Indie</Link>
        <ul>
          {indie && indie.map(category => (
            <li key={category}><Link to={`/games/${category}`}>{category}</Link></li>
          ))}
        </ul>
      </div>

      <div className='dropdown-section'>
        <Link className='tag' to='/games/Simulation'>Simulation</Link>
        <ul>
          {simulation && simulation.map(category => (
            <li key={category}><Link to={`/games/${category}`}>{category}</Link></li>
          ))}
        </ul>
      
        <Link className='tag' to='/games/Strategy'>Strategy</Link>
        <ul>
          {strategy && strategy.map(category => (
            <li key={category}><Link to={`/games/${category}`}>{category}</Link></li>
          ))}
        </ul>
      </div>

      <div className='dropdown-section'>
        <Link className='tag' to='/games/Sports'>Sports</Link>
        <ul>
          {sports && sports.map(category => (
            <li key={category}><Link to={`/games/${category}`}>{category}</Link></li>
          ))}
        </ul>
      
        <Link className='tag' to='/games/Rougelike'>Rougelike</Link>
        <ul>
          {rougelike && rougelike.map(category => (
            <li key={category}><Link to={`/games/${category}`}>{category}</Link></li>
          ))}
        </ul>
      </div>
    </div>
  )
}
