import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import { getPopularMovies, searchMovies } from "../services/api";
import '../css/Home.css'


function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPopularMovies = async () => {
            try {
                const popularMovies = await getPopularMovies();
                setMovies(popularMovies);
            } catch (error) {
                console.error("Error fetching popular movies:", error);
                setError("Failed to load popular movies.");
            } finally {
                setLoading(false);
            }
        }

        loadPopularMovies();
    }, []);

    const handleSearch = async (event) => {
        event.preventDefault();

        if (!searchQuery.trim()) return;
        setLoading(true);
        if (loading) return;

        try {
            const searchedMovies = await searchMovies(searchQuery);
            setMovies(searchedMovies);
            setError(null);
        } catch (error) {
            console.error("Error searching movies:", error);
            setError("Failed to search for movies.");
        } finally {
            setLoading(false);
        }

        setSearchQuery("");
    }

    return <>

        <form onSubmit={handleSearch} className="d-flex-center">
            <input type="text" placeholder="search for movies" className="search-input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <button type="submit" className="search-button">Search</button>
        </form>

        {error && <div className="error-message" role="alert">{error}</div>}

        {loading ?
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <div className="spinner-border text-primary" role="status">
                    <p className="loading">Loading...</p>
                </div>
            </div> :
            <div className="movies-grid">
                {movies.map(item =>
                    <MovieCard key={item.id} movie={item} />
                )}
            </div>}
    </>
}

export default Home;