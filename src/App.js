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
import OrderHistory from './pages/OrderHistory/OrderHistory';
import { useAuthContext } from './hooks/useAuthContext';

function App() {
  const { authIsReady, user } = useAuthContext();

  console.log('Auth: ', authIsReady);
  console.log('user: ', user);
  // console.log('cart: ', cart);

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/detail/:gameid' element={<Detail />} />
          <Route path='/games/:category' element={<Games />} />
          <Route path='/history' element={<OrderHistory />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
