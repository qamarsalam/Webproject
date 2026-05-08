import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../utils/api";
import "../styles/KUEvents.css";
import "../styles/AppPages.css";

function Admin() {
  const [organizerRequests, setOrganizerRequests] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [responseDraft, setResponseDraft] = useState("");
  const [filter, setFilter] = useState("all");
  const [messageLoadError, setMessageLoadError] = useState("");

  useEffect(() => {
    const requests = JSON.parse(localStorage.getItem("organizerRequests") || "[]");
    setOrganizerRequests(requests);
    loadContactMessages();
  }, []);

  async function loadContactMessages() {
    try {
      const data = await apiRequest("/contact");
      setContactMessages(data.messages);
      setMessageLoadError("");
    } catch (error) {
      setMessageLoadError(error.message);
    }
  }

  const updateRequestStatus = (id, newStatus) => {
    const updatedRequests = organizerRequests.map((request) =>
      request.id === id ? { ...request, status: newStatus } : request
    );
    setOrganizerRequests(updatedRequests);
    localStorage.setItem("organizerRequests", JSON.stringify(updatedRequests));
  };

  const approveOrganizerRequest = async (request) => {
    try {
      await apiRequest("/organizers/approve-request", {
        method: "POST",
        body: JSON.stringify({
          universityEmail: request.universityEmail,
          clubDepartment: request.clubDepartment,
          eventPurpose: request.eventPurpose,
        }),
      });
      updateRequestStatus(request.id, "Approved");
      setMessageLoadError("");
    } catch (error) {
      setMessageLoadError(error.message);
    }
  };

  const filteredRequests = organizerRequests.filter((request) => {
    if (filter === "all") return true;
    return request.status.toLowerCase() === filter;
  });

  const saveContactMessages = (updatedMessages) => {
    setContactMessages(updatedMessages);
  };

  const openMessage = (message) => {
    const openedMessage = {
      ...message,
      status: message.status === "UNREAD" ? "READ" : message.status,
    };
    const updatedMessages = contactMessages.map((currentMessage) =>
      currentMessage.id === message.id ? openedMessage : currentMessage
    );
    saveContactMessages(updatedMessages);
    setSelectedMessage(openedMessage);
    setResponseDraft(openedMessage.response || "");
  };

  const closeMessage = () => {
    setSelectedMessage(null);
    setResponseDraft("");
  };

  const submitMessageResponse = async () => {
    if (!responseDraft.trim() || !selectedMessage) return;

    try {
      const data = await apiRequest(`/contact/${selectedMessage.messageID || selectedMessage.id}/respond`, {
        method: "PUT",
        body: JSON.stringify({ response: responseDraft }),
      });
      const respondedMessage = data.contactMessage;
      const updatedMessages = contactMessages.map((message) =>
        message.id === selectedMessage.id ? respondedMessage : message
      );
      saveContactMessages(updatedMessages);
      setSelectedMessage(respondedMessage);
      setMessageLoadError("");
    } catch (error) {
      setMessageLoadError(error.message);
    }
  };

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

  const getMessageStatusColor = (status) => {
    switch (String(status).toUpperCase()) {
      case "UNREAD":
        return "#f59e0b";
      case "READ":
        return "#3b82f6";
      case "RESPONDED":
        return "#10b981";
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
              <div className="app-page-stat-card">
                <strong>{contactMessages.filter((message) => message.status === "UNREAD").length}</strong>
                <span>Unread messages</span>
              </div>
              <div className="app-page-stat-card">
                <strong>{contactMessages.filter((message) => message.status === "RESPONDED").length}</strong>
                <span>Responses sent</span>
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
                            onClick={() => approveOrganizerRequest(request)}
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

          <div className="admin-content">
            <div className="admin-section">
              <div className="section-header">
                <h2>Contact Messages</h2>
                <button type="button" className="btn btn-outline" onClick={loadContactMessages}>
                  Refresh
                </button>
              </div>
              {messageLoadError && <p className="error-message">{messageLoadError}</p>}

              {contactMessages.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">Inbox</div>
                  <h3>No contact messages yet</h3>
                  <p>Messages sent from the Contact page will appear here for admin review.</p>
                </div>
              ) : (
                <div className="requests-grid">
                  {contactMessages.map((message) => (
                    <div key={message.id} className="request-card">
                      <div className="request-header">
                        <div className="request-info">
                          <h3>{message.subject}</h3>
                          <p className="request-email">{message.name} - {message.email}</p>
                        </div>
                        <div
                          className="status-badge"
                          style={{
                            backgroundColor: getMessageStatusColor(message.status),
                          }}
                        >
                          {message.status}
                        </div>
                      </div>

                      <div className="request-details">
                        <div className="request-description">
                          <h4>Message:</h4>
                          <p>{message.message}</p>
                        </div>

                        <div className="request-meta">
                          <small>
                            Submitted: {new Date(message.submittedAt).toLocaleDateString()} at{" "}
                            {new Date(message.submittedAt).toLocaleTimeString()}
                          </small>
                        </div>
                      </div>

                      {message.response && (
                        <div className="request-description admin-response-preview">
                          <h4>Admin Response:</h4>
                          <p>{message.response}</p>
                        </div>
                      )}

                      <div className="request-actions">
                        <button
                          className="btn btn-primary"
                          onClick={() => openMessage(message)}
                        >
                          Open
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {selectedMessage && (
        <div className="registration-modal-backdrop" role="presentation">
          <div className="admin-message-modal" role="dialog" aria-modal="true" aria-labelledby="admin-message-title">
            <button
              type="button"
              className="registration-modal-close"
              aria-label="Close message"
              onClick={closeMessage}
            >
              X
            </button>

            <div className="admin-message-header">
              <span
                className="status-badge"
                style={{ backgroundColor: getMessageStatusColor(selectedMessage.status) }}
              >
                {selectedMessage.status}
              </span>
              <h2 id="admin-message-title">{selectedMessage.subject}</h2>
              <p>{selectedMessage.name} - {selectedMessage.email}</p>
              <small>
                Submitted: {new Date(selectedMessage.submittedAt).toLocaleDateString()} at{" "}
                {new Date(selectedMessage.submittedAt).toLocaleTimeString()}
              </small>
            </div>

            <div className="admin-message-body">
              <h3>User Message</h3>
              <p>{selectedMessage.message}</p>
            </div>

            {selectedMessage.response && (
              <div className="admin-message-response-saved">
                <h3>Saved Admin Response</h3>
                <p>{selectedMessage.response}</p>
                {selectedMessage.respondedAt && (
                  <small>
                    Sent: {new Date(selectedMessage.respondedAt).toLocaleDateString()} at{" "}
                    {new Date(selectedMessage.respondedAt).toLocaleTimeString()}
                  </small>
                )}
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="admin-response">
                Admin Response
              </label>
              <textarea
                id="admin-response"
                className="form-textarea"
                rows="5"
                placeholder="Write your response to this message..."
                value={responseDraft}
                onChange={(event) => setResponseDraft(event.target.value)}
              />
            </div>

            <div className="request-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={submitMessageResponse}
                disabled={!responseDraft.trim()}
              >
                Save Response
              </button>
              <button type="button" className="btn btn-outline" onClick={closeMessage}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
