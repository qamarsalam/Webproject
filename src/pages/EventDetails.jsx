import { useContext, useState } from "react";
import { Link, useParams } from "react-router-dom";
import events from "../data/events";
import { AuthContext } from "../context/AuthContext";
import { RegistrationContext } from "../context/RegistrationContext";
import "../styles/AppPages.css";

const eventDetails = {
  1: "This AI Workshop gives KU students a practical introduction to machine learning models, data preparation, and real-world applications. Participants explore supervised and unsupervised techniques, build simple projects, and learn how AI can support campus research and innovation.",
  2: "The Cybersecurity Seminar covers essential online safety practices, network protection, and threat awareness. Students will learn how to recognize phishing, secure personal devices, and defend critical systems in a university setting.",
  3: "At the Research Expo, KU student teams showcase innovative projects across science, engineering, and humanities. Visitors can explore new discoveries, speak with researchers, and connect with mentors interested in continuing academic work.",
  4: "Advanced Robotics offers an exclusive laboratory tour and live demonstrations of autonomous systems. KU students will see cutting-edge robotics research in action and learn how engineering teams bring intelligent machines to life.",
  5: "The Entrepreneurship Bootcamp helps aspiring founders turn ideas into viable ventures. Participants work with mentors on business models, pitching, and growth strategies while building connections across KU's innovation ecosystem.",
  6: "Cultural Day celebrates the rich diversity of Kuwait University with performances, exhibitions, and cultural showcases from students and student organizations around campus.",
};

function EventDetails() {
  const { user } = useContext(AuthContext);
  const { registerUser, isUserRegistered, getAvailableSeats } = useContext(RegistrationContext);
  const { id } = useParams();
  const [registrationMessage, setRegistrationMessage] = useState("");

  const event = events.find((item) => item.id === Number(id));
  const availableSeats = event ? getAvailableSeats(event.id, event.seats) : 0;
  const isRegistered = event && user?.id ? isUserRegistered(event.id, user.id) : false;

  const handleRegister = () => {
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

    registerUser(event.id, user.id, event.seats);
    setRegistrationMessage(`✓ Successfully registered! ${availableSeats - 1} seats remaining`);
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
            {event.image && (
              <div className="app-page-hero-image-wrap">
                <img src={event.image} alt={event.title} className="app-page-hero-image" />
              </div>
            )}
            <span className={`badge ${event.visibility === "ku-only" ? "badge-primary" : "badge-gold"}`}>
              {event.visibility === "ku-only" ? "KU Only" : "Public Event"}
            </span>
            <h1 className="app-page-title">{event.title}</h1>
            <p className="app-page-text">{eventDetails[event.id] || event.description}</p>
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
              {isRegistered ? "Already Registered ✓" : availableSeats === 0 ? "Event Full" : "Register for Event"}
            </button>
            {registrationMessage && (
              <p style={{ marginTop: "12px", fontSize: "14px", color: registrationMessage.includes("✓") ? "#10b981" : "#ef4444", textAlign: "center" }}>
                {registrationMessage}
              </p>
            )}
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
