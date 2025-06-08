import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieDetails } from "../services/api"; // Assuming you have a function to fetch movie details

function MovieDetails() {
    const { id } = useParams();

    const [movieDetails, setMovieDetails] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                setLoading(true);
                const response = await getMovieDetails(id);
                setMovieDetails(response);
            } catch (error) {
                console.error("Error fetching movie details:", error);
                setError("Failed to load movie details.");
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id]);

    return (
        <div className="movie-details">
            {error && <div className="error-message" role="alert">{error}</div>}

            {loading ? <p>Loading...</p> :
                <div>
                    <h1>Movie Details</h1>
                </div>
            }
        </div>
    );
}

export default MovieDetails;