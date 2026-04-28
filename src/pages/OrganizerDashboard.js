import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/KUEvents.css";
import "../styles/AppPages.css";

function OrganizerDashboard() {
  const { user } = useContext(AuthContext);
  const [organizerEvents, setOrganizerEvents] = useState([]);

  useEffect(() => {
    const events = JSON.parse(localStorage.getItem("organizerEvents") || "[]");
    setOrganizerEvents(events);
  }, []);

  const visibleOrganizerEvents = useMemo(() => {
    if (!user?.email && !user?.id) return [];
    return organizerEvents.filter(
      (event) => event.organizerEmail === user?.email || event.organizerId === user?.id
    );
  }, [organizerEvents, user]);

  const publishedCount = visibleOrganizerEvents.filter((event) => event.status === "Published").length;
  const totalRegistrations = visibleOrganizerEvents.reduce(
    (total, event) => total + Number(event.registrations || 0),
    0
  );

  const handleDeleteEvent = (eventId) => {
    const shouldDelete = window.confirm("Delete this event? This action cannot be undone.");

    if (!shouldDelete) return;

    const updatedEvents = organizerEvents.filter((event) => event.id !== eventId);
    setOrganizerEvents(updatedEvents);
    localStorage.setItem("organizerEvents", JSON.stringify(updatedEvents));
  };

  const navItems = [
    { label: "Home", icon: "HM", to: "/" },
    { label: "Create Event", icon: "+", to: "/create-event" },
    { label: "Browse Events", icon: "EV", to: "/events" },
    { label: "Attendance", icon: "AT" },
    { label: "Analytics", icon: "AN" },
    { label: "Settings", icon: "ST" },
  ];

  return (
    <div className="organizer-shell">
      <section className="organizer-dashboard-head">
        <div>
          <h1>Organizer Dashboard</h1>
          <p>Manage your events and track attendance</p>
        </div>
        <Link to="/create-event" className="organizer-create-button">
          <span>+</span>
          Create Event
        </Link>
      </section>

      <section className="organizer-stats-band">
        <span className="organizer-showing">Showing {visibleOrganizerEvents.length} events</span>
        <div className="organizer-stat-box">
          <span>Total Events</span>
          <strong>{visibleOrganizerEvents.length}</strong>
          <small>+2 this month</small>
        </div>
        <div className="organizer-stat-box">
          <span>Published</span>
          <strong>{publishedCount}</strong>
          <small>Active now</small>
        </div>
        <div className="organizer-stat-box">
          <span>Total Registrations</span>
          <strong>{totalRegistrations}</strong>
          <small>+120 this week</small>
        </div>
      </section>

      <section className="organizer-dashboard-layout">
        <aside className="organizer-sidebar">
          <div className="organizer-sidebar-brand">
            <span className="organizer-sidebar-logo">KU</span>
            <strong>KUEvents</strong>
          </div>

          <nav className="organizer-sidebar-nav" aria-label="Organizer dashboard navigation">
            {navItems.map((item, index) => {
              const content = (
                <>
                  <span className="organizer-sidebar-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </>
              );

              return item.to ? (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`organizer-sidebar-link${index === 0 ? " active" : ""}`}
                >
                  {content}
                </Link>
              ) : (
                <button
                  key={item.label}
                  type="button"
                  className={`organizer-sidebar-link${index === 0 ? " active" : ""}`}
                >
                  {content}
                </button>
              );
            })}
          </nav>

          <div className="organizer-sidebar-collapse">&lt;</div>
        </aside>

        <main className="organizer-dashboard-main">
          <h2>Your Events</h2>

          <div className="organizer-events-table" role="table" aria-label="Organizer events">
            <div className="organizer-events-row organizer-events-header" role="row">
              <div role="columnheader">Event</div>
              <div role="columnheader">Date</div>
              <div role="columnheader">Status</div>
              <div role="columnheader">Actions</div>
            </div>

            {visibleOrganizerEvents.length === 0 ? (
              <div className="organizer-events-empty">
                <p>No events yet. Press Create Event to publish your first organizer event.</p>
              </div>
            ) : (
              visibleOrganizerEvents.map((event) => (
                <div className="organizer-events-row" role="row" key={event.id}>
                  <div className="organizer-event-title-cell" role="cell">
                    {event.photo && <img src={event.photo} alt="" />}
                    <span>{event.title}</span>
                  </div>
                  <div role="cell">{event.date}</div>
                  <div role="cell">
                    <span className={`organizer-status-pill ${event.status === "Published" ? "published" : "draft"}`}>
                      {event.status}
                    </span>
                  </div>
                  <div className="organizer-action-cell" role="cell">
                    <Link
                      to={`/create-event/${event.id}/edit`}
                      className="organizer-action-button edit"
                      aria-label={`Edit ${event.title}`}
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="organizer-action-button delete"
                      aria-label={`Delete ${event.title}`}
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </section>
    </div>
  );
}

export default OrganizerDashboard;


