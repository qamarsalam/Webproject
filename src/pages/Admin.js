import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/KUEvents.css";

function Admin() {
    const [organizerRequests, setOrganizerRequests] = useState([]);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        // Load organizer requests from localStorage
        const requests = JSON.parse(localStorage.getItem("organizerRequests") || "[]");
        setOrganizerRequests(requests);
    }, []);

    const updateRequestStatus = (id, newStatus) => {
        const updatedRequests = organizerRequests.map(request =>
            request.id === id ? { ...request, status: newStatus } : request
        );
        setOrganizerRequests(updatedRequests);
        localStorage.setItem("organizerRequests", JSON.stringify(updatedRequests));
    };

    const filteredRequests = organizerRequests.filter(request => {
        if (filter === "all") return true;
        return request.status.toLowerCase() === filter;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case "Pending": return "#f59e0b";
            case "Approved": return "#10b981";
            case "Rejected": return "#ef4444";
            default: return "#6b7280";
        }
    };

    return (
        <div className="page-container">
            <div className="container">
                <div className="page-header">
                    <h1>Admin Dashboard</h1>
                    <p>Manage organizer requests and system settings</p>
                </div>

                <div className="admin-content">
                    <div className="admin-nav">
                        <Link to="/" className="btn btn-outline">
                            ← Back to Home
                        </Link>
                    </div>

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
                                    Pending ({organizerRequests.filter(r => r.status === "Pending").length})
                                </button>
                                <button
                                    className={`btn ${filter === "approved" ? "btn-primary" : "btn-outline"}`}
                                    onClick={() => setFilter("approved")}
                                >
                                    Approved ({organizerRequests.filter(r => r.status === "Approved").length})
                                </button>
                                <button
                                    className={`btn ${filter === "rejected" ? "btn-primary" : "btn-outline"}`}
                                    onClick={() => setFilter("rejected")}
                                >
                                    Rejected ({organizerRequests.filter(r => r.status === "Rejected").length})
                                </button>
                            </div>
                        </div>

                        {filteredRequests.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">📋</div>
                                <h3>No organizer requests found</h3>
                                <p>
                                    {filter === "all"
                                        ? "No organizer requests have been submitted yet."
                                        : `No ${filter} organizer requests found.`
                                    }
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
                                                    ✅ Approve
                                                </button>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => updateRequestStatus(request.id, "Rejected")}
                                                >
                                                    ❌ Reject
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
        </div>
    );
}

export default Admin;