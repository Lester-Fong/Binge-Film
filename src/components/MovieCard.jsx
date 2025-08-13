
import '../css/MovieCard.css'
import { useMovieContext } from '../contexts/MovieContext';
import { truncateText } from '../services/helper';
import { Badge } from "@/components/ui/badge"


export default function MovieCard({ movie }) {

    const { isFavorite, addToFavorites, removeToFavorites } = useMovieContext();
    const favorite = isFavorite(movie.id);

    const onFavoriteClick = (e) => {
        e.preventDefault();
        if (favorite) {
            removeToFavorites(movie.id);
        } else {
            addToFavorites(movie);
        }
    }

    return <>
        <div className="movie-card w-100">
            <div className="movie-poster">
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                <div className="movie-overlay">
                    <button className={`favorite-btn ${favorite ? 'active' : ''}`} onClick={onFavoriteClick}>♥</button>
                </div>
            </div>
            <div className="movie-info">
                <h3>{truncateText(movie.title, 25)}</h3>
                <div className="flex align-items-center justify-between">
                    <Badge variant="destructive" className="px-1">{movie.vote_average.toFixed(1)}</Badge>
                    <p className='movie-date'>{movie.release_date.split('-')[0]}</p>
                </div>
            </div>
        </div>
    </>
}

// export default MovieCard;