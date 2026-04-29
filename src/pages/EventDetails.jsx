import { useContext, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import events from "../data/events";
import { AuthContext } from "../context/AuthContext";
import { RegistrationContext } from "../context/RegistrationContext";
import { apiRequest } from "../utils/api";
import "../styles/AppPages.css";

const eventDetails = {
  1: "This AI Workshop gives KU students a practical introduction to machine learning models, data preparation, and real-world applications. Participants explore supervised and unsupervised techniques, build simple projects, and learn how AI can support campus research and innovation.",
  2: "The Cybersecurity Seminar covers essential online safety practices, network protection, and threat awareness. Students will learn how to recognize phishing, secure personal devices, and defend critical systems in a university setting.",
  3: "At the Research Expo, KU student teams showcase innovative projects across science, engineering, and humanities. Visitors can explore new discoveries, speak with researchers, and connect with mentors interested in continuing academic work.",
  4: "Advanced Robotics offers an exclusive laboratory tour and live demonstrations of autonomous systems. KU students will see cutting-edge robotics research in action and learn how engineering teams bring intelligent machines to life.",
  5: "The Entrepreneurship Bootcamp helps aspiring founders turn ideas into viable ventures. Participants work with mentors on business models, pitching, and growth strategies while building connections across KU's innovation ecosystem.",
  6: "Cultural Day celebrates the rich diversity of Kuwait University with performances, exhibitions, and cultural showcases from students and student organizations around campus.",
};

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

function EventDetails() {
  const { user } = useContext(AuthContext);
  const { registerUser, isUserRegistered, getAvailableSeats } = useContext(RegistrationContext);
  const { id } = useParams();
  const [registrationMessage, setRegistrationMessage] = useState("");

  const allEvents = useMemo(() => [...events, ...getOrganizerPublishedEvents()], []);
  const event = allEvents.find((item) => String(item.id) === id);
  const availableSeats = event ? getAvailableSeats(event.id, event.seats) : 0;
  const isRegistered = event && user?.id ? isUserRegistered(event.id, user.id) : false;
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

    if (event.isOrganizerCreated) {
      try {
        await apiRequest("/registrations", {
          method: "POST",
          body: JSON.stringify({ eventID: event.eventID || event.id }),
        });
      } catch (error) {
        setRegistrationMessage(error.message);
        return;
      }
    }

    registerUser(event.id, user.id, event.seats);
    setRegistrationMessage(`Successfully registered! ${availableSeats - 1} seats remaining`);
  };

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

  if (event.visibility === "ku-only" && !["student", "organizer"].includes(user?.role)) {
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
              className={`btn ${isRegistered || availableSeats === 0 ? "btn-secondary" : "btn-primary"}`}
              onClick={handleRegister}
              disabled={isRegistered || availableSeats === 0}
              style={{ width: "100%", marginTop: "20px" }}
            >
              {isRegistered ? "Already Registered" : availableSeats === 0 ? "Event Full" : "Register for Event"}
            </button>
            {registrationMessage && (
              <p style={{ marginTop: "12px", fontSize: "14px", color: registrationMessage.includes("Successfully") ? "#10b981" : "#ef4444", textAlign: "center" }}>
                {registrationMessage}
              </p>
            )}
          </div>
        </div>
      </section>

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
