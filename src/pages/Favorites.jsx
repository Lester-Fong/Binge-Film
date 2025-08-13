import '../css/Favorites.css'
import { useMovieContext } from '../contexts/MovieContext';
import MovieCard from '../components/MovieCard';
import { Link } from 'react-router-dom';

function Favorites() {
    const { favorites } = useMovieContext();

    if (favorites.length > 0) {
        return <div className='favorites'>
            <h2>Your Favorites</h2>
            <div className="movies-grid">
                {favorites.map(item =>
                    <Link to={`/movie/${item.id}`} key={item.id} className="movie-link">
                        <MovieCard key={item.id} movie={item} />
                    </Link>
                )}
            </div>
        </div>
    }
    return <>
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="favorites-empty">
                <h2>No Favorites movies yet.</h2>
                <p>start adding to your favorites and they will appear here.</p>
            </div>
        </div>
    </>
}

export default Favorites;