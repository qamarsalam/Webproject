import { useContext, useMemo, useState } from "react";
import events from "../data/events";
import EventCard from "../components/EventCard";
import { AuthContext } from "../context/AuthContext";
import "../styles/AppPages.css";

function getOrganizerPublishedEvents() {
  const savedEvents = JSON.parse(localStorage.getItem("organizerEvents") || "[]");

  return savedEvents
    .filter((event) => event.status === "Published")
    .map((event) => ({
      id: event.id,
      eventID: event.eventID || event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
      visibility: event.visibility === "KU Only" ? "ku-only" : "public",
      category: event.category || "Organizer Event",
      image: event.photo || null,
      seats: Number(event.seats || 100),
      organizerName: event.organizerName,
      isOrganizerCreated: true,
    }));
}

function Events() {
  const { user } = useContext(AuthContext);
  const [search, setSearch] = useState("");

  const visibleEvents = useMemo(() => {
    const allEvents = [...events, ...getOrganizerPublishedEvents()];

    return allEvents.filter((event) => {
      const matchesRole =
        event.visibility === "public" ||
        (event.visibility === "ku-only" && ["student", "organizer"].includes(user?.role));

      if (!matchesRole) return false;

      if (!search) return true;
      return (
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.description.toLowerCase().includes(search.toLowerCase()) ||
        event.location.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [user, search]);

  return (
    <div className="app-page-shell">
      <section className="app-page-hero">
        <div className="container app-page-hero-grid">
          <div className="app-page-copy">
            <span className="badge badge-gold">Campus Discoveries</span>
            <h1 className="app-page-title">Explore events across Kuwait University.</h1>
            <p className="app-page-text">
              Browse public and campus-only activities, discover what matches your interests, and find your next event in one clean place.
            </p>
            <div className="app-page-stats">
              <div className="app-page-stat-card">
                <strong>{visibleEvents.length}</strong>
                <span>Visible events</span>
              </div>
              <div className="app-page-stat-card">
                <strong>{user?.role || "guest"}</strong>
                <span>Current access</span>
              </div>
            </div>
          </div>

          <div className="app-page-panel">
            <div className="app-page-panel-header">
              <span className="app-page-panel-kicker">Event search</span>
              <h2>Find the right event faster</h2>
              <p>Search by title, description, or location to narrow the list.</p>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="event-search">Search Events</label>
              <input
                id="event-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Try workshop, research, or auditorium"
                className="form-input"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="app-page-content-section">
        <div className="container">
          {visibleEvents.length === 0 ? (
            <div className="app-empty-state card">
              <h3 className="card-header">No events match your current access</h3>
              <p className="card-text">
                Login as a KU student or organizer to see KU-only events, or try a different search term.
              </p>
            </div>
          ) : (
            <div className="grid grid-3">
              {visibleEvents.map((event) => <EventCard key={event.id} event={event} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Events;
