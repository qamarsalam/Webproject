import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/KUEvents.css";
import "../styles/AppPages.css";

function Admin() {
  const [organizerRequests, setOrganizerRequests] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const requests = JSON.parse(localStorage.getItem("organizerRequests") || "[]");
    setOrganizerRequests(requests);
  }, []);

  const updateRequestStatus = (id, newStatus) => {
    const updatedRequests = organizerRequests.map((request) =>
      request.id === id ? { ...request, status: newStatus } : request
    );
    setOrganizerRequests(updatedRequests);
    localStorage.setItem("organizerRequests", JSON.stringify(updatedRequests));
  };

  const filteredRequests = organizerRequests.filter((request) => {
    if (filter === "all") return true;
    return request.status.toLowerCase() === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#f59e0b";
      case "Approved":
        return "#10b981";
      case "Rejected":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className="app-page-shell">
      <section className="app-page-hero">
        <div className="container app-page-hero-grid">
          <div className="app-page-copy">
            <span className="badge badge-primary">Admin Center</span>
            <h1 className="app-page-title">Review organizer requests with a cleaner dashboard.</h1>
            <p className="app-page-text">
              Monitor submissions, filter by status, and approve or reject requests from one consistent workspace.
            </p>
            <div className="app-page-stats">
              <div className="app-page-stat-card">
                <strong>{organizerRequests.length}</strong>
                <span>Total requests</span>
              </div>
              <div className="app-page-stat-card">
                <strong>{organizerRequests.filter((request) => request.status === "Pending").length}</strong>
                <span>Pending review</span>
              </div>
            </div>
          </div>

          <div className="app-page-panel">
            <div className="app-page-panel-header">
              <span className="app-page-panel-kicker">Quick access</span>
              <h2>Management actions</h2>
              <p>Use filters to focus on the requests that need attention right now.</p>
            </div>
            <Link to="/" className="btn btn-outline">
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      <section className="app-page-content-section">
        <div className="container">
          <div className="admin-content">
            <div className="admin-section">
              <div className="section-header">
                <h2>Organizer Requests</h2>
                <div className="filter-buttons">
                  <button
                    className={`btn ${filter === "all" ? "btn-primary" : "btn-outline"}`}
                    onClick={() => setFilter("all")}
                  >
                    All ({organizerRequests.length})
                  </button>
                  <button
                    className={`btn ${filter === "pending" ? "btn-primary" : "btn-outline"}`}
                    onClick={() => setFilter("pending")}
                  >
                    Pending ({organizerRequests.filter((request) => request.status === "Pending").length})
                  </button>
                  <button
                    className={`btn ${filter === "approved" ? "btn-primary" : "btn-outline"}`}
                    onClick={() => setFilter("approved")}
                  >
                    Approved ({organizerRequests.filter((request) => request.status === "Approved").length})
                  </button>
                  <button
                    className={`btn ${filter === "rejected" ? "btn-primary" : "btn-outline"}`}
                    onClick={() => setFilter("rejected")}
                  >
                    Rejected ({organizerRequests.filter((request) => request.status === "Rejected").length})
                  </button>
                </div>
              </div>

              {filteredRequests.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">Pending</div>
                  <h3>No organizer requests found</h3>
                  <p>
                    {filter === "all"
                      ? "No organizer requests have been submitted yet."
                      : `No ${filter} organizer requests found.`}
                  </p>
                </div>
              ) : (
                <div className="requests-grid">
                  {filteredRequests.map((request) => (
                    <div key={request.id} className="request-card">
                      <div className="request-header">
                        <div className="request-info">
                          <h3>{request.firstName} {request.lastName}</h3>
                          <p className="request-email">{request.universityEmail}</p>
                          <p className="request-club">{request.clubDepartment}</p>
                        </div>
                        <div
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(request.status) }}
                        >
                          {request.status}
                        </div>
                      </div>

                      <div className="request-details">
                        <div className="request-description">
                          <h4>Event Purpose & Description:</h4>
                          <p>{request.eventPurpose}</p>
                        </div>

                        <div className="request-meta">
                          <small>
                            Submitted: {new Date(request.submittedAt).toLocaleDateString()} at{" "}
                            {new Date(request.submittedAt).toLocaleTimeString()}
                          </small>
                        </div>
                      </div>

                      {request.status === "Pending" && (
                        <div className="request-actions">
                          <button
                            className="btn btn-success"
                            onClick={() => updateRequestStatus(request.id, "Approved")}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => updateRequestStatus(request.id, "Rejected")}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Admin;
