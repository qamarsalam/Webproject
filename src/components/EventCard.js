import { Link } from "react-router-dom";
import "../styles/EventCard.css";

function EventCard({ event }) {
  const visibilityLabel = event.visibility === "ku-only" ? "🔒 KU Only" : "🌐 Public";
  const visibilityBadgeClass = event.visibility === "ku-only" ? "badge-primary" : "badge-gold";

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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

      <p className="event-description">{event.description}</p>

      <div className="event-meta">
        <div className="meta-item">
          <span className="meta-icon">📅</span>
          <span className="meta-text">{formatDate(event.date)}</span>
        </div>
        <div className="meta-item">
          <span className="meta-icon">📍</span>
          <span className="meta-text">{event.location}</span>
        </div>
      </div>

      <div className="event-category">
        <span className="badge badge-primary">{event.category}</span>
      </div>

      <Link to={`/events/${event.id}`} className="btn btn-primary btn-sm event-btn">
        View Details →
      </Link>
    </div>
  );
}

export default EventCard;