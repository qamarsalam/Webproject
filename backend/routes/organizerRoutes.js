const express = require("express");
const Organizer = require("../../database/models/Organizer");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

function normalizeOrganizationType(value) {
  if (!value) return "STUDENT_CLUB";
  return String(value).trim().replace(/[\s-]+/g, "_").toUpperCase();
}

function serializeOrganizer(organizer) {
  return {
    id: organizer.organizerID,
    organizerID: organizer.organizerID,
    userID: organizer.userID,
    organizationName: organizer.organizationName,
    organizationType: organizer.organizationType,
    description: organizer.description,
  };
}

router.get(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN"),
  async (req, res, next) => {
    try {
      const organizers = await Organizer.find().sort({ organizerID: 1 });
      res.status(200).json({ organizers: organizers.map(serializeOrganizer) });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/me",
  authenticateToken,
  authorizeRoles("ORGANIZER", "ADMIN"),
  async (req, res, next) => {
    try {
      const organizer = await Organizer.findOne({ userID: req.user.id });

      if (!organizer) {
        return res.status(404).json({ message: "Organizer profile not found" });
      }

      res.status(200).json({ organizer: serializeOrganizer(organizer) });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/me",
  authenticateToken,
  authorizeRoles("ORGANIZER", "ADMIN"),
  async (req, res, next) => {
    try {
      const payload = {
        organizationName: req.body.organizationName,
        organizationType: normalizeOrganizationType(req.body.organizationType),
        description: req.body.description,
      };

      const missingFields = Object.entries(payload)
        .filter(([, value]) => !value)
        .map(([field]) => field);

      if (missingFields.length > 0) {
        return res.status(400).json({
          message: "Missing required organizer fields",
          fields: missingFields,
        });
      }

      let organizer = await Organizer.findOne({ userID: req.user.id });

      if (organizer) {
        Object.assign(organizer, payload);
        await organizer.save();
      } else {
        organizer = await Organizer.create({
          userID: req.user.id,
          ...payload,
        });
      }

      res.status(200).json({
        message: "Organizer profile saved successfully",
        organizer: serializeOrganizer(organizer),
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get("/:id", async (req, res, next) => {
  try {
    const organizer = await Organizer.findOne({
      organizerID: Number(req.params.id),
    });

    if (!organizer) {
      return res.status(404).json({ message: "Organizer not found" });
    }

    res.status(200).json({ organizer: serializeOrganizer(organizer) });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
