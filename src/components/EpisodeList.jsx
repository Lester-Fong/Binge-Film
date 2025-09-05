import { useState, useEffect } from "react";
import { getTVShowSeason } from "../services/api";
import '../css/EpisodeList.css';

function EpisodeList({ tvShowId, seasons, showName }) {
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [episodes, setEpisodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (tvShowId && selectedSeason) {
            fetchEpisodes();
        }
    }, [tvShowId, selectedSeason]);

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
                <div className="season-selector">
                    <select 
                        value={selectedSeason} 
                        onChange={(e) => handleSeasonChange(parseInt(e.target.value))}
                        className="season-dropdown"
                    >
                        {seasons.map(season => (
                            <option key={season.season_number} value={season.season_number}>
                                Season {season.season_number}
                            </option>
                        ))}
                    </select>
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
                            <div key={episode.id || index} className="episode-card">
                                <div className="episode-image">
                                    {episode.still_path ? (
                                        <img 
                                            src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                                            alt={episode.name}
                                            className="episode-thumbnail"
                                        />
                                    ) : (
                                        <div className="episode-placeholder">
                                            <span>No Image</span>
                                        </div>
                                    )}
                                    {episode.runtime && (
                                        <div className="episode-duration">
                                            <span>{episode.runtime}m</span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="episode-details">
                                    <div className="episode-number">
                                        {episode.episode_number}. {episode.name}
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
