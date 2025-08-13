import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { getPopularMovies, getFeaturedMovie, getTopRatedMovies, getTrendingMovies } from "../services/api";
import '../css/Home.css'
import FeaturedMovie from "../components/FeaturedMovie";
import FeaturedMovieCarousel from "../components/FeaturedMovieCarousel";
import MovieSlidesSection from "../components/MovieSlidesSection";

function Home() {
    const [movies, setMovies] = useState([]);
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [featuredMovie, setFeaturedMovie] = useState(null);

    useEffect(() => {
        const loadPopularMovies = async () => {
            try {
                const response = Promise.all([
                    getPopularMovies(),
                    getFeaturedMovie(),
                    getTopRatedMovies(),
                    getTrendingMovies()
                ]);

                const [popularMovies, featureMovie, topMovies, trendingMovies] = await response;
                setMovies(popularMovies);
                setFeaturedMovie(featureMovie);
                setTopRatedMovies(topMovies);
                setTrendingMovies(trendingMovies);
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
        {/* Featured Movie Carousel */}
        {featuredMovie && featuredMovie.length > 0 && (
            <FeaturedMovieCarousel movies={featuredMovie} />
        )}

        {/* Error Message */}
        {error && <div className="error-message absolute top-6/12 left-5/12" role="alert">{error}</div>}
        {loading ?
            <div className="absolute top-6/12 left-6/12" style={{ height: "100vh" }}>
                <div className="spinner-border text-primary" role="status">
                    <p className="loading text-white">LOADING...</p>
                </div>
            </div> :
            <>
                <MovieSlidesSection movies={movies} title="Popular Movies" />
                <MovieSlidesSection movies={topRatedMovies} title="Top Rated Movies" />
                <MovieSlidesSection movies={trendingMovies} title="Trending Movies" />
            </>
        }
        {/* Latest Movies */}
    </>
}

export default Home;