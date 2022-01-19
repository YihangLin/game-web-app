import './Searchbar.css'
import Search from '../assets/search.svg';

import { useState } from 'react';

import { useNavigate } from 'react-router';

export default function Searchbar({ setSidebar }) {
  const [term, setTerm] = useState('');
  let navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    navigate(`/search?q=${term}`);
    setSidebar(false);
    setTerm('');
  }

  return (
    <form className='searchbar' onSubmit={handleSubmit}>
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
