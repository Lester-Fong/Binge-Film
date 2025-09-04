import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTVShowDetails, getSimilarTVShows, getTVShowReviews } from "../services/api";
import Backdrop from "../components/Backdrop";
import ReviewsSection from "../components/ReviewsSection";
import MovieSlidesSection from "../components/MovieSlidesSection";
import '../css/TVShowDetails.css';

function TVShowDetails() {
    const { id } = useParams();

    const [tvShowDetails, setTVShowDetails] = useState({});
    const [reviewsData, setReviewsData] = useState({ results: [] });
    const [similarTVShowsData, setSimilarTVShowsData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTVShowData = async () => {
            try {
                setLoading(true);

                // Fetch TV show details (required)
                const tvShowResponse = await getTVShowDetails(id);
                setTVShowDetails(tvShowResponse);

                // Fetch reviews (optional - don't fail if no reviews)
                try {
                    const reviewsResponse = await getTVShowReviews(id);
                    setReviewsData(reviewsResponse);
                } catch (reviewError) {
                    console.warn("Failed to fetch TV show reviews:", reviewError);
                    setReviewsData({ results: [] });
                }

                // Fetch similar TV shows (optional - don't fail if no similar shows)
                try {
                    const similarTVShowsResponse = await getSimilarTVShows(id);
                    setSimilarTVShowsData(similarTVShowsResponse);
                } catch (similarError) {
                    console.warn("Failed to fetch similar TV shows:", similarError);
                    setSimilarTVShowsData([]);
                }

            } catch (error) {
                console.error("Error fetching TV show data:", error);
                setError("Failed to load TV show data.");
            } finally {
                setLoading(false);
            }
        };

        fetchTVShowData();
    }, [id]);

    if (error) {
        return <div className="error-message" role="alert">{error}</div>;
    }

    if (loading) {
        return (
            <div className="loading-container">
                <p className="loading-text">Loading TV show details...</p>
            </div>
        );
    }

    return (
        <div className="tv-show-details">
            {/* Main TV Show Info Section */}
            <Backdrop key={tvShowDetails.id} movie={tvShowDetails} contentType="tv" />

            {/* TV Show Specific Information */}
            <div className="tv-show-info-section">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Left Column - Poster and Basic Info */}
                        <div className="tv-show-poster-section">
                            <img 
                                src={`https://image.tmdb.org/t/p/w500${tvShowDetails.poster_path}`} 
                                alt={tvShowDetails.name}
                                className="tv-show-poster"
                            />
                        </div>

                        {/* Middle Column - Main Details */}
                        <div className="tv-show-main-details col-span-2">
                            <h1 className="tv-show-title">{tvShowDetails.name}</h1>
                            
                            {tvShowDetails.tagline && (
                                <p className="tv-show-tagline">"{tvShowDetails.tagline}"</p>
                            )}

                            <div className="tv-show-meta">
                                <div className="meta-item">
                                    <span className="meta-label">Status:</span>
                                    <span className="meta-value">{tvShowDetails.status}</span>
                                </div>
                                
                                <div className="meta-item">
                                    <span className="meta-label">First Air Date:</span>
                                    <span className="meta-value">
                                        {new Date(tvShowDetails.first_air_date).toLocaleDateString()}
                                    </span>
                                </div>

                                {tvShowDetails.last_air_date && (
                                    <div className="meta-item">
                                        <span className="meta-label">Last Air Date:</span>
                                        <span className="meta-value">
                                            {new Date(tvShowDetails.last_air_date).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}

                                <div className="meta-item">
                                    <span className="meta-label">Seasons:</span>
                                    <span className="meta-value">{tvShowDetails.number_of_seasons}</span>
                                </div>

                                <div className="meta-item">
                                    <span className="meta-label">Episodes:</span>
                                    <span className="meta-value">{tvShowDetails.number_of_episodes}</span>
                                </div>

                                <div className="meta-item">
                                    <span className="meta-label">Rating:</span>
                                    <span className="meta-value rating">
                                        ⭐ {tvShowDetails.vote_average?.toFixed(1)}/10 
                                        ({tvShowDetails.vote_count} votes)
                                    </span>
                                </div>
                            </div>

                            {/* Genres */}
                            {tvShowDetails.genres && tvShowDetails.genres.length > 0 && (
                                <div className="tv-show-genres">
                                    <h3>Genres</h3>
                                    <div className="genre-tags">
                                        {tvShowDetails.genres.map(genre => (
                                            <span key={genre.id} className="genre-tag">{genre.name}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Overview */}
                            {tvShowDetails.overview && (
                                <div className="tv-show-overview">
                                    <h3>Overview</h3>
                                    <p>{tvShowDetails.overview}</p>
                                </div>
                            )}

                            {/* Networks */}
                            {tvShowDetails.networks && tvShowDetails.networks.length > 0 && (
                                <div className="tv-show-networks">
                                    <h3>Networks</h3>
                                    <div className="network-logos">
                                        {tvShowDetails.networks.map(network => (
                                            <div key={network.id} className="network-item">
                                                {network.logo_path ? (
                                                    <img 
                                                        src={`https://image.tmdb.org/t/p/w200${network.logo_path}`}
                                                        alt={network.name}
                                                        className="network-logo"
                                                    />
                                                ) : (
                                                    <span className="network-name">{network.name}</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Created By */}
                            {tvShowDetails.created_by && tvShowDetails.created_by.length > 0 && (
                                <div className="tv-show-creators">
                                    <h3>Created By</h3>
                                    <div className="creators-list">
                                        {tvShowDetails.created_by.map(creator => (
                                            <div key={creator.id} className="creator-item">
                                                {creator.profile_path && (
                                                    <img 
                                                        src={`https://image.tmdb.org/t/p/w185${creator.profile_path}`}
                                                        alt={creator.name}
                                                        className="creator-photo"
                                                    />
                                                )}
                                                <span className="creator-name">{creator.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Last Episode */}
                            {tvShowDetails.last_episode_to_air && (
                                <div className="last-episode">
                                    <h3>Latest Episode</h3>
                                    <div className="episode-card">
                                        <div className="episode-info">
                                            <h4>
                                                S{tvShowDetails.last_episode_to_air.season_number}E{tvShowDetails.last_episode_to_air.episode_number}: {tvShowDetails.last_episode_to_air.name}
                                            </h4>
                                            <p className="episode-date">
                                                Aired: {new Date(tvShowDetails.last_episode_to_air.air_date).toLocaleDateString()}
                                            </p>
                                            {tvShowDetails.last_episode_to_air.overview && (
                                                <p className="episode-overview">{tvShowDetails.last_episode_to_air.overview}</p>
                                            )}
                                        </div>
                                        {tvShowDetails.last_episode_to_air.still_path && (
                                            <img 
                                                src={`https://image.tmdb.org/t/p/w300${tvShowDetails.last_episode_to_air.still_path}`}
                                                alt={tvShowDetails.last_episode_to_air.name}
                                                className="episode-still"
                                            />
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Next Episode */}
                            {tvShowDetails.next_episode_to_air && (
                                <div className="next-episode">
                                    <h3>Next Episode</h3>
                                    <div className="episode-card">
                                        <div className="episode-info">
                                            <h4>
                                                S{tvShowDetails.next_episode_to_air.season_number}E{tvShowDetails.next_episode_to_air.episode_number}: {tvShowDetails.next_episode_to_air.name}
                                            </h4>
                                            <p className="episode-date">
                                                Airs: {new Date(tvShowDetails.next_episode_to_air.air_date).toLocaleDateString()}
                                            </p>
                                            {tvShowDetails.next_episode_to_air.overview && (
                                                <p className="episode-overview">{tvShowDetails.next_episode_to_air.overview}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Seasons Section */}
                    {tvShowDetails.seasons && tvShowDetails.seasons.length > 0 && (
                        <div className="seasons-section">
                            <h3>Seasons</h3>
                            <div className="seasons-grid">
                                {tvShowDetails.seasons.map(season => (
                                    <div key={season.id} className="season-card">
                                        {season.poster_path && (
                                            <img 
                                                src={`https://image.tmdb.org/t/p/w300${season.poster_path}`}
                                                alt={season.name}
                                                className="season-poster"
                                            />
                                        )}
                                        <div className="season-info">
                                            <h4>{season.name}</h4>
                                            <p className="season-episodes">{season.episode_count} episodes</p>
                                            {season.air_date && (
                                                <p className="season-date">
                                                    Aired: {new Date(season.air_date).getFullYear()}
                                                </p>
                                            )}
                                            {season.vote_average > 0 && (
                                                <p className="season-rating">
                                                    ⭐ {season.vote_average.toFixed(1)}
                                                </p>
                                            )}
                                            {season.overview && (
                                                <p className="season-overview">{season.overview}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Reviews Section */}
            {reviewsData.results && reviewsData.results.length > 0 && (
                <ReviewsSection reviews={reviewsData.results} />
            )}

            {/* Similar TV Shows Section */}
            {similarTVShowsData && similarTVShowsData.length > 0 && (
                <MovieSlidesSection 
                    movies={similarTVShowsData} 
                    title="Similar TV Shows" 
                    contentType="tv"
                />
            )}
        </div>
    );
}

export default TVShowDetails;
