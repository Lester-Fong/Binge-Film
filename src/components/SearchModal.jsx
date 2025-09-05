import { useState } from "react";
import { searchMulti } from "../services/api";
import { Link } from "react-router-dom";
import MediaCard from "./MediaCard";

function SearchModal({ showSearchModal, setShowSearchModal }) {
    const [searchValue, setSearchValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [results, setResults] = useState([]);

    const modalStyle = {
        backgroundColor: 'rgba(250, 250, 250, 0.09)',
        borderRadius: '8px',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(9px)',
        WebkitBackdropFilter: 'blur(9px)',
        maxHeight: '60vh',
        overflowY: 'auto',
    }

    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        zIndex: 100,
    };

    const handleClose = () => {
        setShowSearchModal(false);
        setSearchValue('');
        setResults([]);
        setErrorMessage('');
    }

    const handleSearch = async (e) => {
        setSearchValue(e.target.value);
        if (e.target.value.length >= 3) {
            try {
                const response = await searchMulti(e.target.value);
                if (response && response.length > 0) {
                    setResults(response);
                    setErrorMessage('');
                } else {
                    setResults([]);
                    setErrorMessage('No results found.');
                }
            } catch (error) {
                console.error("Error fetching search results:", error);
                setErrorMessage('Failed to fetch search results. Please try again later.');
                setResults([]);
            }
        } else if (e.target.value.length < 3) {
            setResults([]);
            setErrorMessage('');
        }
    }

    return (<>
        <div style={showSearchModal ? overlayStyle : {}} onClick={handleClose}></div>
        <div onClose={() => setShowSearchModal(false)} style={modalStyle} className={`w-5/12 top-2/12 left-3/10 fixed z-150 ${showSearchModal ? 'block' : 'hidden'}`}>
            <div className="py-2">
                <form className="search-form">
                    <input type="text" value={searchValue} onChange={handleSearch} placeholder="Search for movies or TV shows..." className="search-input w-full p-2 rounded" />
                </form>
                {errorMessage && <div className="text-red-500 mt-2 text-center">{errorMessage}</div>}
                {results.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-2 py-2">
                        {results.map(item => {
                            const isMovie = item.media_type === 'movie' || item.title;
                            const linkTo = isMovie ? `/movie/${item.id}` : `/tv/${item.id}`;
                            
                            return (
                                <Link to={linkTo} key={`${item.media_type}-${item.id}`} onClick={handleClose}>
                                    <MediaCard media={item} />
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    </>
    );
}

export default SearchModal;