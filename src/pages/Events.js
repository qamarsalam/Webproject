import { useContext, useEffect, useMemo, useState } from "react";
import events from "../data/events";
import EventCard from "../components/EventCard";
import { AuthContext } from "../context/AuthContext";
import { apiRequest } from "../utils/api";
import cyberImage from "../images/cyber.png";
import researchImage from "../images/research.png";
import bootcampImage from "../images/Bootcamp.png";
import cultureImage from "../images/culture.png";
import roboticsImage from "../images/robotics.png";
import "../styles/AppPages.css";

const staticEventImages = {
  2: cyberImage,
  3: researchImage,
  4: roboticsImage,
  5: bootcampImage,
  6: cultureImage,
};

function toFrontendVisibility(visibility) {
  return String(visibility || "").toUpperCase() === "KU_ONLY" ? "ku-only" : "public";
}

function toDateDisplay(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function mapBackendEvent(event) {
  return {
    id: event.id || event.eventID,
    eventID: event.eventID || event.id,
    title: event.title,
    description: event.description,
    date: toDateDisplay(event.eventDate),
    location: event.location,
    visibility: toFrontendVisibility(event.visibility),
    category: event.category,
    image: event.posterURL || staticEventImages[event.eventID] || null,
    seats: event.capacityLimit || 100,
    registrations: event.registrationCount || event.registrations || 0,
    isDatabaseEvent: true,
  };
}

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

function getEventKey(event) {
  if (event.eventID || event.id) {
    return String(event.eventID || event.id);
  }

  return `${event.title}-${event.date}-${event.location}`.toLowerCase();
}

function getUniqueEvents(eventList) {
  const seenEvents = new Set();

  return eventList.filter((event) => {
    const eventKey = getEventKey(event);

    if (seenEvents.has(eventKey)) {
      return false;
    }

    seenEvents.add(eventKey);
    return true;
  });
}

function Events() {
  const { user } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [databaseEvents, setDatabaseEvents] = useState([]);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await apiRequest("/events?status=PUBLISHED");
        setDatabaseEvents(data.events.map(mapBackendEvent));
        setLoadError("");
      } catch (error) {
        setDatabaseEvents([]);
        setLoadError("Showing saved frontend events because the database events could not load.");
      }
    }

    loadEvents();
  }, []);

  const visibleEvents = useMemo(() => {
    const allEvents =
      databaseEvents.length > 0
        ? getUniqueEvents(databaseEvents)
        : getUniqueEvents([
            ...events.filter((event) => event.id),
            ...getOrganizerPublishedEvents(),
          ]);

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
  }, [user, search, databaseEvents]);

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
          {loadError && <p className="error-message">{loadError}</p>}
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
