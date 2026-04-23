import { useContext } from "react";
import { useParams } from "react-router-dom";
import events from "../data/events";
import { AuthContext } from "../context/AuthContext";

function EventDetails() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const event = events.find((e) => e.id === Number(id));

  if (!event) {
    return <h2>Event not found</h2>;
  }

  if (event.visibility === "ku-only" && user?.role !== "student") {
    return <h2>This event is restricted to KU students.</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>{event.title}</h1>
      <p>{event.description}</p>
      <p><strong>Date:</strong> {event.date}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Visibility:</strong> {event.visibility === "ku-only" ? "KU Only" : "Public"}</p>
    </div>
  );
}

export default EventDetails;