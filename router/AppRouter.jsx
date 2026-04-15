import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ minHeight: "calc(100vh - 350px)" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/organizer-request" element={<OrganizerRequest />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default AppRouter;