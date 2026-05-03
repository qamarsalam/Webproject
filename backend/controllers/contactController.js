const ContactMessage = require("../models/ContactMessage");

function serializeContactMessage(contactMessage) {
  return {
    id: contactMessage.messageID,
    messageID: contactMessage.messageID,
    userID: contactMessage.userID,
    name: contactMessage.name,
    email: contactMessage.email,
    subject: contactMessage.subject,
    message: contactMessage.message,
    status: contactMessage.status,
    response: contactMessage.response,
    respondedAt: contactMessage.respondedAt,
    createdAt: contactMessage.createdAt,
  };
}

async function createContactMessage(req, res, next) {
  try {
    const payload = {
      userID: req.user?.id || null,
      name: req.body.name || req.user?.name,
      email: req.body.email || req.user?.email,
      subject: req.body.subject,
      message: req.body.message,
      status: "UNREAD",
    };

    const missingFields = Object.entries(payload)
      .filter(([field, value]) => field !== "userID" && !value)
      .map(([field]) => field);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required contact message fields",
        fields: missingFields,
      });
    }

    const contactMessage = await ContactMessage.create(payload);

    res.status(201).json({
      message: "Contact message sent successfully",
      contactMessage: serializeContactMessage(contactMessage),
    });
  } catch (error) {
    next(error);
  }
}

async function getMyContactMessages(req, res, next) {
  try {
    const messages = await ContactMessage.find({
      $or: [{ userID: req.user.id }, { email: req.user.email }],
    }).sort({ createdAt: -1 });

    res.status(200).json({
      messages: messages.map(serializeContactMessage),
    });
  } catch (error) {
    next(error);
  }
}

async function getContactMessages(req, res, next) {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });

    res.status(200).json({
      messages: messages.map(serializeContactMessage),
    });
  } catch (error) {
    next(error);
  }
}

async function respondToContactMessage(req, res, next) {
  try {
    const { response } = req.body;

    if (!response || !response.trim()) {
      return res.status(400).json({ message: "Response is required" });
    }

    const contactMessage = await ContactMessage.findOne({
      messageID: Number(req.params.id),
    });

    if (!contactMessage) {
      return res.status(404).json({ message: "Contact message not found" });
    }

    contactMessage.status = "RESPONDED";
    contactMessage.response = response.trim();
    contactMessage.respondedAt = new Date();
    await contactMessage.save();

    res.status(200).json({
      message: "Response saved successfully",
      contactMessage: serializeContactMessage(contactMessage),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createContactMessage,
  getMyContactMessages,
  getContactMessages,
  respondToContactMessage,
};
