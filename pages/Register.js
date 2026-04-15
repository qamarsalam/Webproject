import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
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
    "College of Pharmacy",
    "College of Agriculture",
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Please enter a valid email";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (formData.role === "student" && !formData.college)
      newErrors.college = "Please select your college";
    if (!formData.agreeTerms) newErrors.agreeTerms = "You must agree to the terms";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setUser({
          role: formData.role,
          email: formData.email,
          name: formData.fullName,
          college: formData.college,
        });
        setIsLoading(false);
        navigate("/events");
      }, 1500);
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
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">👤 Full Name</label>
              <input
                type="text"
                name="fullName"
                className={`form-input ${errors.fullName ? "input-error" : ""}`}
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
              />
              {errors.fullName && (
                <span className="error-message">{errors.fullName}</span>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">📧 Email Address</label>
              <input
                type="email"
                name="email"
                className={`form-input ${errors.email ? "input-error" : ""}`}
                placeholder="your@example.com"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            {/* Role Selection */}
            <div className="form-group">
              <label className="form-label">👥 I am a</label>
              <div className="role-selection">
                <label className={`role-option ${formData.role === "student" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={formData.role === "student"}
                    onChange={handleChange}
                  />
                  <span>🎓 Student</span>
                </label>
                <label className={`role-option ${formData.role === "organizer" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="role"
                    value="organizer"
                    checked={formData.role === "organizer"}
                    onChange={handleChange}
                  />
                  <span>🎤 Organizer</span>
                </label>
                <label className={`role-option ${formData.role === "external" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="role"
                    value="external"
                    checked={formData.role === "external"}
                    onChange={handleChange}
                  />
                  <span>👨‍💼 External</span>
                </label>
              </div>
            </div>

            {/* College Selection - Only for students */}
            {formData.role === "student" && (
              <div className="form-group">
                <label className="form-label">🏫 College</label>
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
                {errors.college && (
                  <span className="error-message">{errors.college}</span>
                )}
              </div>
            )}

            {/* Password */}
            <div className="form-group">
              <label className="form-label">🔐 Password</label>
              <input
                type="password"
                name="password"
                className={`form-input ${errors.password ? "input-error" : ""}`}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
              <p className="password-hint">
                Must be at least 8 characters with letters, numbers, and symbols
              </p>
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label">🔐 Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className={`form-input ${errors.confirmPassword ? "input-error" : ""}`}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>

            {/* Terms and Conditions */}
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
            {errors.agreeTerms && (
              <span className="error-message">{errors.agreeTerms}</span>
            )}

            {/* Register Button */}
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <div className="auth-footer">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="auth-link">
                Sign in
              </Link>
            </p>
            <Link to="/" className="back-link">
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Info Box */}
        <div className="auth-info-box register-info">
          <h2>What You Get</h2>
          <ul className="info-list">
            <li>🎯 Personalized event recommendations</li>
            <li>🔔 Smart notifications</li>
            <li>💫 Build your event portfolio</li>
            <li>🤝 Network with peers</li>
            <li>🏅 Exclusive student benefits</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Register;