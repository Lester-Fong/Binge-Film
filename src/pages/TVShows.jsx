import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPopularTVShows, getTopRatedTVShows, getOnAirTVShows } from "../services/api";
import MovieCard from "../components/MovieCard";
import '../css/TVShows.css';

function TVShows() {
    const [tvShows, setTVShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [category, setCategory] = useState('popular');
    const [totalResults, setTotalResults] = useState(0);

    const categories = [
        { key: 'popular', label: 'Popular', api: getPopularTVShows },
        { key: 'top_rated', label: 'Top Rated', api: getTopRatedTVShows },
        { key: 'on_air', label: 'On Air', api: getOnAirTVShows }
    ];

    useEffect(() => {
        fetchTVShows();
    }, [currentPage, category]);

    const fetchTVShows = async () => {
        try {
            setLoading(true);
            setError(null);

            const currentCategory = categories.find(cat => cat.key === category);
            const response = await currentCategory.api(currentPage);

            setTVShows(response.results || []);
            setTotalPages(Math.min(response.total_pages || 1, 500)); // TMDB limits to 500 pages
            setTotalResults(response.total_results || 0);
        } catch (err) {
            console.error("Error fetching TV shows:", err);
            setError("Failed to load TV shows. Please try again later.");
            setTVShows([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (newCategory) => {
        setCategory(newCategory);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const generatePageNumbers = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    if (loading && tvShows.length === 0) {
        return (
            <div className="flex align-center justify-center">
                <div className="tv-shows-container">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading TV Shows...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex align-center justify-center">
                <div className="tv-shows-container">
                    <div className="error-container">
                        <h2>Oops! Something went wrong</h2>
                        <p>{error}</p>
                        <button onClick={() => fetchTVShows()} className="retry-btn">
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex align-center justify-center">
            <div className="tv-shows-container">
                {/* Header Section */}
                <div className="tv-shows-header">
                    <h1>TV Shows</h1>
                    <p>Discover amazing TV shows from around the world</p>
                </div>

                {/* Category Filter */}
                <div className="category-filter">
                    {categories.map(cat => (
                        <button
                            key={cat.key}
                            className={`category-btn ${category === cat.key ? 'active' : ''}`}
                            onClick={() => handleCategoryChange(cat.key)}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Results Info */}
                <div className="results-info">
                    <p>
                        Showing {tvShows.length} of {totalResults.toLocaleString()} results
                        <span className="page-info"> • Page {currentPage} of {totalPages}</span>
                    </p>
                </div>

                {/* TV Shows Grid */}
                {tvShows.length > 0 ? (
                    <div className="tv-shows-grid">
                        {tvShows.map(show => (
                            <Link
                                to={`/tvshow/${show.id}`}
                                key={show.id}
                                className="tv-show-link"
                            >
                                <MovieCard movie={show} contentType="tv" />
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="no-results">
                        <h3>No TV shows found</h3>
                        <p>Try selecting a different category</p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pagination-container">
                        <div className="pagination">
                            {/* Previous Button */}
                            <button
                                className={`pagination-btn prev ${currentPage === 1 ? 'disabled' : ''}`}
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                ← Previous
                            </button>

                            {/* Page Numbers */}
                            <div className="page-numbers">
                                {generatePageNumbers().map((page, index) => (
                                    <button
                                        key={index}
                                        className={`page-btn ${page === currentPage ? 'active' : ''} ${page === '...' ? 'dots' : ''}`}
                                        onClick={() => typeof page === 'number' && handlePageChange(page)}
                                        disabled={page === '...'}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            {/* Next Button */}
                            <button
                                className={`pagination-btn next ${currentPage === totalPages ? 'disabled' : ''}`}
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next →
                            </button>
                        </div>

                        {/* Page Info */}
                        <div className="pagination-info">
                            <span>Page {currentPage} of {totalPages}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TVShows;
