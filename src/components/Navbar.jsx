import { Link } from "react-router-dom";
import '../css/Navbar.css'
import { useState } from "react";
import SearchModal from "./SearchModal";

function Navbar() {
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };
    return (
        <>
            <nav className="navbar">
                <div className="navbar-brand">
                    <Link to="/" onClick={closeMobileMenu}>Binge Film</Link>
                </div>

                {/* Desktop Navigation Links */}
                <div className={`navbar-links ${isMobileMenuOpen ? 'navbar-links-mobile-open' : ''}`}>
                    <Link to="/" className="nav-link" onClick={closeMobileMenu}>Home</Link>
                    <Link to="/tvshows" className="nav-link" onClick={closeMobileMenu}>TV Shows</Link>
                    <Link to="/favorites" className="nav-link" onClick={closeMobileMenu}>Favorites</Link>

                    {/* Mobile Search Button */}
                    <div className="mobile-search-container">
                        <button
                            type="button"
                            className="mobile-search-btn pointer"
                            onClick={() => {
                                setShowSearchModal(true);
                                closeMobileMenu();
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Search</span>
                        </button>
                    </div>
                </div>

                {/* Desktop Search */}
                <div className="search-container desktop-search">
                    <form className="search-form">
                        <button
                            placeholder="Search"
                            type="button"
                            className="search-input pointer"
                            onClick={() => setShowSearchModal(true)}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="px-3">Search</span>
                        </button>
                    </form>
                </div>

                {/* Mobile Hamburger Menu */}
                <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
                    <div className={`hamburger ${isMobileMenuOpen ? 'hamburger-open' : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
            )}

            <SearchModal id="searchModal" showSearchModal={showSearchModal} setShowSearchModal={setShowSearchModal} />
        </>
    );
}

export default Navbar;
