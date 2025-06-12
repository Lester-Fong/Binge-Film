import '../css/FeaturedMovie.css';
import { useMovieContext } from "../contexts/MovieContext";
import { getMovieVideo } from "../services/api";
import { useState } from "react";
import TrailerModal from "./TrailerModal";
import { Link } from 'react-router-dom';
import { handleDate } from '../services/helper';

function FeaturedMovie(props) {
    const { isFavorite, addToFavorites, removeToFavorites } = useMovieContext();
    const favorite = isFavorite(props.movie.id);
    const [videoKey, setVideoKey] = useState(null);
    const [showTrailerModal, setShowTrailerModal] = useState(false);
    const onFavoriteClick = (e) => {
        e.preventDefault();
        if (favorite) {
            removeToFavorites(props.movie.id);
        } else {
            addToFavorites(props.movie);
        }
    };

    const handlePlayTrailer = async (e) => {
        e.preventDefault();
        try {
            const response = await getMovieVideo(props.movie.id);
            let results = response.results;
            if (results.length > 0) {
                results = results.filter((video) => video.site === "YouTube" && video.type === "Trailer");
                // embed the video in a modal
                setShowTrailerModal(true)
                setVideoKey(results[0].key)
            } else {
                alert("No video available for this movie.");
            }
        } catch (error) {
            console.error("Error fetching movie video:", error);
            alert("Failed to load the trailer. Please try again later.");
            setShowTrailerModal(false);
            setVideoKey(null);
        }
    };

    return (
        <div className="featured-movie" style={{ backgroundImage: `url(https://media.themoviedb.org/t/p/w1920_and_h800_multi_faces/${props.movie.backdrop_path})` }}>
            <div className='featured-movie-content'>
                <h4 className='text-7xl mb-1'>{props.movie.title}</h4>
                <p>Release Date: {handleDate(props.movie.release_date)}</p>
                <p className='my-2 text-xl'>{props.movie.overview}</p>
                <div className="backdrop-icons justify-start">
                    <Link className="watch-btn pointer" to={`/movie/${props.movie.id}`} >
                        <span className="mb-0">
                            <svg height="30px" width="30px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xmlSpace="preserve" fill="#000000">
                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                    <g>
                                        <path
                                            fill="#ffffff"
                                            d="M256,0C114.625,0,0,114.625,0,256c0,141.374,114.625,256,256,256c141.374,0,256-114.626,256-256
                                                C512,114.625,397.374,0,256,0z M351.062,258.898l-144,85.945c-1.031,0.626-2.344,0.657-3.406,0.031
                                                c-1.031-0.594-1.687-1.702-1.687-2.937v-85.946v-85.946c0-1.218,0.656-2.343,1.687-2.938c1.062-0.609,2.375-0.578,3.406,0.031
                                                l144,85.962c1.031,0.586,1.641,1.718,1.641,2.89C352.703,257.187,352.094,258.297,351.062,258.898z"
                                        ></path>
                                    </g>
                                </g>
                            </svg>
                        </span>
                        <span>See Details</span>
                    </Link>
                    <div className="watch-btn pointer" onClick={handlePlayTrailer}>
                        <span className="mb-0">
                            <svg height="30px" width="30px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xmlSpace="preserve" fill="#000000">
                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                    <g>
                                        <path
                                            fill="#ffffff"
                                            d="M256,0C114.625,0,0,114.625,0,256c0,141.374,114.625,256,256,256c141.374,0,256-114.626,256-256
                                                C512,114.625,397.374,0,256,0z M351.062,258.898l-144,85.945c-1.031,0.626-2.344,0.657-3.406,0.031
                                                c-1.031-0.594-1.687-1.702-1.687-2.937v-85.946v-85.946c0-1.218,0.656-2.343,1.687-2.938c1.062-0.609,2.375-0.578,3.406,0.031
                                                l144,85.962c1.031,0.586,1.641,1.718,1.641,2.89C352.703,257.187,352.094,258.297,351.062,258.898z"
                                        ></path>
                                    </g>
                                </g>
                            </svg>
                        </span>
                        <span>Watch Trailer</span>
                    </div>
                    <span onClick={onFavoriteClick}>
                        <p className={`favorite-btn-deets ${favorite ? "active" : ""}`}>♥</p>
                    </span>
                </div>

                <TrailerModal showTrailerModal={showTrailerModal} setShowTrailerModal={setShowTrailerModal} props={props} videoKey={videoKey} />
            </div>
        </div>
    );
}

export default FeaturedMovie;
