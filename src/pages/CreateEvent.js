import "../styles/InfoPages.css";

function CreateEvent() {
  return (
    <div className="info-page-shell">
      <section className="info-page-hero info-page-hero-create">
        <div className="container info-page-hero-grid">
          <div className="info-page-copy">
            <span className="badge badge-gold">Organizer Studio</span>
            <h1 className="info-page-title">Create an event that feels worth showing up for.</h1>
            <p className="info-page-text">
              Build a polished KUEvents listing with clear details, the right audience, and a strong first impression for students and faculty.
            </p>
            <div className="info-page-highlights">
              <div className="info-page-highlight-card">
                <strong>Smart visibility</strong>
                <span>Choose between campus-wide promotion and KU-only access.</span>
              </div>
              <div className="info-page-highlight-card">
                <strong>Clean details</strong>
                <span>Keep your event title, timing, and location easy to scan.</span>
              </div>
            </div>
          </div>

          <div className="info-page-panel info-page-panel-accent">
            <div className="info-page-panel-header">
              <span className="info-page-panel-kicker">Event draft</span>
              <h2>Publish in a few steps</h2>
              <p>Complete the form below to prepare your event for the KUEvents community.</p>
            </div>

            <form className="info-page-form">
              <div className="form-group">
                <label className="form-label" htmlFor="event-title">Event Title</label>
                <input id="event-title" className="form-input" placeholder="Ex: AI in Student Research Summit" />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="event-description">Description</label>
                <textarea
                  id="event-description"
                  className="form-textarea"
                  placeholder="Tell attendees what the event is about, who it is for, and what they can expect."
                  rows="5"
                />
              </div>

              <div className="info-page-form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="event-date">Event Date</label>
                  <input id="event-date" type="date" className="form-input" />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="event-location">Location</label>
                  <input id="event-location" className="form-input" placeholder="Campus hall, auditorium, or online" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="event-visibility">Audience</label>
                <select id="event-visibility" className="form-select" defaultValue="Public">
                  <option>Public</option>
                  <option>KU Only</option>
                </select>
              </div>

              <div className="info-page-form-actions">
                <button type="button" className="btn btn-outline">Save Draft</button>
                <button type="submit" className="btn btn-primary">Publish Event</button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="info-page-support">
        <div className="container info-page-support-grid">
          <div className="info-page-support-card card">
            <h3 className="card-header">What makes a strong event page?</h3>
            <p className="card-text">
              A concise title, a useful description, and a clear location make it much easier for attendees to trust the event and register.
            </p>
          </div>

          <div className="info-page-support-card card">
            <h3 className="card-header">Recommended checklist</h3>
            <p className="card-text">
              Confirm your date, explain the agenda, mention the target audience, and choose the correct visibility before publishing.
            </p>
          </div>

          <div className="info-page-support-card card">
            <h3 className="card-header">Organizer tip</h3>
            <p className="card-text">
              Use KU-only visibility for internal academic activities and public visibility for broader campus engagement.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CreateEvent;
