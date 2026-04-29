import { useContext, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { apiRequest, saveAuthSession, toFrontendUser } from "../utils/api";
import "../styles/KUEvents.css";
import "../styles/Auth.css";

function Login() {
  const { setUser } = useContext(AuthContext);
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Please enter a valid email";
    if (!password) newErrors.password = "Password is required";
    if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);

      try {
        const data = await apiRequest("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        const loggedInUser = toFrontendUser(data.user);
        saveAuthSession(data.token, loggedInUser);
        setUser(loggedInUser);
        setIsLoading(false);
        navigate(loggedInUser.role === "organizer" ? "/organizer-dashboard" : "/events");
      } catch (error) {
        setIsLoading(false);
        setErrors({ submit: error.message });
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-box login-box">
          <div className="auth-header">
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your KUEvents account</p>
            {location.state?.message && (
              <p className="success-message">{location.state.message}</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className={`form-input ${errors.email ? "input-error" : ""}`}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className={`form-input ${errors.password ? "input-error" : ""}`}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="auth-checkbox">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
            {errors.submit && <span className="error-message">{errors.submit}</span>}
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="auth-link">
                Create one
              </Link>
            </p>
            <Link to="/" className="back-link">
              Back to Home
            </Link>
          </div>
        </div>

        <div className="auth-info-box">
          <h2>Why Join KUEvents?</h2>
          <p className="auth-info-subtitle">
            One place to discover campus activities, stay updated, and make your university experience more connected.
          </p>
          <ul className="info-list">
            <li>
              <span className="info-bullet" aria-hidden="true">📅</span>
              <div className="info-content">
                <strong>Discover campus events</strong>
                <span>Find academic, social, and student-led activities in one feed.</span>
              </div>
            </li>
            <li>
              <span className="info-bullet" aria-hidden="true">🔔</span>
              <div className="info-content">
                <strong>Stay updated</strong>
                <span>Get timely visibility into new opportunities and important event details.</span>
              </div>
            </li>
            <li>
              <span className="info-bullet" aria-hidden="true">🤝</span>
              <div className="info-content">
                <strong>Join the community</strong>
                <span>Connect with students, organizers, and university initiatives more easily.</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Login;

