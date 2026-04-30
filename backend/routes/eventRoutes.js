const express = require("express");
const {
  createEvent,
  deleteEvent,
  getEventById,
  getEvents,
  getMyEvents,
  updateEvent,
} = require("../controllers/eventController");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getEvents);
router.get("/mine", authenticateToken, authorizeRoles("ORGANIZER", "ADMIN"), getMyEvents);
router.get("/:id", getEventById);

router.post("/", authenticateToken, authorizeRoles("ORGANIZER", "ADMIN"), createEvent);
router.put("/:id", authenticateToken, authorizeRoles("ORGANIZER", "ADMIN"), updateEvent);
router.delete("/:id", authenticateToken, authorizeRoles("ORGANIZER", "ADMIN"), deleteEvent);

module.exports = router;
