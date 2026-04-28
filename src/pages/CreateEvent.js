import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/InfoPages.css";

const initialFormData = {
  title: "",
  description: "",
  date: "",
  location: "",
  category: "Workshop",
  visibility: "Public",
  seats: "",
};

function CreateEvent() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [eventPhoto, setEventPhoto] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [editingEvent, setEditingEvent] = useState(null);

  const isOrganizer = user?.role === "organizer";
  const isEditMode = Boolean(eventId);

  useEffect(() => {
    if (!eventId) {
      setFormData(initialFormData);
      setEventPhoto(null);
      setEditingEvent(null);
      return;
    }

    const existingEvents = JSON.parse(localStorage.getItem("organizerEvents") || "[]");
    const eventToEdit = existingEvents.find((event) => String(event.id) === String(eventId));

    if (!eventToEdit) return;

    setEditingEvent(eventToEdit);
    setFormData({
      title: eventToEdit.title || "",
      description: eventToEdit.description || "",
      date: eventToEdit.date || "",
      location: eventToEdit.location || "",
      category: eventToEdit.category || "Workshop",
      visibility: eventToEdit.visibility || "Public",
      seats: eventToEdit.seats || "",
    });

    if (eventToEdit.photo) {
      setEventPhoto({
        name: eventToEdit.photoName || "Current event photo",
        preview: eventToEdit.photo,
      });
    }
  }, [eventId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setEventPhoto(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setEventPhoto({
        name: file.name,
        preview: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setEventPhoto(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Event title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.date) newErrors.date = "Event date is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.seats) newErrors.seats = "Number of attendees is required";
    if (formData.seats && Number(formData.seats) < 1) newErrors.seats = "Attendees must be at least 1";
    return newErrors;
  };

  const saveEvent = (status) => {
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const existingEvents = JSON.parse(localStorage.getItem("organizerEvents") || "[]");

    if (isEditMode && editingEvent) {
      const updatedEvents = existingEvents.map((event) =>
        String(event.id) === String(eventId)
          ? {
              ...event,
              ...formData,
              seats: Number(formData.seats),
              status,
              photo: eventPhoto?.preview || null,
              photoName: eventPhoto?.name || null,
              updatedAt: new Date().toISOString(),
            }
          : event
      );

      localStorage.setItem("organizerEvents", JSON.stringify(updatedEvents));
      navigate("/organizer-dashboard");
      return;
    }

    const newEvent = {
      id: Date.now(),
      ...formData,
      seats: Number(formData.seats),
      status,
      organizerId: user?.id,
      organizerEmail: user?.email,
      organizerName: user?.name,
      photo: eventPhoto?.preview || null,
      photoName: eventPhoto?.name || null,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("organizerEvents", JSON.stringify([newEvent, ...existingEvents]));
    navigate("/organizer-dashboard");
  };

  if (!isOrganizer) {
    return (
      <div className="info-page-shell">
        <section className="info-page-hero info-page-hero-create">
          <div className="container info-page-hero-grid">
            <div className="info-page-copy">
              <span className="badge badge-gold">Organizer Access</span>
              <h1 className="info-page-title">Sign in as an organizer to create events.</h1>
              <p className="info-page-text">
                Event creation is available only for approved organizers. For now, organizer requests are approved directly so you can test the flow.
              </p>
              <div className="app-page-actions">
                <Link to="/login" className="btn btn-primary">Login as Organizer</Link>
                <Link to="/organizer-request" className="btn btn-outline">Request Organizer Access</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="info-page-shell">
      <section className="info-page-hero info-page-hero-create">
        <div className="container info-page-hero-grid">
          <div className="info-page-copy">
            <span className="badge badge-gold">Organizer Studio</span>
            <h1 className="info-page-title">{isEditMode ? "Edit your event details." : "Create an event that feels worth showing up for."}</h1>
            <p className="info-page-text">
              Build a polished KUEvents listing with clear details, the right audience, and a strong first impression for students and faculty.
            </p>
            <div className="info-page-highlights">
              <div className="info-page-highlight-card">
                <strong>Smart visibility</strong>
                <span>Choose between campus-wide promotion and KU-only access.</span>
              </div>
              <div className="info-page-highlight-card">
                <strong>Clean details</strong>
                <span>Keep your event title, timing, and location easy to scan.</span>
              </div>
            </div>
          </div>

          <div className="info-page-panel info-page-panel-accent">
            <div className="info-page-panel-header">
              <span className="info-page-panel-kicker">{isEditMode ? "Edit event" : "Event draft"}</span>
              <h2>{isEditMode ? "Update and republish" : "Publish in a few steps"}</h2>
              <p>Complete the form below to prepare your event for the KUEvents community.</p>
            </div>

            <form className="info-page-form" onSubmit={(event) => event.preventDefault()}>
              <div className="form-group">
                <label className="form-label" htmlFor="event-title">Event Title</label>
                <input
                  id="event-title"
                  name="title"
                  className={`form-input ${errors.title ? "input-error" : ""}`}
                  placeholder="Ex: AI in Student Research Summit"
                  value={formData.title}
                  onChange={handleChange}
                />
                {errors.title && <span className="error-message">{errors.title}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="event-description">Description</label>
                <textarea
                  id="event-description"
                  name="description"
                  className={`form-textarea ${errors.description ? "input-error" : ""}`}
                  placeholder="Tell attendees what the event is about, who it is for, and what they can expect."
                  rows="5"
                  value={formData.description}
                  onChange={handleChange}
                />
                {errors.description && <span className="error-message">{errors.description}</span>}
              </div>

              <div className="info-page-form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="event-date">Event Date</label>
                  <input
                    id="event-date"
                    name="date"
                    type="date"
                    className={`form-input ${errors.date ? "input-error" : ""}`}
                    value={formData.date}
                    onChange={handleChange}
                  />
                  {errors.date && <span className="error-message">{errors.date}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="event-location">Location</label>
                  <input
                    id="event-location"
                    name="location"
                    className={`form-input ${errors.location ? "input-error" : ""}`}
                    placeholder="Campus hall, auditorium, or online"
                    value={formData.location}
                    onChange={handleChange}
                  />
                  {errors.location && <span className="error-message">{errors.location}</span>}
                </div>
              </div>

              <div className="info-page-form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="event-category">Category</label>
                  <select
                    id="event-category"
                    name="category"
                    className={`form-select ${errors.category ? "input-error" : ""}`}
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option>Academic</option>
                    <option>Research</option>
                    <option>Workshop</option>
                    <option>Seminar</option>
                    <option>Culture</option>
                    <option>Sports</option>
                    <option>Organizer Event</option>
                  </select>
                  {errors.category && <span className="error-message">{errors.category}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="event-visibility">Audience</label>
                  <select
                    id="event-visibility"
                    name="visibility"
                    className="form-select"
                    value={formData.visibility}
                    onChange={handleChange}
                  >
                    <option>Public</option>
                    <option>KU Only</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="event-seats">Number of Attendees</label>
                <input
                  id="event-seats"
                  name="seats"
                  type="number"
                  min="1"
                  className={`form-input ${errors.seats ? "input-error" : ""}`}
                  placeholder="Ex: 100"
                  value={formData.seats}
                  onChange={handleChange}
                />
                {errors.seats && <span className="error-message">{errors.seats}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="event-photo">Event Photo Optional</label>
                <div className="event-photo-upload">
                  <input
                    id="event-photo"
                    type="file"
                    accept="image/*"
                    className="event-photo-input"
                    onChange={handlePhotoChange}
                  />
                  <label className="event-photo-dropzone" htmlFor="event-photo">
                    <span className="event-photo-title">Upload event poster or photo</span>
                    <span className="event-photo-text">PNG, JPG, or JPEG. This can help attendees recognize the event faster.</span>
                  </label>
                </div>

                {eventPhoto && (
                  <div className="event-photo-preview">
                    <img src={eventPhoto.preview} alt="Selected event preview" />
                    <div className="event-photo-preview-info">
                      <strong>{eventPhoto.name}</strong>
                      <button type="button" className="btn btn-outline btn-sm" onClick={removePhoto}>
                        Remove Photo
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="info-page-form-actions">
                <button type="button" className="btn btn-outline" onClick={() => saveEvent("Draft")}>Save Draft</button>
                <button type="button" className="btn btn-primary" onClick={() => saveEvent("Published")}>Publish Event</button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="info-page-support">
        <div className="container info-page-support-grid">
          <div className="info-page-support-card card">
            <h3 className="card-header">What makes a strong event page?</h3>
            <p className="card-text">
              A concise title, a useful description, and a clear location make it much easier for attendees to trust the event and register.
            </p>
          </div>

          <div className="info-page-support-card card">
            <h3 className="card-header">Recommended checklist</h3>
            <p className="card-text">
              Confirm your date, explain the agenda, mention the target audience, and choose the correct visibility before publishing.
            </p>
          </div>

          <div className="info-page-support-card card">
            <h3 className="card-header">Organizer tip</h3>
            <p className="card-text">
              Use KU-only visibility for internal academic activities and public visibility for broader campus engagement.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CreateEvent;

