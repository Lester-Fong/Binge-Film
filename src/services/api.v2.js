const LIST_MOVIES_ENDPOINT = import.meta.env.VITE_VIDSRC_LIST_MOVIES_ENDPOINT;
const EMBED_MOVIES_ENDPOINT = import.meta.env.VITE_VIDSRC_ENDPOINT;
import axios from "axios";

const getPopularMovies = async (pageCount) => {
  const response = await axios.get(`${LIST_MOVIES_ENDPOINT}/page-${pageCount}.json`);
  return response.data.result; // Ensure we return an empty array if results are undefined
};

const embedMovie = async (movieID) => {
  const response = await axios.get(`${EMBED_MOVIES_ENDPOINT}/${movieID}`);
  return response.data;
};

export { getPopularMovies, embedMovie };
