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
import Search from './pages/Search/Search';
import Success from './pages/Success/Success';
import Failure from './pages/Failure/Failure';
import Loading from './components/Loading';
import NotFound from './pages/NotFound/NotFound';
import OrderHistory from './pages/OrderHistory/OrderHistory';
import { useAuthContext } from './hooks/useAuthContext';
import { useState } from 'react';

function App() {
  const { authIsReady, user, error, isPending } = useAuthContext();
  const [sidebar, setSidebar] = useState(false);

  return (
    <div className={`App ${sidebar ? 'disable-scroll' : ''}`}>
      {isPending && <Loading />}
      {error && <div className='error'>{error}</div>}
      {authIsReady && (
        <BrowserRouter>
          <Navbar sidebar={sidebar} setSidebar={setSidebar} />
          <Routes>
            <Route path='/' element={ <Home /> } />
            <Route path='/login' element={ user ? <Home /> : <Login />} />
            <Route path='/signup' element={ user ? <Home /> : <Signup />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/detail/:gameid' element={ <Detail /> } />
            <Route path='/games/:category' element={ <Games /> } />
            <Route path='/orders' element={ user ? <OrderHistory /> : <Login />} />
            <Route path='/search' element={ <Search /> }/>
            <Route path='/success' element={ user ? <Success /> : <Home /> }/>
            <Route path='/failure' element={ user ? <Failure /> : <Home /> }/>
            <Route path='*' element={ <NotFound /> } />
          </Routes>
          <Footer />
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
