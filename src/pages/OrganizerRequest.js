import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/KUEvents.css";
import "../styles/Auth.css";

function OrganizerRequest() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    universityEmail: "",
    clubDepartment: "",
    eventPurpose: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.universityEmail.trim()) newErrors.universityEmail = "University email is required";
    if (!/^[^\s@]+@ku\.edu\.kw$/.test(formData.universityEmail)) newErrors.universityEmail = "Must be a valid KU email ending with @ku.edu.kw";
    if (!formData.clubDepartment.trim()) newErrors.clubDepartment = "Club or department name is required";
    if (!formData.eventPurpose.trim()) newErrors.eventPurpose = "Event purpose/description is required";
    if (formData.eventPurpose.length > 1000) newErrors.eventPurpose = "Description cannot exceed 1000 characters";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      setTimeout(() => {
        const organizerRequest = {
          ...formData,
          id: Date.now(),
          status: "Pending",
          submittedAt: new Date().toISOString(),
        };

        const existingRequests = JSON.parse(localStorage.getItem("organizerRequests") || "[]");
        existingRequests.push(organizerRequest);
        localStorage.setItem("organizerRequests", JSON.stringify(existingRequests));

        setIsLoading(false);
        setIsSubmitted(true);

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }, 1000);
    }
  };

  const handleCancel = () => {
    navigate("/register");
  };

  if (isSubmitted) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-box">
            <div className="auth-header">
              <h1 className="auth-title">Request Submitted!</h1>
              <p className="auth-subtitle">Your organizer request has been submitted for review.</p>
            </div>
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: "48px", marginBottom: "20px" }}>Approved</div>
              <p style={{ color: "#6B7280", fontSize: "16px" }}>
                We'll review your request and get back to you within 3-5 business days.
              </p>
              <p style={{ color: "#9CA3AF", fontSize: "14px", marginTop: "20px" }}>
                Redirecting to login page...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-box register-box">
          <div className="auth-header">
            <h1 className="auth-title">Register as Event Organizer</h1>
            <p className="auth-subtitle">Submit your request to become an event organizer at Kuwait University.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className={`form-input ${errors.firstName ? "input-error" : ""}`}
                placeholder="Enter your first name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className={`form-input ${errors.lastName ? "input-error" : ""}`}
                placeholder="Enter your last name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">University Email</label>
              <input
                type="email"
                className={`form-input ${errors.universityEmail ? "input-error" : ""}`}
                placeholder="your.email@ku.edu.kw"
                name="universityEmail"
                value={formData.universityEmail}
                onChange={handleChange}
              />
              {errors.universityEmail && <span className="error-message">{errors.universityEmail}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Club or Department Name</label>
              <input
                type="text"
                className={`form-input ${errors.clubDepartment ? "input-error" : ""}`}
                placeholder="e.g. Computer Science Club"
                name="clubDepartment"
                value={formData.clubDepartment}
                onChange={handleChange}
              />
              {errors.clubDepartment && <span className="error-message">{errors.clubDepartment}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Event Purpose / Description</label>
              <textarea
                className={`form-input form-textarea ${errors.eventPurpose ? "input-error" : ""}`}
                placeholder="Describe your organization and the types of events you plan to create..."
                name="eventPurpose"
                value={formData.eventPurpose}
                onChange={handleChange}
                maxLength={1000}
                rows={4}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
                {errors.eventPurpose && <span className="error-message">{errors.eventPurpose}</span>}
                <span style={{ fontSize: "13px", color: "#9CA3AF", marginLeft: "auto" }}>
                  {formData.eventPurpose.length}/1000
                </span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "8px" }}>
              <button
                type="button"
                className="btn btn-outline btn-block"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit Organizer Request"}
              </button>
            </div>
          </form>

          <div className="auth-footer">
            <Link to="/" className="back-link">
              Back to Home
            </Link>
          </div>
        </div>

        <div className="auth-info-box register-info">
          <h2>Become an Event Organizer</h2>
          <p className="auth-info-subtitle">
            Create experiences that bring students together and manage your activities through a more professional workflow.
          </p>
          <ul className="info-list">
            <li>
              <span className="info-bullet" aria-hidden="true">🗂️</span>
              <div className="info-content">
                <strong>Create and manage events</strong>
                <span>Plan workshops, seminars, and student activities with clear visibility.</span>
              </div>
            </li>
            <li>
              <span className="info-bullet" aria-hidden="true">📣</span>
              <div className="info-content">
                <strong>Reach the right audience</strong>
                <span>Connect with students and faculty through a trusted university platform.</span>
              </div>
            </li>
            <li>
              <span className="info-bullet" aria-hidden="true">🏆</span>
              <div className="info-content">
                <strong>Grow your leadership</strong>
                <span>Build experience while organizing meaningful campus experiences.</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default OrganizerRequest;
