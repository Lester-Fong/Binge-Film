const LIST_MOVIES_ENDPOINT = import.meta.env.VITE_VIDSRC_LIST_MOVIES_ENDPOINT;
import axios from "axios";

const getPopularMovies = async (pageCount) => {
  const response = await axios.get(`${LIST_MOVIES_ENDPOINT}/page-${pageCount}.json`);
  console.log("Response from getPopularMovies:", response);
  return response.data.result; // Ensure we return an empty array if results are undefined
};

const searchMovies = async () => {};

export { getPopularMovies, searchMovies };
