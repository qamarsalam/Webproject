const express = require("express");
const {
  createContactMessage,
  getContactMessages,
  getMyContactMessages,
  respondToContactMessage,
} = require("../controllers/contactController");
const {
  authenticateToken,
  authorizeRoles,
  optionalAuthenticateToken,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", optionalAuthenticateToken, createContactMessage);
router.get("/my", authenticateToken, getMyContactMessages);
router.get("/", authenticateToken, authorizeRoles("ADMIN"), getContactMessages);
router.put(
  "/:id/respond",
  authenticateToken,
  authorizeRoles("ADMIN"),
  respondToContactMessage
);

module.exports = router;
