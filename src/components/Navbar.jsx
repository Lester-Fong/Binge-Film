import { Link } from "react-router-dom";
import '../css/Navbar.css'
import { useState } from "react";
import SearchModal from "./SearchModal";

function Navbar() {
    const [showSearchModal, setShowSearchModal] = useState(false);
    console.log("Navbar rendered", showSearchModal);
    return (
        <>
            <nav className="navbar">
                <div className="navbar-brand">
                    <Link to="/">Binge Film</Link>
                </div>

                <div className="navbar-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/favorites" className="nav-link">TV Shows</Link>
                    <Link to="/favorites" className="nav-link">Favorites</Link>
                </div>

                <div className="search-container">
                    <form className="search-form">
                        <button placeholder="Search" type="button" className="search-input pointer" onClick={() => setShowSearchModal(true)}>
                            <span className="px-3">Search</span>
                        </button>
                    </form>
                </div>
            </nav>
            <SearchModal id="searchModal" showSearchModal={showSearchModal} setShowSearchModal={setShowSearchModal} />
        </>
    );
}

export default Navbar;
