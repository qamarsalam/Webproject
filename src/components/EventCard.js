import { Link } from "react-router-dom";
import "../styles/EventCard.css";

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 21s7-5.2 7-11a7 7 0 0 0-14 0c0 5.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function AttendeesIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M3.5 19c.8-3.1 2.9-5 5.5-5s4.7 1.9 5.5 5" />
      <path d="M14.5 15.2c2.4.2 4.3 1.5 5 3.8" />
    </svg>
  );
}

function EventCard({ event }) {
  const visibilityLabel = event.visibility === "ku-only" ? "KU only" : "Public";
  const visibilityBadgeClass = event.visibility === "ku-only" ? "badge-primary" : "badge-gold";
  const attendingCount = event.attendees || event.registrations || event.attending || 30;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDescriptionPreview = (description) => {
    if (!description) return "";
    const cleanDescription = description.trim();

    if (cleanDescription.length <= 140) return cleanDescription;
    return `${cleanDescription.slice(0, 140).trim()}...`;
  };

  return (
    <div className="event-card card">
      {event.image && (
        <div className="event-card-image-wrap">
          <img
            src={event.image}
            alt={event.title}
            className="event-card-image"
          />
        </div>
      )}

      <div className="event-header">
        <h3 className="event-title">{event.title}</h3>
        <span className={`badge ${visibilityBadgeClass}`}>{visibilityLabel}</span>
      </div>

      <p className="event-description">{getDescriptionPreview(event.description)}</p>

      <div className="event-meta">
        <div className="meta-item">
          <span className="meta-icon" aria-label="Date"><CalendarIcon /></span>
          <span className="meta-text">{formatDate(event.date)}</span>
        </div>
        <div className="meta-item">
          <span className="meta-icon" aria-label="Location"><LocationIcon /></span>
          <span className="meta-text">{event.location}</span>
        </div>
        <div className="meta-item">
          <span className="meta-icon" aria-label="Attendees"><AttendeesIcon /></span>
          <span className="meta-text">{attendingCount} Attending</span>
        </div>
      </div>

      <div className="event-category">
        <span className="badge badge-primary">{event.category}</span>
      </div>

      <Link to={`/events/${event.id}`} className="btn btn-primary btn-sm event-btn">
        View Details
      </Link>
    </div>
  );
}

export default EventCard;
