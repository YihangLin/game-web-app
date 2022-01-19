import { Link } from 'react-router-dom';

export default function Failure() {
  return (
    <div className='cart-container'>
      <h2 className='error'>Payment didn't go through</h2>

      <Link to='/cart' className='cart-shopping'>Try Again</Link>
    </div>
  )
}
