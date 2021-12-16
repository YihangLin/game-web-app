import './Footer.css';
import Logo from '../assets/logo.svg';

import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <div className='footer'>
      <div className='footer-container'>
        <img src={Logo} alt="logo img" />
        <div>
          <ul>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/'>Games</Link></li>
            <li><Link to='/'>Sale</Link></li>
          </ul>
        </div>

        <div className='footer-help'>
          <p>Help&Support</p>
          <span>+1 (123) 456-7788</span>
        </div>
      </div>
    </div>
  )
}
