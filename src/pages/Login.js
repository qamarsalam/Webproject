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
      setTimeout(() => {
        const userId = `${email}`.replace(/[@.]/g, "").substring(0, 20);
        setUser({ id: userId, role, email, name: email.split("@")[0] });
        setIsLoading(false);
        navigate("/events");
      }, 1000);
    }
  };

  const handleDemoLogin = (demoRole) => {
    const demoId = `demo-${demoRole}-${Date.now()}`;
    setUser({ id: demoId, role: demoRole, email: `demo-${demoRole}@ku.edu.kw`, name: `Demo ${demoRole}` });
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

            <div className="form-group">
              <label className="form-label">Login As</label>
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
          </form>

          <div className="auth-divider">
            <span>Or continue as</span>
          </div>

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
