import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieDetails, getSimilarMovies, getMovieReviews } from "../services/api";
import Backdrop from "../components/Backdrop";
import ReviewsSection from "../components/ReviewsSection";
import MovieSlidesSection from "../components/MovieSlidesSection";


function MovieDetails() {
    const { id } = useParams();

    const [movieDetails, setMovieDetails] = useState({});
    const [reviewsData, setReviewsData] = useState({ results: [] });
    const [similarMoviesData, setSimilarMoviesData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch movie details (required)
                const movieResponse = await getMovieDetails(id);
                setMovieDetails(movieResponse);

                // Fetch reviews (optional - don't fail if no reviews)
                try {
                    const reviewsResponse = await getMovieReviews(id);
                    setReviewsData(reviewsResponse);
                } catch (reviewError) {
                    console.warn("Failed to fetch reviews:", reviewError);
                    setReviewsData({ results: [] });
                }

                // Fetch similar movies (optional - don't fail if no similar movies)
                try {
                    const similarMoviesResponse = await getSimilarMovies(id);
                    setSimilarMoviesData(similarMoviesResponse);
                } catch (similarError) {
                    console.warn("Failed to fetch similar movies:", similarError);
                    setSimilarMoviesData([]);
                }

            } catch (error) {
                console.error("Error fetching movie data:", error);
                setError("Failed to load movie data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    return (
        <div className="movie-details">
            {error && <div className="error-message" role="alert">{error}</div>}

            {loading ? <p>Loading...</p> :
                <div>
                    <Backdrop key={movieDetails.id} movie={movieDetails} />

                    {/* Reviews Section */}
                    {reviewsData.results && reviewsData.results.length > 0 && (
                        <ReviewsSection reviews={reviewsData.results} />
                    )}

                    {/* Similar Movies Section */}
                    {similarMoviesData && similarMoviesData.length > 0 && (
                        <MovieSlidesSection movies={similarMoviesData} title="Similar Movies" />
                    )}
                </div>
            }
        </div>
    );
}

export default MovieDetails;