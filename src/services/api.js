// For Vite or modern setups, use import.meta.env; otherwise, hardcode for testing
const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;
import axios from "axios";

// For Popular Movies
const getPopularMovies = async () => {
  const response = await axios.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
  const data = await response.data;
  return data.results;
};

// For TopRated Movies
const getTopRatedMovies = async () => {
  const response = await axios.get(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`);
  const data = await response.data;
  return data.results;
};

// For Trending Movies
const getTrendingMovies = async () => {
  const response = await axios.get(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}`);
  const data = await response.data;
  return data.results;
};

// For Searching of Movies
const searchMovies = async (query) => {
  const response = await axios.get(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
  const data = await response.data;
  return data.results;
};

// For Searching of TV Shows
const searchTVShows = async (query) => {
  const response = await axios.get(`${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
  const data = await response.data;
  return data.results;
};

// For Searching both Movies and TV Shows
const searchMulti = async (query) => {
  const response = await axios.get(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
  const data = await response.data;
  // Filter out person results, keep only movie and tv
  return data.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv');
};

// For Movie Details
const getMovieDetails = async (movieId) => {
  const response = await axios.get(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
  const data = await response.data;
  return data;
};

// For Trailers
const getMovieVideo = async (movieId) => {
  const response = await axios.get(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
  const data = await response.data;
  return data;
};

const getFeaturedMovie = async () => {
  const response = await axios.get(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}`);
  const data = await response.data;
  return data.results;
};

// For Similar Movies
const getSimilarMovies = async (movieId) => {
  const response = await axios.get(`${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}`);
  const data = await response.data;
  return data.results;
};

// For Movie Reviews
const getMovieReviews = async (movieId) => {
  const response = await axios.get(`${BASE_URL}/movie/${movieId}/reviews?api_key=${API_KEY}`);
  const data = await response.data;
  return data;
};


// ============== TV SHOWS =============>
const getPopularTVShows = async () => {
  const response = await axios.get(`${BASE_URL}/tv/popular?api_key=${API_KEY}`);
  const data = await response.data;
  return data.results;
};

// For TV Show Details
const getTVShowDetails = async (tvId) => {
  const response = await axios.get(`${BASE_URL}/tv/${tvId}?api_key=${API_KEY}`);
  const data = await response.data;
  return data;
};

// For Similar TV Shows
const getSimilarTVShows = async (tvId) => {
  const response = await axios.get(`${BASE_URL}/tv/${tvId}/similar?api_key=${API_KEY}`);
  const data = await response.data;
  return data.results;
};

// For TV Show Reviews
const getTVShowReviews = async (tvId) => {
  const response = await axios.get(`${BASE_URL}/tv/${tvId}/reviews?api_key=${API_KEY}`);
  const data = await response.data;
  return data;
};

// For TV Show Videos/Trailers
const getTVShowVideo = async (tvId) => {
  const response = await axios.get(`${BASE_URL}/tv/${tvId}/videos?api_key=${API_KEY}`);
  const data = await response.data;
  return data;
};

// For TV Show Season Details
const getTVShowSeason = async (tvId, seasonNumber) => {
  const response = await axios.get(`${BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${API_KEY}`);
  const data = await response.data;
  return data;
};

export { 
  getPopularMovies, searchMovies, searchTVShows, searchMulti, getMovieDetails, getMovieVideo, getFeaturedMovie, 
  getTopRatedMovies, getTrendingMovies, getSimilarMovies, getMovieReviews, 
  getPopularTVShows, getTVShowDetails, getSimilarTVShows, getTVShowReviews, 
  getTVShowVideo, getTVShowSeason 
};
