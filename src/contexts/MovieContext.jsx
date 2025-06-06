import { createContext, useState, useContext, useEffect } from "react";

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const storedFavorites = localStorage.getItem("favorites");

        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
        }

    }, []);

    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);

    const addToFavorites = (movie) => {
        setFavorites((prevFavorites) => [...prevFavorites, movie]);
    }

    const removeToFavorites = (movieID) => {
        setFavorites((prevFavorites) => prevFavorites.filter(fav => fav.id !== movieID));
    }

    const isFavorite = (movieId) => {
        return favorites.some(fav => fav.id === movieId);
    }

    // Context value to be provided to components
    const value = {
        favorites,
        addToFavorites,
        removeToFavorites,
        isFavorite
    };

    return <MovieContext.Provider value={value}>
        {children}
    </MovieContext.Provider>
}