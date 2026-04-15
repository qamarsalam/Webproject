import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/KUEvents.css";
import "../styles/Auth.css";

function Login() {
  const { setUser } = useContext(AuthContext);
  const [role, setRole] = useState("external");
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
      // Simulate API call
      setTimeout(() => {
        setUser({ role, email, name: email.split("@")[0] });
        setIsLoading(false);
        navigate("/events");
      }, 1000);
    }
  };

  const handleDemoLogin = (demoRole) => {
    setUser({ role: demoRole, email: `demo-${demoRole}@ku.edu.kw`, name: `Demo ${demoRole}` });
    navigate("/events");
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-box login-box">
          <div className="auth-header">
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your KUEvents account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Email Field */}
            <div className="form-group">
              <label className="form-label">
                📧 Email Address
              </label>
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

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label">
                🔐 Password
              </label>
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

            {/* Role Selection */}
            <div className="form-group">
              <label className="form-label">
                👤 Login As
              </label>
              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="external">External User</option>
                <option value="student">KU Student</option>
                <option value="organizer">Event Organizer</option>
              </select>
            </div>

            {/* Remember Me */}
            <div className="auth-checkbox">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span>Or continue as</span>
          </div>

          {/* Demo Login Buttons */}
          <div className="demo-buttons">
            <button
              type="button"
              className="btn-demo"
              onClick={() => handleDemoLogin("student")}
            >
              Demo Student
            </button>
            <button
              type="button"
              className="btn-demo"
              onClick={() => handleDemoLogin("organizer")}
            >
              Demo Organizer
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="auth-footer">
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="auth-link">
                Create one
              </Link>
            </p>
            <Link to="/" className="back-link">
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Info Box */}
        <div className="auth-info-box">
          <h2>Why Join KUEvents?</h2>
          <ul className="info-list">
            <li>✨ Discover amazing university events</li>
            <li>🎓 Connect with fellow students</li>
            <li>📱 Easy event management</li>
            <li>🔔 Never miss an event notification</li>
            <li>🏆 Earn badges and rewards</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Login;