import './Dropdown.css'
import { Link } from 'react-router-dom'

export default function Dropdown() {
  return (
    <div className='dropdown'>
      <div className='dropdown-section'>
        <Link className='tag' to='/'>Action1</Link>
        <ul>
          <li><Link to='/'>Action</Link></li>
          <li><Link to='/'>Role Playing</Link></li>
          <li><Link to='/'>Strategy</Link></li>
          <li><Link to='/'>4</Link></li>
        </ul>
      
        <Link className='tag' to='/'>Action2</Link>
        <ul>
          <li><Link to='/'>Simulation</Link></li>
          <li><Link to='/'>Tower Defense</Link></li>
          <li><Link to='/'>7</Link></li>
          <li><Link to='/'>8</Link></li>
        </ul>
      </div>

      <div className='dropdown-section'>
        <Link className='tag' to='/'>Action3</Link>
        <ul>
          <li><Link to='/'>Rouge-Like</Link></li>
          <li><Link to='/'>JRPG</Link></li>
          <li><Link to='/'>11</Link></li>
          <li><Link to='/'>12</Link></li>
        </ul>
      
        <Link className='tag' to='/'>Action4</Link>
        <ul>
          <li><Link to='/'>Adventure</Link></li>
          <li><Link to='/'>Casual</Link></li>
          <li><Link to='/'>15</Link></li>
          <li><Link to='/'>16</Link></li>
        </ul>
      </div>

      <div className='dropdown-section'>
        <Link className='tag' to='/'>Action3</Link>
        <ul>
          <li><Link to='/'>Rouge-Like</Link></li>
          <li><Link to='/'>JRPG</Link></li>
          <li><Link to='/'>11</Link></li>
          <li><Link to='/'>12</Link></li>
        </ul>
      
        <Link className='tag' to='/'>Action4</Link>
        <ul>
          <li><Link to='/'>Adventure</Link></li>
          <li><Link to='/'>Casual</Link></li>
          <li><Link to='/'>15</Link></li>
          <li><Link to='/'>16</Link></li>
        </ul>
      </div>
    </div>
  )
}
