const Organizer = require("../models/Organizer");
const User = require("../models/User");

function serializeOrganizer(organizer) {
  return {
    id: organizer.organizerID,
    organizerID: organizer.organizerID,
    userID: organizer.userID,
    organizationName: organizer.organizationName,
    description: organizer.description,
  };
}

async function getOrganizers(req, res, next) {
  try {
    const organizers = await Organizer.find().sort({ organizerID: 1 });
    res.status(200).json({ organizers: organizers.map(serializeOrganizer) });
  } catch (error) {
    next(error);
  }
}

async function getMyOrganizerProfile(req, res, next) {
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

async function saveMyOrganizerProfile(req, res, next) {
  try {
    const payload = {
      organizationName: req.body.organizationName,
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

async function approveOrganizerRequest(req, res, next) {
  try {
    const email = String(req.body.email || req.body.universityEmail || "")
      .trim()
      .toLowerCase();
    const organizationName = req.body.organizationName || req.body.clubDepartment;
    const description = req.body.description || req.body.eventPurpose;

    if (!email || !organizationName || !description) {
      return res.status(400).json({
        message: "Email, organization name, and description are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "A registered user with this email was not found",
      });
    }

    user.role = "ORGANIZER";
    user.isAuthorized = true;
    await user.save();

    let organizer = await Organizer.findOne({ userID: user.userID });

    if (organizer) {
      organizer.organizationName = organizationName;
      organizer.description = description;
      await organizer.save();
    } else {
      organizer = await Organizer.create({
        userID: user.userID,
        organizationName,
        description,
      });
    }

    res.status(200).json({
      message: "Organizer request approved successfully",
      organizer: serializeOrganizer(organizer),
      user: {
        id: user.userID,
        name: user.name,
        email: user.email,
        role: user.role,
        isAuthorized: user.isAuthorized,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getOrganizerById(req, res, next) {
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
}

module.exports = {
  approveOrganizerRequest,
  getOrganizers,
  getMyOrganizerProfile,
  saveMyOrganizerProfile,
  getOrganizerById,
};
