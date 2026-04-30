const Event = require("../models/Event");
const Organizer = require("../models/Organizer");
const Registration = require("../models/Registration");

function normalizeVisibility(value) {
  if (!value) return "PUBLIC";
  return String(value).trim().replace(/[\s-]+/g, "_").toUpperCase();
}

function normalizeStatus(value) {
  if (!value) return "PUBLISHED";
  return String(value).trim().replace(/[\s-]+/g, "_").toUpperCase();
}

function parseBoolean(value) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.trim().toLowerCase() === "true";
  }

  return Boolean(value);
}

function serializeEvent(event, registrationCount = 0) {
  return {
    id: event.eventID,
    eventID: event.eventID,
    organizerID: event.organizerID,
    title: event.title,
    description: event.description,
    category: event.category,
    eventDate: event.eventDate,
    startTime: event.startTime,
    endTime: event.endTime,
    location: event.location,
    visibility: event.visibility,
    status: event.status,
    posterURL: event.posterURL,
    speakerInfo: event.speakerInfo,
    registrationRequired: event.registrationRequired,
    capacityLimit: event.capacityLimit,
    createdAt: event.createdAt,
    registrationCount,
    registrations: registrationCount,
  };
}

async function serializeEventWithCounts(event) {
  const registrationCount = await Registration.countDocuments({
    eventID: event.eventID,
    registrationStatus: "REGISTERED",
  });

  return serializeEvent(event, registrationCount);
}

function buildEventPayload(body, organizerID) {
  return {
    organizerID,
    title: body.title,
    description: body.description,
    category: body.category,
    eventDate: body.eventDate || body.date,
    startTime: body.startTime,
    endTime: body.endTime,
    location: body.location,
    visibility: normalizeVisibility(body.visibility),
    status: normalizeStatus(body.status),
    posterURL: body.posterURL || body.photoURL || null,
    speakerInfo: body.speakerInfo || null,
    registrationRequired: parseBoolean(body.registrationRequired),
    capacityLimit: body.capacityLimit || body.seats || null,
  };
}

function validateEventPayload(payload) {
  const requiredFields = [
    "organizerID",
    "title",
    "description",
    "category",
    "eventDate",
    "startTime",
    "endTime",
    "location",
    "visibility",
    "status",
  ];

  return requiredFields.filter((field) => !payload[field]);
}

async function getOrganizerForUser(user, body = {}) {
  const organizer = await Organizer.findOne({ userID: user.id });

  if (organizer) return organizer;

  if (body.organizerID) {
    return { organizerID: Number(body.organizerID) };
  }

  return null;
}

async function getEvents(req, res, next) {
  try {
    const { status, visibility, category } = req.query;
    const filter = {};

    if (status) filter.status = normalizeStatus(status);
    if (visibility) filter.visibility = normalizeVisibility(visibility);
    if (category) filter.category = category;

    const events = await Event.find(filter).sort({ eventDate: 1, createdAt: -1 });
    const serializedEvents = await Promise.all(events.map(serializeEventWithCounts));
    res.status(200).json({ events: serializedEvents });
  } catch (error) {
    next(error);
  }
}

async function getMyEvents(req, res, next) {
  try {
    if (req.user.role === "ADMIN") {
      const events = await Event.find().sort({ eventDate: 1, createdAt: -1 });
      const serializedEvents = await Promise.all(events.map(serializeEventWithCounts));
      return res.status(200).json({ events: serializedEvents });
    }

    const organizer = await Organizer.findOne({ userID: req.user.id });

    if (!organizer) {
      return res.status(200).json({ events: [] });
    }

    const events = await Event.find({ organizerID: organizer.organizerID }).sort({
      eventDate: 1,
      createdAt: -1,
    });

    const serializedEvents = await Promise.all(events.map(serializeEventWithCounts));
    res.status(200).json({ events: serializedEvents });
  } catch (error) {
    next(error);
  }
}

async function getEventById(req, res, next) {
  try {
    const event = await Event.findOne({ eventID: Number(req.params.id) });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ event: await serializeEventWithCounts(event) });
  } catch (error) {
    next(error);
  }
}

async function createEvent(req, res, next) {
  try {
    const organizer = await getOrganizerForUser(req.user, req.body);

    if (!organizer) {
      return res.status(400).json({
        message: "Organizer profile is required before creating events",
      });
    }

    const payload = buildEventPayload(req.body, organizer.organizerID);
    const missingFields = validateEventPayload(payload);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required event fields",
        fields: missingFields,
      });
    }

    const event = await Event.create(payload);
    res.status(201).json({
      message: "Event created successfully",
      event: serializeEvent(event),
    });
  } catch (error) {
    next(error);
  }
}

async function updateEvent(req, res, next) {
  try {
    const event = await Event.findOne({ eventID: Number(req.params.id) });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (req.user.role !== "ADMIN") {
      const organizer = await Organizer.findOne({ userID: req.user.id });
      if (!organizer || organizer.organizerID !== event.organizerID) {
        return res.status(403).json({ message: "You can only update your own events" });
      }
    }

    const payload = buildEventPayload({ ...event.toObject(), ...req.body }, event.organizerID);
    Object.assign(event, payload);
    await event.save();

    res.status(200).json({
      message: "Event updated successfully",
      event: serializeEvent(event),
    });
  } catch (error) {
    next(error);
  }
}

async function deleteEvent(req, res, next) {
  try {
    const event = await Event.findOne({ eventID: Number(req.params.id) });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (req.user.role !== "ADMIN") {
      const organizer = await Organizer.findOne({ userID: req.user.id });
      if (!organizer || organizer.organizerID !== event.organizerID) {
        return res.status(403).json({ message: "You can only delete your own events" });
      }
    }

    await Event.deleteOne({ eventID: event.eventID });
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getEvents,
  getMyEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
