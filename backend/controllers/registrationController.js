const Event = require("../../database/models/Event");
const Organizer = require("../../database/models/Organizer");
const Registration = require("../../database/models/Registration");

function serializeRegistration(registration, event = null) {
  return {
    id: registration.registrationID,
    registrationID: registration.registrationID,
    eventID: registration.eventID,
    userID: registration.userID,
    registrationDate: registration.registrationDate,
    registrationStatus: registration.registrationStatus,
    bookingReference: registration.bookingReference,
    event,
  };
}

function serializeEvent(event) {
  if (!event) return null;

  return {
    id: event.eventID,
    eventID: event.eventID,
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
    capacityLimit: event.capacityLimit,
  };
}

function createBookingReference(eventID, userID) {
  return `KU-${eventID}-${userID}-${Date.now().toString(36).toUpperCase()}`;
}

async function countActiveRegistrations(eventID) {
  return Registration.countDocuments({
    eventID,
    registrationStatus: "REGISTERED",
  });
}

async function getMyRegistrations(req, res, next) {
  try {
    const registrations = await Registration.find({ userID: req.user.id }).sort({
      registrationDate: -1,
    });

    const eventIDs = registrations.map((registration) => registration.eventID);
    const events = await Event.find({ eventID: { $in: eventIDs } });
    const eventsById = new Map(events.map((event) => [event.eventID, event]));

    res.status(200).json({
      registrations: registrations.map((registration) =>
        serializeRegistration(registration, serializeEvent(eventsById.get(registration.eventID)))
      ),
    });
  } catch (error) {
    next(error);
  }
}

async function getEventRegistrations(req, res, next) {
  try {
    const eventID = Number(req.params.eventId);
    const event = await Event.findOne({ eventID });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (req.user.role !== "ADMIN") {
      const organizer = await Organizer.findOne({ userID: req.user.id });
      if (!organizer || organizer.organizerID !== event.organizerID) {
        return res.status(403).json({
          message: "You can only view registrations for your own events",
        });
      }
    }

    const registrations = await Registration.find({ eventID }).sort({
      registrationDate: -1,
    });

    res.status(200).json({
      event: serializeEvent(event),
      registrations: registrations.map((registration) =>
        serializeRegistration(registration)
      ),
    });
  } catch (error) {
    next(error);
  }
}

async function createRegistration(req, res, next) {
  try {
    const eventID = Number(req.body.eventID || req.body.eventId);

    if (!eventID) {
      return res.status(400).json({ message: "eventID is required" });
    }

    const event = await Event.findOne({ eventID });

    if (!event || event.status !== "PUBLISHED") {
      return res.status(404).json({ message: "Published event not found" });
    }

    if (req.user.role === "EXTERNAL_PARTICIPANT" && event.visibility !== "PUBLIC") {
      return res.status(403).json({
        message: "External participants can only register for public events",
      });
    }

    const existingRegistration = await Registration.findOne({
      eventID,
      userID: req.user.id,
    });

    if (existingRegistration?.registrationStatus === "REGISTERED") {
      return res.status(409).json({ message: "You are already registered for this event" });
    }

    if (event.capacityLimit) {
      const activeCount = await countActiveRegistrations(eventID);
      if (activeCount >= event.capacityLimit) {
        return res.status(409).json({ message: "This event is full" });
      }
    }

    let registration;
    if (existingRegistration) {
      existingRegistration.registrationStatus = "REGISTERED";
      existingRegistration.registrationDate = new Date();
      registration = await existingRegistration.save();
    } else {
      registration = await Registration.create({
        eventID,
        userID: req.user.id,
        bookingReference: createBookingReference(eventID, req.user.id),
      });
    }

    res.status(201).json({
      message: "Registered successfully",
      registration: serializeRegistration(registration, serializeEvent(event)),
    });
  } catch (error) {
    next(error);
  }
}

async function cancelRegistration(req, res, next) {
  try {
    const registration = await Registration.findOne({
      registrationID: Number(req.params.id),
    });

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    if (req.user.role !== "ADMIN" && registration.userID !== req.user.id) {
      return res.status(403).json({
        message: "You can only cancel your own registrations",
      });
    }

    registration.registrationStatus = "CANCELLED";
    await registration.save();

    res.status(200).json({
      message: "Registration cancelled successfully",
      registration: serializeRegistration(registration),
    });
  } catch (error) {
    next(error);
  }
}

async function cancelMyEventRegistration(req, res, next) {
  try {
    const registration = await Registration.findOne({
      eventID: Number(req.params.eventId),
      userID: req.user.id,
    });

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    registration.registrationStatus = "CANCELLED";
    await registration.save();

    res.status(200).json({
      message: "Registration cancelled successfully",
      registration: serializeRegistration(registration),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getMyRegistrations,
  getEventRegistrations,
  createRegistration,
  cancelRegistration,
  cancelMyEventRegistration,
};
