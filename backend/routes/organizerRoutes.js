const express = require("express");
const {
  approveOrganizerRequest,
  getMyOrganizerProfile,
  getOrganizerById,
  getOrganizers,
  saveMyOrganizerProfile,
} = require("../controllers/organizerController");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticateToken, authorizeRoles("ADMIN"), getOrganizers);
router.post("/approve-request", authenticateToken, authorizeRoles("ADMIN"), approveOrganizerRequest);
router.get("/me", authenticateToken, authorizeRoles("ORGANIZER", "ADMIN"), getMyOrganizerProfile);
router.post("/me", authenticateToken, authorizeRoles("ORGANIZER", "ADMIN"), saveMyOrganizerProfile);
router.get("/:id", getOrganizerById);

module.exports = router;
