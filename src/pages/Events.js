import { useContext, useMemo, useState } from "react";
import events from "../data/events";
import EventCard from "../components/EventCard";
import { AuthContext } from "../context/AuthContext";

function Events() {
  const { user } = useContext(AuthContext);
  const [search, setSearch] = useState("");

  const visibleEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesRole =
        event.visibility === "public" ||
        (event.visibility === "ku-only" && user?.role === "student");

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
    <div style={{ padding: "20px" }}>
      <h1>All Events</h1>
      <p>
        Showing {visibleEvents.length} events as <strong>{user?.role || "guest"}</strong>
      </p>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search events..."
        style={{ width: "100%", maxWidth: "400px", padding: "8px", margin: "10px 0" }}
      />
      {visibleEvents.length === 0 ? (
        <p>No events visible for your role. Login as KU Student to see KU-only events.</p>
      ) : (
        visibleEvents.map((event) => <EventCard key={event.id} event={event} />)
      )}
    </div>
  );
}

export default Events;