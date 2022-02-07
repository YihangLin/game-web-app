import './Navbar.css';
import Menu from '../assets/menu.svg';
import Logo from '../assets/logo.svg';
import ShoppingBag from '../assets/shopping_bag.svg';
import Account from '../assets/account.svg';
import Login from '../assets/login.svg';
import Logout from '../assets/logout.svg';
import Signup from '../assets/signup.svg';
import Arrow from '../assets/arrow-down.svg';
import Searchbar from './Searchbar';
import Dropdown from './Dropdown';

import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/reducers/userReducer';

export default function Navbar({ sidebar, setSidebar }) {
  const [dropdown, setDropdown] = useState(false);
  const { cart } = useSelector((state) => state.cartReducer);
  const { user, authIsPending } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  return (
    <>
      {/* mobile */}
      <div className="mobile-container">
        <div className='mobile-topbar' onClick={() => setDropdown(false)}>
          <img onClick={() => setSidebar(prevValue => !prevValue)} src={Menu} alt="menu img" />
          <Link to='/' className='mobile-logo' onClick={() => setSidebar(false)}><img src={Logo} alt="logo img" /></Link>
          <Link className='mobile-badge' to ='/cart' onClick={() => setSidebar(false)}>
            <img src={ShoppingBag} alt="shopping bag img" />
            <span>{cart.length}</span>
          </Link>
        </div>
        <div className='mobile-nav' onClick={() => setSidebar(false)}>
          <ul>
            {/* close sidebar afterclick */}
            <li onClick={() => setDropdown(false)}><Link to='/games/allgames'>All Games</Link></li>
            <li className='hover-dropdown' onClick={() => setDropdown(prevValue => !prevValue)}><Link to='#'>Categories</Link>
            <div className={`${dropdown ? '' : 'mobile-dropdown'}`}>
              <Dropdown />
            </div>
            </li>
            <li onClick={() => setDropdown(false)}><Link to = '/games/sales'>On Sale</Link></li>
          </ul>
        </div>
      </div>

      {/* sidebar */}
      <div className={`mobile-sidebar-container ${sidebar ? '' : 'mobile-sidebar-disable'}`}>
        <div className={`mobile-sidebar ${sidebar ? '' : 'mobile-sidebar-disable'}`}>
          <Searchbar setSidebar={setSidebar} />
          <Link to='/orders' onClick={() => setSidebar(false)} className='show-vertical mobile-sidebar-user'>
            <img src={Account} alt="account img" />
            {user ? <p>Hi, {user.user_name}</p> : <p>Guest</p>}
          </Link>
            <Link to='/cart' onClick={() => setSidebar(false)} className='show-vertical mobile-sidebar-bag'>
              <img src={ShoppingBag} alt="shopping bag img" />
              <p>View Cart({cart.length})</p>
            </Link>
            {user ?
              authIsPending ? 
                <div className='show-vertical mobile-sidebar-logout'>
                  <img src={Logout} alt="logout img" />
                  <p>Loading</p>
                </div>
              :
                <div className='show-vertical mobile-sidebar-logout' onClick={() => dispatch(logoutUser())}>
                  <img src={Logout} alt="logout img" />
                  <p>Logout</p>
                </div>
            :
              <div className='mobile-sidebar-login'>
                <Link className='show-vertical' to='/login' onClick={() => setSidebar(false)}>
                  <img src={Login} alt="login img" />
                  <p>Login</p>
                </Link>
                <Link className='show-vertical' to='/signup' onClick={() => setSidebar(false)}>
                  <img src={Signup} alt="signup img" />
                  <p>Signup</p>
                </Link>
              </div>
            }
        </div>
        <div className='mobile-sidebar-close' onClick={() => setSidebar(false)}></div>
      </div>
      

      {/* desktop */}
      <nav>
        <div className='desktop-nav1'>
          <div className='desktop-container'>
            <div className="desktop-topbar">
              <div className='desktop-search'>
                <Searchbar setSidebar={setSidebar} />
              </div>

              <Link to='/'><img src={Logo} alt="logo img" /></Link>

              <ul className='desktop-account'>
                <li>{user ? <span className='desktop-username'>Hi, {user.user_name}</span> : <Link to='/login'>Hi, Guest</Link>}</li>
                <li>
                  {user ? 
                    <div className='desktop-account-forhover'><img src={Account} alt="account img" />
                      <div className='desktop-account-hover'>
                        <a href='/orders'>View Orders</a>
                        {authIsPending ?
                          <div className='desktop-logout'>
                            <img src={Logout} alt="logout img" />
                            <span>Loading</span>
                          </div>
                        :
                          <div className='desktop-logout' onClick={()=> dispatch(logoutUser())}>
                            <img src={Logout} alt="logout img" />
                            <span>Logout</span>
                          </div>
                        }
                      </div>
                    </div>
                    :
                      <Link to='/login'><img src={Account} alt="account img" /></Link>
                    }
                </li>
                <li className='desktop-badge'>
                  <Link to='/cart'><img src={ShoppingBag} alt="shopping bag img" />
                  {/* <span>1</span> */}
                  <span>{cart.length}</span>
                  </Link>
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
              <li onClick={() => setDropdown(prevValue => !prevValue)} className='hover-dropdown'><Link to='#'>Categories<img src={Arrow} alt="arrow" /></Link>
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
