import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/OrganizerRequest.css";

function OrganizerRequest() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    universityEmail: "",
    clubDepartment: "",
    eventPurpose: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add API call here to submit organizer request
  };

  const handleCancel = () => {
    navigate("/register");
  };

  return (
    <div className="organizer-container">
      <div className="organizer-form-wrapper">
        <div className="organizer-header">
          <div className="organizer-icon">📋</div>
          <h1>Register as Event Organizer</h1>
          <p>Submit your request to become an event organizer at Kuwait University.</p>
        </div>

        <form onSubmit={handleSubmit} className="organizer-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">
                First Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">
                Last Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="universityEmail">
              University Email <span className="required">*</span>
            </label>
            <input
              type="email"
              id="universityEmail"
              name="universityEmail"
              placeholder="your.email@ku.edu.kw"
              value={formData.universityEmail}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="clubDepartment">
              Club or Department Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="clubDepartment"
              name="clubDepartment"
              placeholder="e.g. Computer Science Club"
              value={formData.clubDepartment}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="eventPurpose">
              Event Purpose / Description <span className="required">*</span>
            </label>
            <textarea
              id="eventPurpose"
              name="eventPurpose"
              placeholder="Describe your organization and the types of events you plan to create..."
              value={formData.eventPurpose}
              onChange={handleChange}
              maxLength={1000}
              required
            />
            <div className="character-count">
              {formData.eventPurpose.length}/1000
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Submit Organizer Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OrganizerRequest;