import "../css/MovieDetails.css";
import { handleDate } from "../services/helper";
import { useMovieContext } from "../contexts/MovieContext";
import { getMovieVideo } from "../services/api";
import { embedMovie } from "../services/api.v2"; // Assuming you have a function to embed the movie
import { useState } from "react";

import { Modal } from 'flowbite-react';
// import Modal from "./Modal";

function Backdrop(props) {
    const { isFavorite, addToFavorites, removeToFavorites } = useMovieContext();
    const favorite = isFavorite(props.movie.id);
    const [embedVideo, setEmbedVideo] = useState(null);
    const [videoKey, setVideoKey] = useState(null);
    const [showModal, setShowModal] = useState(false);

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
        const response = await getMovieVideo(props.movie.id);
        let results = response.results;
        if (results.length > 0) {
            results = results.filter((video) => video.site === "YouTube" && video.type === "Trailer");
            // window.open(`https://www.youtube.com/watch?v=${results[0].key}`, "_blank");
            // embed the video in a modal
            setShowModal(true)
            setVideoKey(results[0].key)
        } else {
            alert("No video available for this movie.");
        }
    };

    const handlePlayFilm = async (e) => {
        e.preventDefault();
        const response = await embedMovie(props.movie.imdb_id);
        setEmbedVideo(response);

        // TODO: Make the video player modal appear and embed the response from API
    };

    return (
        <>
            <div className="backdrop" style={{ backgroundImage: `url(https://media.themoviedb.org/t/p/w1920_and_h800_multi_faces/${props.movie.backdrop_path})` }}>
                <div className="backdrop-container">
                    <div className="backdrop-image">
                        <img src={`https://image.tmdb.org/t/p/w500/${props.movie.poster_path}`} alt="test" />
                    </div>

                    <div className="backdrop-content">
                        <div>
                            <h1 className="backdrop-title">
                                {props.movie.title} ({props.movie?.release_date.split("-")[0]})
                            </h1>
                            <p>Tagline: &nbsp; "{props.movie.tagline}"</p>
                            <p>Release Date: {handleDate(props.movie.release_date)}</p>
                        </div>
                        <div className="backdrop-icons">
                            <div className="watch-btn pointer" onClick={handlePlayFilm}>
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
                                <span>Watch Film</span>
                            </div>
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
                        <div className="backdrop-overview">
                            <h2 className="mb-1">Overview</h2>
                            <p>It provides a summary of the plot and main themes. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos fugiat laudantium similique.</p>
                        </div>
                        <div>
                            <a className="homepage-link" href={props.movie.homepage} target="_blank">
                                Visit movie page
                            </a>
                        </div>
                    </div>
                </div>
            </div>


            <Modal show={showModal} onClose={() => setShowModal(false)}>

                <div className="video-container">
                    <div className="bg-gray-900 text-white rounded-t-lg">
                        <h3 className="text-lg text-center font-semibold py-1">{props.movie.title}</h3>
                    </div>
                    {videoKey ? (
                        <iframe
                            title="Movie Trailer"
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${videoKey}`}
                            frameBorder="0"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <p>Loading video...</p>
                    )}
                </div>
                <div className="flex justify-end align-bottom mx-2 my-1">
                    <button className="close-button" onClick={() => setShowModal(false)}>
                        Close
                    </button>
                </div>
            </Modal>
        </>
    );
}

export default Backdrop;
