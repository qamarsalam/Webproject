import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import EventCard from "../components/EventCard";
import events from "../data/events";
import { AuthContext } from "../context/AuthContext";
import { apiRequest } from "../utils/api";
import cyberImage from "../images/cyber.png";
import researchImage from "../images/research.png";
import bootcampImage from "../images/Bootcamp.png";
import cultureImage from "../images/culture.png";
import roboticsImage from "../images/robotics.png";
import campusImage from "../images/download.jpg";
import heroImage from "../images/KUlogo.png";
import "../styles/KUEvents.css";
import "../styles/Home.css";

const staticEventImages = {
  2: cyberImage,
  3: bootcampImage,
  5: researchImage,
  6: cultureImage,
  7: campusImage,
  8: roboticsImage,
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

function Home() {
  const { user } = useContext(AuthContext);
  const [databaseEvents, setDatabaseEvents] = useState([]);

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await apiRequest("/events?status=PUBLISHED");
        setDatabaseEvents(data.events.map(mapBackendEvent));
      } catch (error) {
        setDatabaseEvents([]);
      }
    }

    loadEvents();
  }, []);

  const visibleEvents = useMemo(() => {
    const allEvents = databaseEvents.length > 0 ? databaseEvents : [...events, ...getOrganizerPublishedEvents()];
    return allEvents.filter((event) => {
      if (event.visibility === "public") return true;
      if (event.visibility === "ku-only" && ["student", "organizer", "admin"].includes(user?.role)) return true;
      return false;
    });
  }, [user, databaseEvents]);

  const categories = [
  { id: 1, name: "🎓", title: "Academic" },
  { id: 2, name: "🔬", title: "Research" },
  { id: 3, name: "💼", title: "Workshop" },
  { id: 4, name: "🎤", title: "Seminar" },
];

  return (
    <div className="home">
      {/* Hero Section */}
      <section
        className="section hero"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Discover • Join • Enjoy</h1>
            <p className="hero-subtitle">
              Official Kuwait University Event Hub — your platform for discovering, managing, and participating in campus events.
            </p>
            <div className="hero-buttons">
              <Link to="/events" className="btn btn-primary">
                Browse All Events
              </Link>
              <Link to="/create-event" className="btn btn-secondary">
                Organize an Event
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">150+</div>
              <div className="stat-label">Events This Year</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">5000+</div>
              <div className="stat-label">Active Students</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">50+</div>
              <div className="stat-label">Organizers</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">100%</div>
              <div className="stat-label">Student Approval</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section categories-section">
        <div className="container">
          <h2 className="section-title">Explore Categories</h2>
          <p className="section-subtitle">Find events that match your interests</p>

          <div className="grid grid-4">
            {categories.map((category) => (
              <div key={category.id} className="category-card card">
                <div className="category-icon">{category.name}</div>
                <h3 className="card-header">{category.title}</h3>
                <p className="card-text">{category.count} events available</p>
                <Link to="/events" className="category-link">
                  Browse →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="section featured-section">
        <div className="container">
          <h2 className="section-title">Featured Events</h2>
          <p className="section-subtitle">Don't miss these upcoming university events</p>

          <div className="grid grid-3">
            {visibleEvents.slice(0, 3).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <div className="text-center mt-40">
            <Link to="/events" className="btn btn-primary">
              View All Events →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Connect?</h2>
            <p className="cta-text">
              Join Kuwait University's vibrant event community and make the most of your student experience
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary">
                Create Your Account
              </Link>
              <Link to="/events" className="btn btn-outline">
                Explore Events First
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section features-section">
        <div className="container">
          <h2 className="section-title">Why KUEvents?</h2>
          <p className="section-subtitle">The ultimate platform for university events</p>

          <div className="grid grid-3">
            <div className="feature-card card">
              <div className="feature-icon">📱</div>
              <h3 className="card-header">Easy Management</h3>
              <p className="card-text">
                Simple interface to discover, register, and manage all your university events in one place
              </p>
            </div>
            <div className="feature-card card">
              <div className="feature-icon">🔒</div>
              <h3 className="card-header">Secure Platform</h3>
              <p className="card-text">
                Your information is protected with university-grade security for peace of mind
              </p>
            </div>
            <div className="feature-card card">
              <div className="feature-icon">🌟</div>
              <h3 className="card-header">Community Focused</h3>
              <p className="card-text">
                Connect with fellow students and build lasting relationships through shared experiences
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
    </div>
  );
}

export default Home;



