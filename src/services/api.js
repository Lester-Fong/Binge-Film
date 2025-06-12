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

// For Searching of Movies
const searchMovies = async (query) => {
  const response = await axios.get(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
  const data = await response.data;
  return data.results;
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
  return data.results[0];
};

export { getPopularMovies, searchMovies, getMovieDetails, getMovieVideo, getFeaturedMovie };
