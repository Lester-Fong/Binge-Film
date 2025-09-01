import '../css/Footer.css';

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Top Section */}
                <div className="footer-top">

                    <div className="footer-demo-notice">
                        <div className="demo-badge">
                            <span className="demo-icon">⚡</span>
                            <span>DEMO</span>
                        </div>
                        <p className="demo-text">
                            This website is for demonstration purposes only. All content is used for educational and showcase purposes.
                        </p>
                    </div>
                    <div className="footer-brand">
                        <h2 className="footer-logo">Binge Film</h2>
                        <p className="footer-tagline">Your gateway to endless entertainment</p>
                    </div>

                </div>

                {/* Divider */}
                <div className="footer-divider"></div>

                {/* Bottom Section */}
                <div className="footer-bottom">
                    <div className="footer-copyright">
                        <p>&copy; {currentYear} Binge Film. All rights reserved.</p>
                        <p className="footer-credits">Built with passion for Cinema Enthusiasts</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
