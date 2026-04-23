import { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import events from "../data/events";
import { AuthContext } from "../context/AuthContext";
import "../styles/AppPages.css";

function EventDetails() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const event = events.find((item) => item.id === Number(id));

  if (!event) {
    return (
      <div className="app-page-shell">
        <div className="container app-page-simple-state">
          <div className="app-empty-state card">
            <h2 className="card-header">Event not found</h2>
            <p className="card-text">The event you are looking for is no longer available.</p>
            <Link to="/events" className="btn btn-primary">Back to Events</Link>
          </div>
        </div>
      </div>
    );
  }

  if (event.visibility === "ku-only" && user?.role !== "student") {
    return (
      <div className="app-page-shell">
        <div className="container app-page-simple-state">
          <div className="app-empty-state card">
            <h2 className="card-header">This event is restricted to KU students</h2>
            <p className="card-text">Sign in with a student account to view full details for campus-only events.</p>
            <Link to="/login" className="btn btn-primary">Go to Login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-page-shell">
      <section className="app-page-hero">
        <div className="container app-page-hero-grid">
          <div className="app-page-copy">
            <span className={`badge ${event.visibility === "ku-only" ? "badge-primary" : "badge-gold"}`}>
              {event.visibility === "ku-only" ? "KU Only" : "Public Event"}
            </span>
            <h1 className="app-page-title">{event.title}</h1>
            <p className="app-page-text">{event.description}</p>
            <div className="app-page-actions">
              <Link to="/events" className="btn btn-outline">Back to Events</Link>
              <Link to="/contact" className="btn btn-primary">Contact Organizers</Link>
            </div>
          </div>

          <div className="app-page-panel">
            <div className="app-detail-list">
              <div className="app-detail-item">
                <strong>Date</strong>
                <span>{event.date}</span>
              </div>
              <div className="app-detail-item">
                <strong>Location</strong>
                <span>{event.location}</span>
              </div>
              <div className="app-detail-item">
                <strong>Category</strong>
                <span>{event.category}</span>
              </div>
              <div className="app-detail-item">
                <strong>Audience</strong>
                <span>{event.visibility === "ku-only" ? "KU Students Only" : "Open to everyone"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="app-page-content-section">
        <div className="container app-detail-grid">
          <div className="card app-detail-card">
            <h3 className="card-header">About this event</h3>
            <p className="card-text">{event.description}</p>
          </div>

          <div className="card app-detail-card">
            <h3 className="card-header">Before you attend</h3>
            <p className="card-text">
              Review the date and location carefully, then contact the organizers if you need access details, schedule clarification, or support.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default EventDetails;
