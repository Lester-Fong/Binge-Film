import '../css/Favorites.css'
import { useMovieContext } from '../contexts/MovieContext';
import MovieCard from '../components/MovieCard';
import { Link } from 'react-router-dom';

function Favorites() {
    const { favorites } = useMovieContext();

    if (favorites.length > 0) {
        return <div className='favorites'>
            <p className='font-semibold text-4xl mt-5 mb-2 px-4 bg-accent-foreground'>Your Favorites</p>
            <div className="movies-grid">
                {favorites.map(item =>
                    item.media_type !== 'movie' ?
                        <Link to={`/tvshow/${item.id}`} key={item.id} className="tvshow-link">
                            <MovieCard key={item.id} movie={item} contentType="tv" />
                        </Link>
                        :
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