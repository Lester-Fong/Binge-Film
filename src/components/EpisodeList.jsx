import { useState, useEffect } from "react";
import { getTVShowSeason } from "../services/api";
import '../css/EpisodeList.css';
import { handleDate } from "../services/helper";

function EpisodeList({ tvShowId, seasons, showName, onEpisodeClick }) {
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [episodes, setEpisodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEpisodes = async () => {
            try {
                setLoading(true);
                setError(null);
                const seasonData = await getTVShowSeason(tvShowId, selectedSeason);
                setEpisodes(seasonData.episodes || []);
            } catch (error) {
                console.error("Error fetching episodes:", error);
                setError("Failed to load episodes for this season.");
                setEpisodes([]);
            } finally {
                setLoading(false);
            }
        };

        if (tvShowId && selectedSeason) {
            fetchEpisodes();
        }
    }, [tvShowId, selectedSeason]);

    const handleSeasonChange = (seasonNumber) => {
        setSelectedSeason(seasonNumber);
    };

    if (!seasons || seasons.length === 0) {
        return null;
    }

    return (
        <div className="episode-list-container">
            <div className="episode-list-header">
                <h3>Episodes</h3>
                <div className="season-selector-premium">
                    <div className="season-selector-wrapper">
                        <div className="season-dropdown-wrapper">
                            <select
                                id="select-premium"
                                value={selectedSeason}
                                onChange={(e) => handleSeasonChange(parseInt(e.target.value))}
                                className="season-dropdown-premium"
                            >
                                {seasons.map((season) => (
                                    season.season_number !== 0 ? <option key={season.season_number} value={season.season_number}>
                                        Season {season.season_number}
                                    </option> : null
                                ))}
                            </select>
                            <div className="season-dropdown-arrow">
                                <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                                    <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {loading && (
                <div className="episodes-loading">
                    <p>Loading episodes...</p>
                </div>
            )}

            {error && (
                <div className="episodes-error">
                    <p>{error}</p>
                </div>
            )}

            {!loading && episodes.length > 0 && (
                <div className="episodes-container">
                    <div className="episodes-grid">
                        {episodes.map((episode, index) => (
                            <div
                                key={episode.id || index}
                                className="episode-card"
                                onClick={() => onEpisodeClick(episode, selectedSeason)}
                            >
                                <div className="episode-thumbnail">
                                    {episode.still_path ? (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w400${episode.still_path}`}
                                            alt={episode.name}
                                            className="episode-image"
                                        />
                                    ) : (
                                        <div className="episode-placeholder">
                                            <div className="placeholder-icon">
                                                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7.5v6l5.5-3-5.5-3z" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                    <div className="episode-overlay">
                                        <div className="play-button">
                                            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M8 5v14l11-7L8 5z" />
                                            </svg>
                                        </div>
                                    </div>
                                    {episode.runtime && (
                                        <div className="episode-duration">
                                            <span>{episode.runtime}min</span>
                                        </div>
                                    )}
                                </div>

                                <div className="episode-content">
                                    <div className="episode-header">
                                        <div className="episode-title-row">
                                            <span className="episode-number">Ep {episode.episode_number}</span>
                                            <h4 className="episode-title">{episode.name}</h4>
                                        </div>
                                        <div className="episode-meta">
                                            {episode.air_date && (
                                                <span className="episode-date">{handleDate(episode.air_date)}</span>
                                            )}
                                            {episode.vote_average > 0 && (
                                                <div className="episode-rating">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                    </svg>
                                                    <span>{episode.vote_average.toFixed(1)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {episode.overview && (
                                        <p className="episode-overview">{episode.overview}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!loading && episodes.length === 0 && !error && (
                <div className="no-episodes">
                    <p>No episodes available for Season {selectedSeason}</p>
                </div>
            )}
        </div>
    );
}

export default EpisodeList;
