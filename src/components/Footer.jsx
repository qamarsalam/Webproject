import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import fpic from "../images/fpic.png";
import "../styles/Footer.css";

function Footer() {
  const { user } = useContext(AuthContext);
  const canCreateEvent = user?.role === "organizer" || user?.role === "admin";

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="container">
          <div className="footer-grid">
            {/* About Section */}
            <div className="footer-section footer-brand">
              <Link to="/" aria-label="Go to KUEvents home">
                <img src={fpic} alt="Kuwait University Logo" className="footer-logo-image" />
              </Link>
              <h3 className="footer-title">KUEvents</h3>
              <p className="footer-description">
                Kuwait University's premier platform for discovering and managing events. Connect with peers and build your university experience.
              </p>
              <div className="footer-socials">
                <a href="https://www.facebook.com" className="social-link" title="Facebook" target="_blank" rel="noreferrer">f</a>
                <a href="https://x.com" className="social-link" title="X" target="_blank" rel="noreferrer">X</a>
                <a href="https://www.instagram.com" className="social-link" title="Instagram" target="_blank" rel="noreferrer">IG</a>
                <a href="https://www.linkedin.com" className="social-link" title="LinkedIn" target="_blank" rel="noreferrer">in</a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h4 className="footer-section-title">Quick Links</h4>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/events">All Events</Link></li>
                {user?.role === "organizer" && <li><Link to="/organizer-dashboard">Organizer Dashboard</Link></li>}
                {canCreateEvent ? (
                  <li><Link to="/create-event">Create Event</Link></li>
                ) : (
                  <li><Link to="/organizer-request">Request Organizer Access</Link></li>
                )}
                {user?.role !== "admin" && <li><Link to="/contact">Contact Us</Link></li>}
                {user?.role === "admin" && <li><Link to="/admin">Admin Dashboard</Link></li>}
              </ul>
            </div>

            {/* Categories */}
            <div className="footer-section">
              <h4 className="footer-section-title">Categories</h4>
              <ul className="footer-links">
                <li><Link to="/events">Academic Events</Link></li>
                <li><Link to="/events">Research & Expos</Link></li>
                <li><Link to="/events">Workshops</Link></li>
                <li><Link to="/events">Seminars</Link></li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p className="footer-copyright">
                © 2026 KUEvents. All rights reserved. Built for Kuwait University students.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
