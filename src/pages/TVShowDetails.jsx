import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTVShowDetails, getSimilarTVShows, getTVShowReviews, getTVShowExternalIds } from "../services/api";
import { embedTVShow } from "../services/api.v2";
import Backdrop from "../components/Backdrop";
import ReviewsSection from "../components/ReviewsSection";
import MovieSlidesSection from "../components/MovieSlidesSection";
import EpisodeList from "../components/EpisodeList";
import EpisodeModal from "../components/EpisodeModal";
import '../css/TVShowDetails.css';

function TVShowDetails() {
    const { id } = useParams();

    const [tvShowDetails, setTVShowDetails] = useState({});
    const [reviewsData, setReviewsData] = useState({ results: [] });
    const [similarTVShowsData, setSimilarTVShowsData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tvShowImdbId, setTvShowImdbId] = useState(null);

    // Episode modal states
    const [isEpisodeModalOpen, setIsEpisodeModalOpen] = useState(false);
    const [selectedEpisode, setSelectedEpisode] = useState(null);
    const [embedUrl, setEmbedUrl] = useState("");    // Function to handle episode click
    const handleEpisodeClick = async (episode, seasonNumber) => {
        try {
            setSelectedEpisode({
                ...episode,
                seasonNumber
            });
            setIsEpisodeModalOpen(true);

            if (!tvShowImdbId) {
                console.error("No IMDB ID available for this TV show");
                setEmbedUrl("");
                return;
            }

            // Get the embed URL from the API using the TV show's IMDB ID
            const embedResponse = await embedTVShow(tvShowImdbId, seasonNumber, episode.episode_number);
            setEmbedUrl(embedResponse);
        } catch (error) {
            console.error("Error fetching episode embed:", error);
            setEmbedUrl("");
        }
    };

    // Function to close the episode modal
    const handleCloseEpisodeModal = () => {
        setIsEpisodeModalOpen(false);
        setSelectedEpisode(null);
        setEmbedUrl("");
    };

    useEffect(() => {
        const fetchTVShowData = async () => {
            try {
                setLoading(true);

                const tvShowResponse = await getTVShowDetails(id);
                setTVShowDetails(tvShowResponse);

                // Fetch TV show external IDs to get IMDB ID
                try {
                    const externalIdsResponse = await getTVShowExternalIds(id);
                    if (externalIdsResponse && externalIdsResponse.imdb_id) {
                        setTvShowImdbId(externalIdsResponse.imdb_id);
                    } else {
                        console.warn("No IMDB ID found for this TV show");
                    }
                } catch (externalIdsError) {
                    console.warn("Failed to fetch TV show external IDs:", externalIdsError);
                }

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
                <div className="container mx-auto px-4 py-6">
                    <div className="tv-show-content">
                        {/* Compact Main Details */}
                        <div className="tv-show-main-details">
                            <div className="title-section">
                                <h1 className="tv-show-title">{tvShowDetails.name}</h1>

                                {tvShowDetails.tagline && (
                                    <p className="tv-show-tagline">"{tvShowDetails.tagline}"</p>
                                )}
                            </div>

                            {/* Compact Meta Grid */}
                            <div className="tv-show-meta-compact">
                                <div className="meta-row">
                                    <div className="meta-group">
                                        <span className="meta-label">Status:</span>
                                        <span className="meta-value">{tvShowDetails.status}</span>
                                    </div>

                                    <div className="meta-group">
                                        <span className="meta-label">Seasons:</span>
                                        <span className="meta-value">{tvShowDetails.number_of_seasons}</span>
                                    </div>

                                    <div className="meta-group">
                                        <span className="meta-label">Episodes:</span>
                                        <span className="meta-value">{tvShowDetails.number_of_episodes}</span>
                                    </div>

                                    <div className="meta-group">
                                        <span className="meta-label">Rating:</span>
                                        <span className="meta-value rating">
                                            ⭐ {tvShowDetails.vote_average?.toFixed(1)}/10
                                        </span>
                                    </div>
                                </div>

                                <div className="meta-row">
                                    <div className="meta-group">
                                        <span className="meta-label">First Air:</span>
                                        <span className="meta-value">
                                            {new Date(tvShowDetails.first_air_date).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {tvShowDetails.last_air_date && (
                                        <div className="meta-group">
                                            <span className="meta-label">Last Air:</span>
                                            <span className="meta-value">
                                                {new Date(tvShowDetails.last_air_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}

                                    {/* Genres inline */}
                                    {tvShowDetails.genres && tvShowDetails.genres.length > 0 && (
                                        <div className="meta-group genres-inline">
                                            <span className="meta-label">Genres:</span>
                                            <div className="genre-tags-inline">
                                                {tvShowDetails.genres.slice(0, 3).map(genre => (
                                                    <span key={genre.id} className="genre-tag-small">{genre.name}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Two Column Layout for Content */}
                            <div className="content-two-column">
                                {/* Left Column - Overview and Latest Episode */}
                                <div className="content-left">
                                    {/* Overview */}
                                    {tvShowDetails.overview && (
                                        <div className="tv-show-overview-compact">
                                            <h3>Overview</h3>
                                            <p>{tvShowDetails.overview}</p>
                                        </div>
                                    )}

                                    {/* Last Episode - Compact Card */}
                                    {tvShowDetails.last_episode_to_air && (
                                        <div className="last-episode-compact">
                                            <h3>Latest Episode</h3>
                                            <div className="episode-card-compact">
                                                {tvShowDetails.last_episode_to_air.still_path && (
                                                    <img
                                                        src={`https://image.tmdb.org/t/p/w200${tvShowDetails.last_episode_to_air.still_path}`}
                                                        alt={tvShowDetails.last_episode_to_air.name}
                                                        className="episode-still-small"
                                                    />
                                                )}
                                                <div className="episode-info-compact">
                                                    <h4 className="episode-title">
                                                        S{tvShowDetails.last_episode_to_air.season_number}E{tvShowDetails.last_episode_to_air.episode_number}: {tvShowDetails.last_episode_to_air.name}
                                                    </h4>
                                                    <p className="episode-date">
                                                        Aired: {new Date(tvShowDetails.last_episode_to_air.air_date).toLocaleDateString()}
                                                    </p>
                                                    {tvShowDetails.last_episode_to_air.overview && (
                                                        <p className="episode-overview-compact">{tvShowDetails.last_episode_to_air.overview}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column - Networks and Creators */}
                                <div className="content-right">
                                    {/* Networks - Compact */}
                                    {tvShowDetails.networks && tvShowDetails.networks.length > 0 && (
                                        <div className="tv-show-networks-compact">
                                            <h3>Networks</h3>
                                            <div className="network-logos-compact">
                                                {tvShowDetails.networks.slice(0, 3).map(network => (
                                                    <div key={network.id} className="network-item-compact">
                                                        {network.logo_path ? (
                                                            <img
                                                                src={`https://image.tmdb.org/t/p/w92${network.logo_path}`}
                                                                alt={network.name}
                                                                className="network-logo-small"
                                                            />
                                                        ) : (
                                                            <span className="network-name-small">{network.name}</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Created By - Compact */}
                                    {tvShowDetails.created_by && tvShowDetails.created_by.length > 0 && (
                                        <div className="tv-show-creators-compact">
                                            <h3>Created By</h3>
                                            <div className="creators-list-compact">
                                                {tvShowDetails.created_by.slice(0, 3).map(creator => (
                                                    <div key={creator.id} className="creator-item-compact">
                                                        {creator.profile_path && (
                                                            <img
                                                                src={`https://image.tmdb.org/t/p/w92${creator.profile_path}`}
                                                                alt={creator.name}
                                                                className="creator-photo-small"
                                                            />
                                                        )}
                                                        <span className="creator-name-small">{creator.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Episodes List Section */}
                    <EpisodeList
                        tvShowId={tvShowDetails.id}
                        seasons={tvShowDetails.seasons}
                        showName={tvShowDetails.name}
                        onEpisodeClick={handleEpisodeClick}
                    />
                </div>
            </div>

            {/* Episode Modal */}
            {selectedEpisode && (
                <EpisodeModal
                    isOpen={isEpisodeModalOpen}
                    onClose={handleCloseEpisodeModal}
                    tvShowName={tvShowDetails.name}
                    seasonNumber={selectedEpisode.seasonNumber}
                    episodeNumber={selectedEpisode.episode_number}
                    embedUrl={embedUrl}
                />
            )}

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
