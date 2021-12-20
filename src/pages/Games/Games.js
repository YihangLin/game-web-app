import './Games.css';
import { useParams } from 'react-router';

export default function Games() {
  const { category } = useParams();

  return (
    <div>
      <h1>{category}</h1>
    </div>
  )
}
