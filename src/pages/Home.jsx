import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { getPopularMovies, getFeaturedMovie, getTopRatedMovies, getTrendingMovies, getPopularTVShows} from "../services/api";
import '../css/Home.css'
import FeaturedMovie from "../components/FeaturedMovie";
import FeaturedMovieCarousel from "../components/FeaturedMovieCarousel";
import MovieSlidesSection from "../components/MovieSlidesSection";

function Home() {
    const [movies, setMovies] = useState([]);
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [popularTV, setPopularTV] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [featuredMovie, setFeaturedMovie] = useState(null);

    // Ultra-optimized approach using concurrent execution with streaming updates
    /*
    useEffect(() => {
        const controller = new AbortController();
        
        const streamingDataLoader = async function* () {
            const apiEndpoints = [
                { key: 'popular', fn: getPopularMovies, setter: setMovies },
                { key: 'featured', fn: getFeaturedMovie, setter: setFeaturedMovie },
                { key: 'topRated', fn: getTopRatedMovies, setter: setTopRatedMovies },
                { key: 'trending', fn: getTrendingMovies, setter: setTrendingMovies },
                { key: 'tv', fn: getPopularTVShows, setter: setPopularTV }
            ];

            // Create race condition - update UI as soon as each request completes
            const promises = apiEndpoints.map(async ({ key, fn, setter }) => {
                try {
                    const data = await fn();
                    return { key, data, setter, success: true };
                } catch (error) {
                    console.warn(`Failed to load ${key}:`, error);
                    return { key, data: [], setter, success: false, error };
                }
            });

            // Yield results as they complete (not in order)
            for await (const result of promises) {
                yield result;
            }
        };

        const loadData = async () => {
            try {
                for await (const result of streamingDataLoader()) {
                    if (!controller.signal.aborted) {
                        result.setter(result.data);
                    }
                }
            } catch (error) {
                if (!controller.signal.aborted) {
                    setError("Failed to load movie data.");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        loadData();

        return () => controller.abort();
    }, []);
    */

    // Alternative optimized approach - you can replace the above useEffect with this:
    
    useEffect(() => {
        let isMounted = true; // Prevent state updates if component unmounts
        
        const loadMovieData = async () => {
            // Set loading state immediately
            setLoading(true);
            setError(null);

            // Create a map to track which API calls are completed
            const apiCalls = [
                { 
                    name: 'popular', 
                    promise: getPopularMovies(),
                    setter: setMovies 
                },
                { 
                    name: 'featured', 
                    promise: getFeaturedMovie(),
                    setter: setFeaturedMovie 
                },
                { 
                    name: 'topRated', 
                    promise: getTopRatedMovies(),
                    setter: setTopRatedMovies 
                },
                { 
                    name: 'trending', 
                    promise: getTrendingMovies(),
                    setter: setTrendingMovies 
                },
                { 
                    name: 'tv', 
                    promise: getPopularTVShows(),
                    setter: setPopularTV 
                }
            ];

            let completedCalls = 0;
            const totalCalls = apiCalls.length;
            let hasAnyError = false;

            // Process each API call individually as they complete
            const promises = apiCalls.map(async ({ name, promise, setter }) => {
                try {
                    const data = await promise;
                    if (isMounted) {
                        setter(data);
                        completedCalls++;
                        
                        // Update loading state progressively
                        if (completedCalls === totalCalls && !hasAnyError) {
                            setLoading(false);
                        }
                    }
                } catch (error) {
                    hasAnyError = true;
                    console.warn(`Failed to load ${name}:`, error);
                    
                    if (isMounted) {
                        completedCalls++;
                        // Set empty array as fallback
                        setter([]);
                        
                        // If this is the last call, stop loading even with errors
                        if (completedCalls === totalCalls) {
                            setLoading(false);
                            if (completedCalls === 1) { // Only show error if all calls failed
                                setError("Failed to load some movie data. Please try again later.");
                            }
                        }
                    }
                }
            });

            // Wait for all promises to complete (but don't fail if some fail)
            await Promise.allSettled(promises);
            
            if (isMounted) {
                setLoading(false);
            }
        };

        loadMovieData();
        
        // Cleanup function to prevent state updates after unmount
        return () => {
            isMounted = false;
        };
    }, []);

    // useEffect(() => {
    //     const loadMovieData = async () => {
    //         try {
    //             // Option 1: Concurrent fetching with individual error handling
    //             const fetchPromises = [
    //                 getPopularMovies().catch(err => ({ error: err, data: [] })),
    //                 getFeaturedMovie().catch(err => ({ error: err, data: [] })),
    //                 getTopRatedMovies().catch(err => ({ error: err, data: [] })),
    //                 getTrendingMovies().catch(err => ({ error: err, data: [] })),
    //                 getPopularTVShows().catch(err => ({ error: err, data: [] }))
    //             ];

    //             const results = await Promise.allSettled(fetchPromises);
                
    //             // Process results with individual error handling
    //             const [popularResult, featuredResult, topRatedResult, trendingResult, tvResult] = results;
                
    //             // Set data only if fetch was successful, otherwise use empty array
    //             if (popularResult.status === 'fulfilled' && !popularResult.value.error) {
    //                 setMovies(popularResult.value.data || popularResult.value);
    //             } else {
    //                 console.warn('Failed to load popular movies:', popularResult.reason || popularResult.value?.error);
    //             }

    //             if (featuredResult.status === 'fulfilled' && !featuredResult.value.error) {
    //                 setFeaturedMovie(featuredResult.value.data || featuredResult.value);
    //             } else {
    //                 console.warn('Failed to load featured movies:', featuredResult.reason || featuredResult.value?.error);
    //             }

    //             if (topRatedResult.status === 'fulfilled' && !topRatedResult.value.error) {
    //                 setTopRatedMovies(topRatedResult.value.data || topRatedResult.value);
    //             } else {
    //                 console.warn('Failed to load top rated movies:', topRatedResult.reason || topRatedResult.value?.error);
    //             }

    //             if (trendingResult.status === 'fulfilled' && !trendingResult.value.error) {
    //                 setTrendingMovies(trendingResult.value.data || trendingResult.value);
    //             } else {
    //                 console.warn('Failed to load trending movies:', trendingResult.reason || trendingResult.value?.error);
    //             }

    //             if (tvResult.status === 'fulfilled' && !tvResult.value.error) {
    //                 setPopularTV(tvResult.value.data || tvResult.value);
    //             } else {
    //                 console.warn('Failed to load popular TV shows:', tvResult.reason || tvResult.value?.error);
    //             }

    //         } catch (error) {
    //             console.error("Unexpected error during data fetching:", error);
    //             setError("Failed to load movie data. Please try again later.");
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     loadMovieData();
    // }, []);



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
                <MovieSlidesSection movies={movies} title="Popular Movies" contentType="movie" />
                <MovieSlidesSection movies={popularTV} title="Popular TV Shows" contentType="tv" />
                <MovieSlidesSection movies={trendingMovies} title="Trending Movies" contentType="movie" />
                <MovieSlidesSection movies={topRatedMovies} title="Top Rated Movies" contentType="movie" />
            </>
        }
        {/* Latest Movies */}
    </>
}

export default Home;               
