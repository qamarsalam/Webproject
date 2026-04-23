import "../styles/InfoPages.css";

function ContactUs() {
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

            <form className="info-page-form">
              <div className="info-page-form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-name">Your Name</label>
                  <input id="contact-name" type="text" className="form-input" placeholder="Enter your full name" />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-email">Your Email</label>
                  <input id="contact-email" type="email" className="form-input" placeholder="name@ku.edu.kw" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-subject">Subject</label>
                <input id="contact-subject" type="text" className="form-input" placeholder="How can we help?" />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  className="form-textarea"
                  placeholder="Tell us about your question, issue, or request."
                  rows="6"
                />
              </div>

              <div className="info-page-form-actions">
                <button type="submit" className="btn btn-primary">Send Message</button>
              </div>
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
    </div>
  );
}

export default ContactUs;
