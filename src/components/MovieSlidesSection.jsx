import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "./ui/carousel";
import { Link } from "react-router-dom";
import MovieCard from "./MovieCard";
import "../css/MovieSlidesSection.css";

const MovieSlidesSection = ({ title, movies }) => {
    return (
        <div className="movie-slides-section">
            <div className="text-4xl font-bold mt-4 mb-2 ml-2 px-5">
                <p>{title}</p>
            </div>
            <div className="mx-5 mb-2">
                <div className="ml-2">
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                            skipSnaps: false,
                            dragFree: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="movie-slides-carousel-content">
                            {movies.map((movie) => (
                                <CarouselItem
                                    key={movie.id}
                                    className="movie-slides-carousel-item"
                                >
                                    <div className="movie-slides-card-container">
                                        <div className="movie-slides-card-content">
                                            <Link
                                                to={`/movie/${movie.id}`}
                                                className="movie-slides-link"
                                            >
                                                <MovieCard
                                                    poster={movie.poster_path}
                                                    title={movie.title}
                                                    rating={movie.vote_average}
                                                    movie={movie}
                                                />
                                            </Link>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="movie-slides-nav movie-slides-prev" />
                        <CarouselNext className="movie-slides-nav movie-slides-next" />
                    </Carousel>
                </div>
            </div>
        </div>
    );
};

export default MovieSlidesSection;