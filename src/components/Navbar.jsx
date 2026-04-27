import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";

function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    setUser({ id: null, role: "external" });
    setIsMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const linkClassName = ({ isActive }) => `navbar-link${isActive ? " active" : ""}`;
  const authLinkClassName = ({ isActive }, variant) => {
    const baseClass = variant === "primary" ? "btn btn-primary btn-sm" : "btn btn-outline btn-sm";
    return `${baseClass}${isActive ? " nav-auth-active" : ""}`;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-text">KUEvents</span>
        </Link>

        <div className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          <NavLink to="/" end className={linkClassName} onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/events" className={linkClassName} onClick={closeMenu}>
            Events
          </NavLink>
          <NavLink to="/create-event" className={linkClassName} onClick={closeMenu}>
            Create Event
          </NavLink>
          <NavLink to="/contact" className={linkClassName} onClick={closeMenu}>
            Contact
          </NavLink>
        </div>

        <div className="navbar-auth">
          {user?.role === "external" || !user ? (
            <>
              <NavLink to="/login" className={(navState) => authLinkClassName(navState, "outline")} onClick={closeMenu}>
                Login
              </NavLink>
              <NavLink to="/register" className={(navState) => authLinkClassName(navState, "primary")} onClick={closeMenu}>
                Register
              </NavLink>
            </>
          ) : (
            <>
              <span className="user-badge">
                {user.name || user.role}
              </span>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                Logout
              </button>
            </>
          )}
        </div>

        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          Menu
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
