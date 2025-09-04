
import '../css/MovieCard.css'
import { useMovieContext } from '../contexts/MovieContext';
import { truncateText } from '../services/helper';
import { Badge } from "@/components/ui/badge"


export default function MovieCard({ movie, contentType }) {

    const { isFavorite, addToFavorites, removeToFavorites } = useMovieContext();
    const favorite = isFavorite(movie.id);

    // Determine if this is a movie or TV show and extract the appropriate data
    const isMovie = contentType === 'movie' || movie.hasOwnProperty('title');
    const isTVShow = contentType === 'tv' || movie.hasOwnProperty('name');
    
    // Get title/name dynamically
    const displayTitle = isMovie ? movie.title : movie.name;
    
    // Get release date dynamically
    const releaseDate = isMovie ? movie.release_date : movie.first_air_date;
    
    // Get the year from the date
    const releaseYear = releaseDate ? releaseDate.split('-')[0] : 'N/A';

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
                <img src={`https://image.tmdb.org/t/p/w500${movie?.poster_path}`} alt={displayTitle} />
                <div className="movie-overlay">
                    <button className={`favorite-btn ${favorite ? 'active' : ''}`} onClick={onFavoriteClick}>♥</button>
                    {/* Add a small indicator to show if it's a TV show */}
                    {isTVShow && (
                        <span className="content-type-badge tv-badge">TV</span>
                    )}
                </div>
            </div>
            <div className="movie-info">
                <h3>{truncateText(displayTitle, 25)}</h3>
                <div className="flex align-items-center justify-between">
                    <Badge variant="destructive" className="px-1">{movie?.vote_average?.toFixed(1) || 'N/A'}</Badge>
                    <p className='movie-date'>{releaseYear}</p>
                </div>
            </div>
        </div>
    </>
}

// export default MovieCard;