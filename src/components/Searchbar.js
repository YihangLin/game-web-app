import './Searchbar.css'
import Search from '../assets/search.svg';

import { useState } from 'react';

export default function Searchbar() {
  const [term, setTerm] = useState('');

  return (
    <form className='searchbar'>
      <label>
        <input 
          type="text" 
          placeholder='Search'
          onChange={(e) => setTerm(e.target.value)}
          value={term}
          required
        />
      </label>
      <button><img src={Search} alt="search img" /></button>
    </form>
  )
}
