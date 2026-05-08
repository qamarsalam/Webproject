import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import events from "../data/events";
import { AuthContext } from "../context/AuthContext";
import { RegistrationContext } from "../context/RegistrationContext";
import { apiRequest } from "../utils/api";
import cyberImage from "../images/cyber.png";
import researchImage from "../images/research.png";
import bootcampImage from "../images/Bootcamp.png";
import cultureImage from "../images/culture.png";
import roboticsImage from "../images/robotics.png";
import campusImage from "../images/download.jpg";
import programmingImage from "../images/programming.png";
import "../styles/AppPages.css";

const staticEventImages = {
  2: cyberImage,
  3: bootcampImage,
  4: programmingImage,
  5: researchImage,
  6: cultureImage,
  7: campusImage,
  8: roboticsImage,
};

const eventDetails = {
  1: "This AI Workshop gives KU students a practical introduction to machine learning models, data preparation, and real-world applications. Participants explore supervised and unsupervised techniques, build simple projects, and learn how AI can support campus research and innovation.",
  2: "The Cybersecurity Seminar covers essential online safety practices, network protection, and threat awareness. Students will learn how to recognize phishing, secure personal devices, and defend critical systems in a university setting.",
  3: "The Web Development Bootcamp gives KU students hands-on practice with React components, routing, and API integration. Participants build practical frontend features and connect them with backend services.",
  4: "The Programming Contest is a team-based academic challenge where KU students solve algorithmic problems, practice coding under time limits, and strengthen problem-solving skills.",
  5: "The Research Poster Exhibition allows students to present research posters from engineering and science departments. Attendees can explore student work, discuss findings, and connect with faculty mentors.",
  6: "Cultural Day celebrates the rich diversity of Kuwait University with performances, exhibitions, and cultural showcases from students and student organizations around campus.",
  7: "The Career Readiness Seminar helps students prepare for future opportunities through resume guidance, interview preparation, and professional development advice.",
  8: "The Robotics Demonstration showcases robotics projects and lab demonstrations, giving students a closer look at practical engineering and automation work.",
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
    organizerID: event.organizerID,
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

function getDescriptionPreview(description) {
  if (!description) return "";
  const cleanDescription = description.trim();

  if (cleanDescription.length <= 180) return cleanDescription;
  return `${cleanDescription.slice(0, 180).trim()}...`;
}

function updateRegistrationCount(event, amount) {
  if (!event) return event;

  return {
    ...event,
    registrations: Math.max(0, (event.registrations || 0) + amount),
  };
}

function EventDetails() {
  const { user } = useContext(AuthContext);
  const { registerUser, unregisterUser, isUserRegistered, getAvailableSeats } = useContext(RegistrationContext);
  const { id } = useParams();
  const [databaseEvent, setDatabaseEvent] = useState(null);
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);
  const [registrationMessage, setRegistrationMessage] = useState("");
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registeredEventIds, setRegisteredEventIds] = useState([]);

  useEffect(() => {
    async function loadEvent() {
      setIsLoadingEvent(true);

      try {
        const data = await apiRequest(`/events/${id}`);
        setDatabaseEvent(mapBackendEvent(data.event));
      } catch (error) {
        setDatabaseEvent(null);
      } finally {
        setIsLoadingEvent(false);
      }
    }

    loadEvent();
  }, [id]);

  useEffect(() => {
    async function loadMyRegistrations() {
      if (!user?.id) {
        setRegisteredEventIds([]);
        return;
      }

      try {
        const data = await apiRequest("/registrations/my");
        setRegisteredEventIds(
          data.registrations
            .filter((registration) => registration.registrationStatus === "REGISTERED")
            .map((registration) => Number(registration.eventID))
        );
      } catch (error) {
        setRegisteredEventIds([]);
      }
    }

    loadMyRegistrations();
  }, [user?.id]);

  const allEvents = useMemo(() => {
    if (databaseEvent) return [databaseEvent];
    return [...events.filter((item) => item.id), ...getOrganizerPublishedEvents()];
  }, [databaseEvent]);

  const event = allEvents.find((item) => String(item.id) === id);
  const backendAvailableSeats = event ? Math.max(0, event.seats - (event.registrations || 0)) : 0;
  const availableSeats = event ? getAvailableSeats(event.id, backendAvailableSeats) : 0;
  const isRegistered =
    event && user?.id
      ? isUserRegistered(event.id, user.id) || registeredEventIds.includes(Number(event.eventID || event.id))
      : false;
  const fullDescription = event ? eventDetails[event.id] || event.description : "";
  const descriptionParagraphs = fullDescription
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const handleRegister = async () => {
    if (!user || !user.id) {
      setRegistrationMessage("Please log in to register for this event");
      return;
    }

    if (isRegistered) {
      setRegistrationMessage("You are already registered for this event");
      return;
    }

    if (availableSeats <= 0) {
      setRegistrationMessage("Sorry, this event is full");
      return;
    }

    if (event.isDatabaseEvent || event.isOrganizerCreated) {
      try {
        await apiRequest("/registrations", {
          method: "POST",
          body: JSON.stringify({ eventID: event.eventID || event.id }),
        });
        setDatabaseEvent((currentEvent) => updateRegistrationCount(currentEvent, 1));
        setRegisteredEventIds((currentIds) => [...new Set([...currentIds, Number(event.eventID || event.id)])]);
      } catch (error) {
        setRegistrationMessage(error.message);
        return;
      }
    }

    registerUser(event.id, user.id, event.seats);
    setShowRegistrationModal(true);
    setRegistrationMessage(`Successfully registered! ${availableSeats - 1} seats remaining`);
  };

  const handleCancelRegistration = async () => {
    if (!user || !user.id) {
      setRegistrationMessage("Please log in to cancel your registration");
      return;
    }

    if (!isRegistered) {
      setRegistrationMessage("You are not registered for this event");
      return;
    }

    if (event.isDatabaseEvent || event.isOrganizerCreated) {
      try {
        await apiRequest(`/registrations/event/${event.eventID || event.id}/my`, {
          method: "DELETE",
        });
        setDatabaseEvent((currentEvent) => updateRegistrationCount(currentEvent, -1));
        setRegisteredEventIds((currentIds) =>
          currentIds.filter((eventId) => eventId !== Number(event.eventID || event.id))
        );
      } catch (error) {
        setRegistrationMessage(error.message);
        return;
      }
    }

    unregisterUser(event.id, user.id);
    setRegistrationMessage(`Registration cancelled. ${availableSeats + 1} seats available`);
  };

  const handleRegistrationButtonClick = () => {
    if (isRegistered) {
      handleCancelRegistration();
      return;
    }

    handleRegister();
  };

  const isSuccessMessage =
    registrationMessage.includes("Successfully") ||
    registrationMessage.includes("cancelled");

  if (isLoadingEvent) {
    return (
      <div className="app-page-shell">
        <div className="container app-page-simple-state">
          <div className="app-empty-state card">
            <h2 className="card-header">Loading event...</h2>
          </div>
        </div>
      </div>
    );
  }

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

  if (event.visibility === "ku-only" && !["student", "organizer", "admin"].includes(user?.role)) {
    return (
      <div className="app-page-shell">
        <div className="container app-page-simple-state">
          <div className="app-empty-state card">
            <h2 className="card-header">This event is restricted to KU students and organizers</h2>
            <p className="card-text">Sign in with a student or organizer account to view full details for campus-only events.</p>
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
            {event.image ? (
              <div className="app-page-hero-image-wrap">
                <img src={event.image} alt={event.title} className="app-page-hero-image" />
              </div>
            ) : (
              <div className="app-page-hero-placeholder">
                <span>{event.category}</span>
              </div>
            )}
            <span className={`badge ${event.visibility === "ku-only" ? "badge-primary" : "badge-gold"}`}>
              {event.visibility === "ku-only" ? "KU Only" : "Public Event"}
            </span>
            <h1 className="app-page-title">{event.title}</h1>
            <p className="app-page-text">{getDescriptionPreview(fullDescription)}</p>
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
              {event.organizerName && (
                <div className="app-detail-item">
                  <strong>Organizer</strong>
                  <span>{event.organizerName}</span>
                </div>
              )}
              <div className="app-detail-item">
                <strong>Audience</strong>
                <span>{event.visibility === "ku-only" ? "KU Students Only" : "Open to everyone"}</span>
              </div>
              <div className="app-detail-item">
                <strong>Available Seats</strong>
                <span>{availableSeats} {availableSeats === 1 ? "spot" : "spots"} left</span>
              </div>
            </div>
            <button
              className={`btn ${isRegistered ? "btn-danger" : availableSeats === 0 ? "btn-secondary" : "btn-primary"}`}
              onClick={handleRegistrationButtonClick}
              disabled={!isRegistered && availableSeats === 0}
              style={{ width: "100%", marginTop: "20px" }}
            >
              {isRegistered ? "Cancel Registration" : availableSeats === 0 ? "Event Full" : "Register for Event"}
            </button>
            {registrationMessage && (
              <p style={{ marginTop: "12px", fontSize: "14px", color: isSuccessMessage ? "#10b981" : "#ef4444", textAlign: "center" }}>
                {registrationMessage}
              </p>
            )}
          </div>
        </div>
      </section>

      {showRegistrationModal && (
        <div className="registration-modal-backdrop" role="presentation">
          <div className="registration-modal" role="dialog" aria-modal="true" aria-labelledby="registration-modal-title">
            <button
              type="button"
              className="registration-modal-close"
              aria-label="Close registration confirmation"
              onClick={() => setShowRegistrationModal(false)}
            >
              x
            </button>
            <div className="registration-modal-icon">✓</div>
            <h2 id="registration-modal-title">Registered Successfully</h2>
            <p>You are now registered for this event.</p>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setShowRegistrationModal(false)}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      <section className="app-page-content-section">
        <div className="container app-detail-grid">
          <div className="card app-detail-card app-detail-card-wide-text">
            <h3 className="card-header">About this event</h3>
            <div className="app-detail-long-text">
              {descriptionParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
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
