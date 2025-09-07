const EMBED_MOVIES_ENDPOINT = import.meta.env.VITE_VIDSRC_ENDPOINT;
const EMBED_TV_ENDPOINT = import.meta.env.VITE_VIDSRC_TV_ENDPOINT;
import axios from "axios";

const embedMovie = async (movieID) => {
  const response = await axios.get(`${EMBED_MOVIES_ENDPOINT}?imdb=${movieID}&ds_lang=en`);
  return response.data;
};

const embedTVShow = async (tvshowID, seasonCount, numberCount) => {
  const response = await axios.get(`${EMBED_TV_ENDPOINT}?imdb=${tvshowID}&season=${seasonCount}&episode=${numberCount}&ds_lang=en`);
  return response.data;
};

export { embedMovie, embedTVShow };
