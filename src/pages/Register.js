import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { apiRequest, normalizeBackendRole } from "../utils/api";
import "../styles/KUEvents.css";
import "../styles/Auth.css";

function Register() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    college: "",
    organizationName: "",
    organizationDescription: "",
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const colleges = [
    "College of Engineering",
    "College of Science",
    "College of Medicine",
    "College of Law",
    "College of Business",
    "College of Education",
    "College of Sharia",
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    } else if (formData.role !== "external" && !formData.email.trim().toLowerCase().endsWith("@ku.edu.kw")) {
      newErrors.email = "KU users must use an email ending with @ku.edu.kw";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (formData.role === "student" && !formData.college) {
      newErrors.college = "Please select your college";
    }
    if (formData.role === "organizer" && !formData.organizationName.trim()) {
      newErrors.organizationName = "Organization name is required";
    }
    if (formData.role === "organizer" && !formData.organizationDescription.trim()) {
      newErrors.organizationDescription = "Organization description is required";
    }
    if (!formData.agreeTerms) newErrors.agreeTerms = "You must agree to the terms";
    return newErrors;
  };

  const getRegisterErrors = (message) => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("already") || lowerMessage.includes("exists") || lowerMessage.includes("email")) {
      return { email: message };
    }

    if (lowerMessage.includes("password")) {
      return { password: message };
    }

    if (lowerMessage.includes("name")) {
      return { fullName: message };
    }

    if (lowerMessage.includes("organization")) {
      return { organizationName: message };
    }

    return { email: message };
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (errors[name] || errors.submit) setErrors({ ...errors, [name]: "", submit: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);

      try {
        const data = await apiRequest("/auth/register", {
          method: "POST",
          body: JSON.stringify({
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
            role: normalizeBackendRole(formData.role),
          }),
        });

        if (formData.role === "organizer") {
          await apiRequest("/organizers/me", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
            body: JSON.stringify({
              organizationName: formData.organizationName,
              description: formData.organizationDescription,
            }),
          });
        }

        localStorage.removeItem("kuEventsToken");
        localStorage.removeItem("kuEventsUser");
        setUser({ role: "external" });
        setIsLoading(false);
        navigate("/login", {
          state: { message: "Account created successfully. Please log in." },
        });
      } catch (error) {
        setIsLoading(false);
        setErrors(getRegisterErrors(error.message));
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container register-container">
        <div className="auth-box register-box">
          <div className="auth-header">
            <h1 className="auth-title">Join KUEvents</h1>
            <p className="auth-subtitle">Create your account and start exploring</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="fullName"
                className={`form-input ${errors.fullName ? "input-error" : ""}`}
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
              />
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className={`form-input ${errors.email ? "input-error" : ""}`}
                placeholder="your@gmail.com"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">I am a</label>
              <div className="role-selection">
                <label className={`role-option ${formData.role === "student" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={formData.role === "student"}
                    onChange={handleChange}
                  />
                  <span>Student</span>
                </label>
                <label className={`role-option ${formData.role === "external" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="role"
                    value="external"
                    checked={formData.role === "external"}
                    onChange={handleChange}
                  />
                  <span>External Participant (Public User)</span>
                </label>
                <label className={`role-option ${formData.role === "organizer" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="role"
                    value="organizer"
                    checked={formData.role === "organizer"}
                    onChange={handleChange}
                  />
                  <span>Organizer</span>
                </label>
              </div>
            </div>

            {formData.role === "student" && (
              <div className="form-group">
                <label className="form-label">College</label>
                <select
                  name="college"
                  className={`form-select ${errors.college ? "input-error" : ""}`}
                  value={formData.college}
                  onChange={handleChange}
                >
                  <option value="">Select your college</option>
                  {colleges.map((college) => (
                    <option key={college} value={college}>
                      {college}
                    </option>
                  ))}
                </select>
                {errors.college && <span className="error-message">{errors.college}</span>}
              </div>
            )}

            {formData.role === "organizer" && (
              <>
                <div className="form-group">
                  <label className="form-label">Organization Name</label>
                  <input
                    type="text"
                    name="organizationName"
                    className={`form-input ${errors.organizationName ? "input-error" : ""}`}
                    placeholder="Computer Science Club"
                    value={formData.organizationName}
                    onChange={handleChange}
                  />
                  {errors.organizationName && <span className="error-message">{errors.organizationName}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Organization Description</label>
                  <textarea
                    name="organizationDescription"
                    className={`form-input form-textarea ${errors.organizationDescription ? "input-error" : ""}`}
                    placeholder="Tell us what kind of events your organization will create."
                    value={formData.organizationDescription}
                    onChange={handleChange}
                    rows={4}
                  />
                  {errors.organizationDescription && <span className="error-message">{errors.organizationDescription}</span>}
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className={`form-input ${errors.password ? "input-error" : ""}`}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
              <p className="password-hint">
                Must be at least 8 characters with letters, numbers, and symbols
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className={`form-input ${errors.confirmPassword ? "input-error" : ""}`}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>

            <div className="auth-checkbox">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              <label htmlFor="agreeTerms">
                I agree to the{" "}
                <a href="#" className="auth-link">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="auth-link">
                  Privacy Policy
                </a>
              </label>
            </div>
            {errors.agreeTerms && <span className="error-message">{errors.agreeTerms}</span>}

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
            {errors.submit && <span className="error-message">{errors.submit}</span>}
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="auth-link">
                Sign in
              </Link>
            </p>
            <p>
              Want to organize events?{" "}
              <Link to="/organizer-request" className="auth-link">
                Register as Event Organizer
              </Link>
            </p>
            <Link to="/" className="back-link">
              Back to Home
            </Link>
          </div>
        </div>

        <div className="auth-info-box register-info">
          <h2>What You Get</h2>
          <p className="auth-info-subtitle">
            Your KUEvents account gives you a cleaner way to explore events, follow what matters, and build your student journey.
          </p>
          <ul className="info-list">
            <li>
              <span className="info-bullet" aria-hidden="true">🎯</span>
              <div className="info-content">
                <strong>Personalized recommendations</strong>
                <span>See events that match your role, interests, and campus life.</span>
              </div>
            </li>
            <li>
              <span className="info-bullet" aria-hidden="true">🔔</span>
              <div className="info-content">
                <strong>Smarter notifications</strong>
                <span>Keep track of updates, important dates, and event availability.</span>
              </div>
            </li>
            <li>
              <span className="info-bullet" aria-hidden="true">🌟</span>
              <div className="info-content">
                <strong>Stronger student profile</strong>
                <span>Build your event journey and stay engaged with campus opportunities.</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Register;
