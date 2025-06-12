import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { getPopularMovies, getFeaturedMovie } from "../services/api";
import '../css/Home.css'
import FeaturedMovie from "../components/FeaturedMovie";

function Home() {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [featuredMovie, setFeaturedMovie] = useState(null);

    useEffect(() => {
        const loadPopularMovies = async () => {
            try {
                const response = Promise.all([
                    getPopularMovies(),
                    getFeaturedMovie()
                ]);

                const [popularMovies, featureMovie] = await response;
                setMovies(popularMovies);
                setFeaturedMovie(featureMovie);
            } catch (error) {
                console.error("Error fetching popular movies:", error);
                setError("Failed to load popular movies.");
            } finally {
                setLoading(false);
            }
        }

        loadPopularMovies();
    }, []);



    return <>
        {/* Featured Movie */}
        {featuredMovie && (
            <FeaturedMovie movie={featuredMovie} />
            // <Backdrop movie={featuredMovie} />
        )}

        {/* Error Message */}
        {error && <div className="error-message absolute top-6/12 left-5/12" role="alert">{error}</div>}
        {loading ?
            <div className="absolute top-6/12 left-6/12" style={{ height: "100vh" }}>
                <div className="spinner-border text-primary" role="status">
                    <p className="loading">LOADING...</p>
                </div>
            </div> :
            <div className="movies-grid mt-5">
                {movies.map(item =>
                    <Link to={`/movie/${item.id}`} key={item.id} className="movie-link">
                        <MovieCard key={item.id} movie={item} />
                    </Link>
                )}
            </div>}
    </>
}

export default Home;