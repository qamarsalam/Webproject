const express = require("express");
const {
  cancelMyEventRegistration,
  cancelRegistration,
  createRegistration,
  getEventRegistrations,
  getMyRegistrations,
} = require("../controllers/registrationController");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/my", authenticateToken, getMyRegistrations);
router.get(
  "/event/:eventId",
  authenticateToken,
  authorizeRoles("ORGANIZER", "ADMIN"),
  getEventRegistrations
);

router.post("/", authenticateToken, createRegistration);
router.delete("/event/:eventId/my", authenticateToken, cancelMyEventRegistration);
router.delete("/:id", authenticateToken, cancelRegistration);

module.exports = router;
