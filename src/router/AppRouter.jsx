import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Events from "../pages/Events";
import EventDetails from "../pages/EventDetails";
import ContactUs from "../pages/ContactUs";
import OrganizerRequest from "../pages/OrganizerRequest";
import Register from "../pages/Register";
import CreateEvent from "../pages/CreateEvent";
import OrganizerDashboard from "../pages/OrganizerDashboard";
import Admin from "../pages/Admin";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <main style={{ minHeight: "calc(100vh - 350px)" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/create-event/:eventId/edit" element={<CreateEvent />} />
          <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/organizer-request" element={<OrganizerRequest />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default AppRouter;
