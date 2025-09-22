import { useState, useEffect } from 'react';
import FeaturedMovie from './FeaturedMovie';
import '../css/FeaturedMovieCarousel.css';

function FeaturedMovieCarousel({ movies }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlaying || !movies || movies.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === movies.length - 1 ? 0 : prevIndex + 1
            );
        }, 3300); // Change slide every 3 seconds

        return () => clearInterval(interval);
    }, [isAutoPlaying, movies]);

    // Handle manual navigation
    const goToSlide = (index) => {
        setCurrentIndex(index);
        setIsAutoPlaying(false); // Pause autoplay when user interacts
        // Resume autoplay after 3 seconds of inactivity
        setTimeout(() => setIsAutoPlaying(true), 3300);
    };

    // Handle mouse events for autoplay control
    const handleMouseEnter = () => setIsAutoPlaying(false);
    const handleMouseLeave = () => setIsAutoPlaying(true);

    if (!movies || movies.length === 0) return null;

    return (
        <div
            className="featured-carousel"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Featured Movie Display */}
            <div className="featured-carousel-container">
                <FeaturedMovie movie={movies[currentIndex]} />

                {/* Dot Indicators */}
                {movies.length > 1 && (
                    <div className="carousel-indicators">
                        {movies.map((_, index) => (
                            <button
                                key={index}
                                className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                                onClick={() => goToSlide(index)}
                                aria-label={`Go to movie ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default FeaturedMovieCarousel;
