import { Link } from "react-router-dom";
import fpic from "../images/fpic.png";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="container">
          <div className="footer-grid">
            {/* About Section */}
            <div className="footer-section">
              <img src={fpic} alt="Kuwait University Logo" className="footer-logo-image" />
              <h3 className="footer-title">KUEvents</h3>
              <p className="footer-description">
                Kuwait University's premier platform for discovering and managing events. Connect with peers and build your university experience.
              </p>
              <div className="footer-socials">
                <a href="#" className="social-link" title="Facebook">f</a>
                <a href="#" className="social-link" title="Twitter">𝕏</a>
                <a href="#" className="social-link" title="Instagram">📷</a>
                <a href="#" className="social-link" title="LinkedIn">in</a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h4 className="footer-section-title">Quick Links</h4>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/events">All Events</Link></li>
                <li><Link to="/create-event">Create Event</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/admin">Admin Dashboard</Link></li>
              </ul>
            </div>

            {/* Categories */}
            <div className="footer-section">
              <h4 className="footer-section-title">Categories</h4>
              <ul className="footer-links">
                <li><a href="#academic">Academic Events</a></li>
                <li><a href="#research">Research & Expos</a></li>
                <li><a href="#workshops">Workshops</a></li>
                <li><a href="#seminars">Seminars</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="footer-section">
              <h4 className="footer-section-title">Resources</h4>
              <ul className="footer-links">
                <li><a href="#about">About KUEvents</a></li>
                <li><a href="#terms">Terms of Service</a></li>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p className="footer-copyright">
                © 2026 KUEvents. All rights reserved. Built with ❤️ for Kuwait University students.
              </p>
              <div className="footer-legal">
                <a href="#privacy">Privacy</a>
                <span className="divider">•</span>
                <a href="#terms">Terms</a>
                <span className="divider">•</span>
                <a href="#cookies">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;