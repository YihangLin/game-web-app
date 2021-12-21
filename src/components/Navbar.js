import './Navbar.css';
import Menu from '../assets/menu.svg';
import Logo from '../assets/logo.svg';
import ShoppingBag from '../assets/shopping_bag.svg';
import Account from '../assets/account.svg';
import Login from '../assets/login.svg';
import Logout from '../assets/logout.svg';
import Signup from '../assets/signup.svg';
import Arrow from '../assets/arrow-down.svg';

import { Link } from 'react-router-dom';
import { useState } from 'react';
import Searchbar from './Searchbar';
import Dropdown from './Dropdown';

export default function Navbar() {
  const [sidebar, setSidebar] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  return (
    <>
      {/* mobile */}
      <div className="mobile-container">
        <div className='mobile-topbar'>
          <img onClick={() => setSidebar(prevValue => !prevValue)} src={Menu} alt="menu img" />
          <Link to='/' className='mobile-logo' onClick={() => setSidebar(false)}><img src={Logo} alt="logo img" /></Link>
          <Link className='mobile-badge' to ='/' onClick={() => setSidebar(false)}>
            <img src={ShoppingBag} alt="shopping bag img" />
            <span>6</span>
          </Link>
        </div>
        <div className='mobile-nav' onClick={() => setSidebar(false)}>
          <ul>
            {/* close sidebar afterclick */}
            <li><Link to='/games/allgames'>All Games</Link></li>
            <li className='hover-dropdown' onClick={() => setDropdown(prevValue => !prevValue)}><Link to='#'>Categories</Link>
            <div className={`${dropdown ? '' : 'mobile-dropdown'}`}>
              <Dropdown />
            </div>
            </li>
            <li><Link to = '/games/sales'>On Sale</Link></li>
          </ul>
          {/* <Searchbar /> */}
        </div>
      </div>

      {/* sidebar */}
      <div className={`mobile-sidebar ${sidebar ? '' : 'mobile-sidebar-disable'}`}>
        <Searchbar />
        <div onClick={() => setSidebar(false)} className='show-vertical mobile-siderbar-user'>
          <img src={Account} alt="account img" />
          <p>Name</p>
        </div>
        {/* <div className='show-vertical mobile-sidebar-account'> */}
          <Link to='/' onClick={() => setSidebar(false)} className='show-vertical mobile-siderbar-bag'>
            <img src={ShoppingBag} alt="shopping bag img" />
            <p>View Cart(6)</p>
          </Link>
          <div className='mobile-sidebar-login'>
            <Link className='show-vertical' to='/' onClick={() => setSidebar(false)}>
              <img src={Login} alt="login img" />
              <p>Login</p>
            </Link>
            <Link className='show-vertical' to='/' onClick={() => setSidebar(false)}>
              <img src={Signup} alt="signup img" />
              <p>Signup</p>
            </Link>
          </div>
          <div className='show-vertical mobile-sidebar-logout' onClick={() => setSidebar(false)}>
            <img src={Logout} alt="logout img" />
            <p>Logout</p>
          </div>
        {/* </div> */}
      </div>
      

      {/* desktop */}
      <nav>
        <div className='desktop-nav1'>
          <div className='desktop-container'>
            <div className="desktop-topbar">
              <div className='desktop-search'>
                <Searchbar />
              </div>

              <Link to='/'><img src={Logo} alt="logo img" /></Link>

              <ul className='desktop-account'>
                <li><Link to='/'>Hi, Name</Link></li>
                <li><Link to='/'><img src={Account} alt="account img" /></Link></li>
                <li className='desktop-badge'>
                  <Link to='/'><img src={ShoppingBag} alt="shopping bag img" /></Link>
                  <span><Link to='/'>12</Link></span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="desktop-nav2">
          <div className='desktop-container'>
            <ul>
              <li><Link to='/'>Home</Link></li>
              <li><Link to='/games/allgames'>All Games</Link></li>
              <li className='hover-dropdown'><Link to='#'>Categories<img src={Arrow} alt="arrow" /></Link>
              <div className={`${dropdown ? '' : 'mobile-dropdown'}`}>
                <Dropdown />
              </div>
              </li>
              <li><Link to='/games/sales'>On Sale</Link></li>
            </ul>
          </div>
        </div>


        
      </nav>

      


    </>
  )
}
