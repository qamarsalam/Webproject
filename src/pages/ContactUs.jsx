import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";
import "../styles/InfoPages.css";

function ContactUs() {
  const getSavedUser = () => {
    try {
      return JSON.parse(localStorage.getItem("kuEventsUser") || "null");
    } catch {
      return null;
    }
  };
  const savedUser = getSavedUser();
  const isLoggedIn = Boolean(savedUser?.id);
  const defaultContactEmail = savedUser?.email || localStorage.getItem("lastContactEmail") || "";
  const activeReplyEmail = isLoggedIn ? savedUser.email : defaultContactEmail;

  const [formData, setFormData] = useState({
    name: savedUser?.name || "",
    email: defaultContactEmail,
    subject: "",
    message: "",
  });
  const [replyEmail, setReplyEmail] = useState(activeReplyEmail);
  const [contactMessages, setContactMessages] = useState(() =>
    []
  );
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [replyLoadError, setReplyLoadError] = useState("");

  const userMessages = contactMessages.filter(
    (message) =>
      message.email.toLowerCase() ===
      (isLoggedIn ? savedUser.email : replyEmail).trim().toLowerCase()
  );

  useEffect(() => {
    if (!isLoggedIn) return;

    refreshMessages();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
    if (isSubmitted) setIsSubmitted(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const data = await apiRequest("/contact", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      localStorage.setItem("lastContactEmail", formData.email);
      if (isLoggedIn) {
        setContactMessages([data.contactMessage, ...contactMessages]);
      }
      setReplyEmail(formData.email);
      setFormData({
        name: savedUser?.name || "",
        email: savedUser?.email || formData.email,
        subject: "",
        message: "",
      });
      setIsSubmitted(true);
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  async function refreshMessages() {
    if (!isLoggedIn) return;

    try {
      const data = await apiRequest("/contact/my");
      setContactMessages(data.messages);
      setReplyLoadError("");
    } catch (error) {
      setReplyLoadError(error.message);
    }
  };

  return (
    <div className="info-page-shell">
      <section className="info-page-hero info-page-hero-contact">
        <div className="container info-page-hero-grid">
          <div className="info-page-copy">
            <span className="badge badge-primary">Support & Guidance</span>
            <h1 className="info-page-title">Contact the KUEvents team.</h1>
            <p className="info-page-text">
              Reach out for organizer support, event questions, or help using the platform. We are here to keep campus event planning smooth and simple.
            </p>

            <div className="info-page-contact-list">
              <div className="info-page-contact-item">
                <strong>Email</strong>
                <span>support@kuevents.edu.kw</span>
              </div>
              <div className="info-page-contact-item">
                <strong>Office Hours</strong>
                <span>Sunday to Thursday, 9:00 AM to 4:00 PM</span>
              </div>
              <div className="info-page-contact-item">
                <strong>Response Time</strong>
                <span>Usually within one business day</span>
              </div>
            </div>
          </div>

          <div className="info-page-panel">
            <div className="info-page-panel-header">
              <span className="info-page-panel-kicker">Send a message</span>
              <h2>We would love to hear from you</h2>
              <p>Share your question and the team will get back to you as soon as possible.</p>
            </div>

            <form className="info-page-form" onSubmit={handleSubmit}>
              <div className="info-page-form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-name">Your Name</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    className={`form-input ${errors.name ? "input-error" : ""}`}
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                {isLoggedIn ? (
                  <div className="form-group">
                    <label className="form-label">Account</label>
                    <div className="contact-account-email">
                      <strong>{savedUser.name}</strong>
                      <span>{savedUser.email}</span>
                    </div>
                  </div>
                ) : (
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-email">Your Email</label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      className={`form-input ${errors.email ? "input-error" : ""}`}
                      placeholder="name@ku.edu.kw"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-subject">Subject</label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  className={`form-input ${errors.subject ? "input-error" : ""}`}
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={handleChange}
                />
                {errors.subject && <span className="error-message">{errors.subject}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  className={`form-textarea ${errors.message ? "input-error" : ""}`}
                  placeholder="Tell us about your question, issue, or request."
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                />
                {errors.message && <span className="error-message">{errors.message}</span>}
              </div>

              <div className="info-page-form-actions">
                <button type="submit" className="btn btn-primary">Send Message</button>
              </div>
              {isSubmitted && (
                <p className="success-message">
                  Message sent successfully. The admin team can now review it.
                </p>
              )}
              {errors.submit && <span className="error-message">{errors.submit}</span>}
            </form>
          </div>
        </div>
      </section>

      <section className="info-page-support">
        <div className="container info-page-support-grid info-page-support-grid-two">
          <div className="info-page-support-card card">
            <h3 className="card-header">Need organizer help?</h3>
            <p className="card-text">
              Ask about event setup, visibility settings, approval flow, or how to improve your event listing before publishing.
            </p>
          </div>

          <div className="info-page-support-card card">
            <h3 className="card-header">Reporting an issue</h3>
            <p className="card-text">
              Include the page you were using and a short description of the problem so the support team can help faster.
            </p>
          </div>
        </div>
      </section>

      <section className="info-page-support">
        <div className="container">
          <div className="info-page-panel contact-replies-panel">
            <div className="info-page-panel-header">
              <span className="info-page-panel-kicker">Message replies</span>
              <h2>Your Messages</h2>
              <p>
                {isLoggedIn
                  ? "Admin responses for your account appear here inside the website."
                  : "Log in to view admin responses inside the website."}
              </p>
            </div>

            <div className="contact-replies-toolbar">
              {isLoggedIn ? (
                <div className="contact-account-email">
                  <strong>Showing replies for your account</strong>
                  <span>{savedUser.email}</span>
                </div>
              ) : (
                <p className="contact-replies-empty">
                  Sign in with your KUEvents account to check responses.
                </p>
              )}
              {isLoggedIn && (
                <button type="button" className="btn btn-outline" onClick={refreshMessages}>
                  Refresh Replies
                </button>
              )}
            </div>

            {replyLoadError ? (
              <p className="contact-replies-empty">{replyLoadError}</p>
            ) : !isLoggedIn ? (
              <p className="contact-replies-empty">Your replies will appear here after you log in.</p>
            ) : userMessages.length === 0 ? (
              <p className="contact-replies-empty">No messages found yet.</p>
            ) : (
              <div className="contact-replies-list">
                {userMessages.map((message) => (
                  <div key={message.id} className="contact-reply-card">
                    <div className="contact-reply-header">
                      <div>
                        <h3>{message.subject}</h3>
                        <small>
                          Sent: {new Date(message.submittedAt).toLocaleDateString()} at{" "}
                          {new Date(message.submittedAt).toLocaleTimeString()}
                        </small>
                      </div>
                      <span className={`contact-reply-status ${message.status.toLowerCase()}`}>
                        {message.status}
                      </span>
                    </div>

                    <div className="contact-reply-message">
                      <strong>Your message</strong>
                      <p>{message.message}</p>
                    </div>

                    {message.response ? (
                      <div className="contact-reply-response">
                        <strong>Admin response</strong>
                        <p>{message.response}</p>
                        {message.respondedAt && (
                          <small>
                            Responded: {new Date(message.respondedAt).toLocaleDateString()} at{" "}
                            {new Date(message.respondedAt).toLocaleTimeString()}
                          </small>
                        )}
                      </div>
                    ) : (
                      <p className="contact-replies-empty">No admin response yet.</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactUs;
