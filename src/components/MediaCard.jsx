import React from 'react';
import '../css/MovieCard.css';

function MediaCard({ media }) {
    const isMovie = media.media_type === 'movie' || media.title;
    const title = isMovie ? media.title : media.name;
    const releaseDate = isMovie ? media.release_date : media.first_air_date;
    const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
    
    return (
        <div className="movie-card">
            <div className="movie-poster">
                {media.poster_path ? (
                    <img
                        src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
                        alt={title}
                    />
                ) : (
                    <div className="no-poster-placeholder">
                        <span>No Image</span>
                    </div>
                )}
                <div className="movie-overlay">
                    <div className={`media-type-badge ${!isMovie ? 'tv-badge' : ''}`}>
                        {isMovie ? 'Movie' : 'TV Show'}
                    </div>
                </div>
            </div>
            <div className="movie-info">
                <h3 className="movie-title">{title}</h3>
                <div className="movie-meta">
                    <span className="movie-year">{year}</span>
                    {media.vote_average > 0 && (
                        <span className="movie-rating">
                            ⭐ {media.vote_average.toFixed(1)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MediaCard;