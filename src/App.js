import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home.js';
import Footer from './components/Footer';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Cart from './pages/Cart/Cart';
import Detail from './pages/Detail/Detail';
import Games from './pages/Games/Games';
import Loading from './components/Loading';
import OrderHistory from './pages/OrderHistory/OrderHistory';
import { useAuthContext } from './hooks/useAuthContext';
import { useState } from 'react';

function App() {
  const { authIsReady, user, error, isPending } = useAuthContext();
  const [sidebar, setSidebar] = useState(false);
  // console.log('Auth: ', authIsReady);
  // console.log('user: ', user);
  // console.log('cart: ', cart);

  return (
    <div className={`App ${sidebar ? 'disable-scroll' : ''}`}>
      {isPending && <Loading />}
      {error && <div className='error'>{error}</div>}
      {authIsReady && (
        <BrowserRouter>
          <Navbar sidebar={sidebar} setSidebar={setSidebar} />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={ user ? <Home /> : <Login />} />
            <Route path='/signup' element={ user ? <Home /> : <Signup />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/detail/:gameid' element={<Detail />} />
            <Route path='/games/:category' element={<Games />} />
            <Route path='/orders' element={ user ? <OrderHistory /> : <Login />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
