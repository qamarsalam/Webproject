const { connectToDatabase, disconnectFromDatabase } = require("../config/db");
const {
  Counter,
  User,
  Organizer,
  Event,
  Registration,
  ContactMessage,
} = require("../models");

const sampleUsers = [
  {
    userID: 1,
    name: "Ahmed",
    email: "ahmed@ku.edu.kw",
    password: "Hashed_pw1",
    role: "STUDENT",
    mobileNumber: null,
    isAuthorized: true,
    isActive: true,
    createdAt: new Date("2026-03-01T10:09:00"),
  },
  {
    userID: 2,
    name: "Sara",
    email: "sara@ku.edu.kw",
    password: "hashed_pw2",
    role: "ORGANIZER",
    mobileNumber: null,
    isAuthorized: true,
    isActive: true,
    createdAt: new Date("2026-03-03T06:00:00"),
  },
  {
    userID: 3,
    name: "Ali",
    email: "ali@gmail.com",
    password: "Hashed_pw3",
    role: "EXTERNAL_PARTICIPANT",
    mobileNumber: "99887766",
    isAuthorized: true,
    isActive: true,
    createdAt: new Date("2026-03-03T09:30:00"),
  },
  {
    userID: 4,
    name: "Admin",
    email: "admin@ku.edu.kw",
    password: "admin123",
    role: "ADMIN",
    mobileNumber: null,
    isAuthorized: true,
    isActive: true,
    createdAt: new Date("2026-03-04T09:30:00"),
  },
  {
    userID: 5,
    name: "Fatima",
    email: "fatima@ku.edu.kw",
    password: "fatima123",
    role: "STAFF",
    mobileNumber: null,
    isAuthorized: true,
    isActive: true,
    createdAt: new Date("2026-03-05T11:15:00"),
  },
  {
    userID: 6,
    name: "Omar",
    email: "omar@ku.edu.kw",
    password: "omar123",
    role: "STUDENT",
    mobileNumber: null,
    isAuthorized: true,
    isActive: true,
    createdAt: new Date("2026-03-06T14:20:00"),
  },
  {
    userID: 7,
    name: "Noura",
    email: "noura@ku.edu.kw",
    password: "noura123",
    role: "ORGANIZER",
    mobileNumber: null,
    isAuthorized: true,
    isActive: true,
    createdAt: new Date("2026-03-07T08:45:00"),
  },
  {
    userID: 8,
    name: "Yousef",
    email: "yousef@ku.edu.kw",
    password: "yousef123",
    role: "ORGANIZER",
    mobileNumber: null,
    isAuthorized: true,
    isActive: true,
    createdAt: new Date("2026-03-08T12:10:00"),
  },
  {
    userID: 9,
    name: "Layla",
    email: "layla@gmail.com",
    password: "layla123",
    role: "EXTERNAL_PARTICIPANT",
    mobileNumber: "94445566",
    isAuthorized: true,
    isActive: true,
    createdAt: new Date("2026-03-09T16:25:00"),
  },
  {
    userID: 10,
    name: "Hamad",
    email: "hamad@ku.edu.kw",
    password: "hamad123",
    role: "STUDENT",
    mobileNumber: null,
    isAuthorized: true,
    isActive: true,
    createdAt: new Date("2026-03-10T09:35:00"),
  },
];

const sampleOrganizers = [
  {
    organizerID: 1,
    userID: 2,
    organizationName: "College of Engineering",
    organizationType: "COLLEGE",
    description: "Official organizer for engineering events",
  },
  {
    organizerID: 2,
    userID: 7,
    organizationName: "Computer Science Club",
    organizationType: "STUDENT_CLUB",
    description: "Student club organizing technical workshops and coding events",
  },
  {
    organizerID: 3,
    userID: 8,
    organizationName: "Student Affairs",
    organizationType: "ADMINISTRATIVE_UNIT",
    description: "Administrative unit coordinating campus-wide student activities",
  },
];

const sampleEvents = [
  {
    eventID: 1,
    organizerID: 1,
    title: "AI Workshop",
    description: "Introduction to Artificial Intelligence",
    category: "Workshop",
    eventDate: new Date("2026-04-10"),
    startTime: "10:00",
    endTime: "12:00",
    location: "KU Shadadiya Campus",
    visibility: "KU_ONLY",
    status: "PUBLISHED",
    posterURL: null,
    speakerInfo: null,
    registrationRequired: true,
    capacityLimit: null,
    createdAt: new Date("2026-03-15T09:00:00"),
  },
  {
    eventID: 2,
    organizerID: 1,
    title: "Cybersecurity Seminar",
    description: "Learn the basics of digital security",
    category: "Seminar",
    eventDate: new Date("2026-04-15"),
    startTime: "11:00",
    endTime: "13:00",
    location: "KU Khaldiya Campus",
    visibility: "PUBLIC",
    status: "PUBLISHED",
    posterURL: null,
    speakerInfo: null,
    registrationRequired: true,
    capacityLimit: null,
    createdAt: new Date("2026-03-16T09:00:00"),
  },
  {
    eventID: 3,
    organizerID: 2,
    title: "Web Development Bootcamp",
    description: "Hands-on bootcamp covering React components, routing, and API integration",
    category: "Workshop",
    eventDate: new Date("2026-04-22"),
    startTime: "09:00",
    endTime: "13:00",
    location: "Computer Science Lab 204",
    visibility: "KU_ONLY",
    status: "PUBLISHED",
    posterURL: null,
    speakerInfo: "Computer Science Club mentors",
    registrationRequired: true,
    capacityLimit: 35,
    createdAt: new Date("2026-03-18T10:00:00"),
  },
  {
    eventID: 4,
    organizerID: 3,
    title: "Culture Day",
    description: "A public cultural event with student booths, performances, and campus activities",
    category: "Culture",
    eventDate: new Date("2026-04-25"),
    startTime: "16:00",
    endTime: "20:00",
    location: "KU Main Courtyard",
    visibility: "PUBLIC",
    status: "PUBLISHED",
    posterURL: null,
    speakerInfo: null,
    registrationRequired: true,
    capacityLimit: 200,
    createdAt: new Date("2026-03-19T13:30:00"),
  },
  {
    eventID: 5,
    organizerID: 1,
    title: "Research Poster Exhibition",
    description: "Students present research posters from engineering and science departments",
    category: "Research",
    eventDate: new Date("2026-05-02"),
    startTime: "10:00",
    endTime: "14:00",
    location: "Engineering Building Atrium",
    visibility: "PUBLIC",
    status: "PUBLISHED",
    posterURL: null,
    speakerInfo: "Faculty judging panel",
    registrationRequired: false,
    capacityLimit: null,
    createdAt: new Date("2026-03-21T09:10:00"),
  },
  {
    eventID: 6,
    organizerID: 2,
    title: "Programming Contest",
    description: "Team-based problem solving contest for KU students",
    category: "Academic",
    eventDate: new Date("2026-05-08"),
    startTime: "12:00",
    endTime: "17:00",
    location: "Innovation Center",
    visibility: "KU_ONLY",
    status: "PUBLISHED",
    posterURL: null,
    speakerInfo: "KU Programming Team",
    registrationRequired: true,
    capacityLimit: 60,
    createdAt: new Date("2026-03-22T15:40:00"),
  },
  {
    eventID: 7,
    organizerID: 3,
    title: "Career Readiness Seminar",
    description: "Seminar about CV writing, interviews, and internship preparation",
    category: "Seminar",
    eventDate: new Date("2026-05-12"),
    startTime: "11:00",
    endTime: "12:30",
    location: "Student Affairs Hall",
    visibility: "KU_ONLY",
    status: "PENDING_APPROVAL",
    posterURL: null,
    speakerInfo: "Career Services Office",
    registrationRequired: true,
    capacityLimit: 80,
    createdAt: new Date("2026-03-24T10:25:00"),
  },
  {
    eventID: 8,
    organizerID: 1,
    title: "Robotics Demonstration",
    description: "Live demonstration of student robotics projects and automation prototypes",
    category: "Academic",
    eventDate: new Date("2026-05-18"),
    startTime: "13:00",
    endTime: "15:00",
    location: "Engineering Workshop",
    visibility: "PUBLIC",
    status: "DRAFT",
    posterURL: null,
    speakerInfo: "Robotics Lab Team",
    registrationRequired: true,
    capacityLimit: 45,
    createdAt: new Date("2026-03-26T14:00:00"),
  },
];

const sampleRegistrations = [
  {
    registrationID: 1,
    eventID: 1,
    userID: 1,
    registrationDate: new Date("2026-03-20T08:30:00"),
    registrationStatus: "REGISTERED",
    bookingReference: "KUW-1001",
  },
  {
    registrationID: 2,
    eventID: 2,
    userID: 3,
    registrationDate: new Date("2026-03-20T09:00:00"),
    registrationStatus: "REGISTERED",
    bookingReference: "KUW-1002",
  },
  {
    registrationID: 3,
    eventID: 3,
    userID: 1,
    registrationDate: new Date("2026-03-21T10:15:00"),
    registrationStatus: "REGISTERED",
    bookingReference: "KUW-1003",
  },
  {
    registrationID: 4,
    eventID: 3,
    userID: 6,
    registrationDate: new Date("2026-03-21T10:30:00"),
    registrationStatus: "REGISTERED",
    bookingReference: "KUW-1004",
  },
  {
    registrationID: 5,
    eventID: 4,
    userID: 3,
    registrationDate: new Date("2026-03-22T09:45:00"),
    registrationStatus: "REGISTERED",
    bookingReference: "KUW-1005",
  },
  {
    registrationID: 6,
    eventID: 4,
    userID: 9,
    registrationDate: new Date("2026-03-22T11:20:00"),
    registrationStatus: "REGISTERED",
    bookingReference: "KUW-1006",
  },
  {
    registrationID: 7,
    eventID: 5,
    userID: 5,
    registrationDate: new Date("2026-03-23T12:05:00"),
    registrationStatus: "REGISTERED",
    bookingReference: "KUW-1007",
  },
  {
    registrationID: 8,
    eventID: 6,
    userID: 10,
    registrationDate: new Date("2026-03-24T08:55:00"),
    registrationStatus: "REGISTERED",
    bookingReference: "KUW-1008",
  },
  {
    registrationID: 9,
    eventID: 6,
    userID: 6,
    registrationDate: new Date("2026-03-24T09:10:00"),
    registrationStatus: "CANCELLED",
    bookingReference: "KUW-1009",
  },
];

const sampleContactMessages = [
  {
    messageID: 1,
    userID: 1,
    name: "Ahmed",
    email: "ahmed@ku.edu.kw",
    subject: "Event registration issue",
    message: "I cannot register for the AI Workshop. The page keeps showing an error.",
    status: "RESPONDED",
    response: "Please refresh the event details page and try again. Your account is active and the event is still open.",
    respondedAt: new Date("2026-03-21T13:15:00"),
    createdAt: new Date("2026-03-21T10:40:00"),
  },
  {
    messageID: 2,
    userID: 6,
    name: "Omar",
    email: "omar@ku.edu.kw",
    subject: "KU-only event access",
    message: "I logged in as a student, but I want to confirm if I can view KU-only events.",
    status: "READ",
    response: null,
    respondedAt: null,
    createdAt: new Date("2026-03-22T09:20:00"),
  },
  {
    messageID: 3,
    userID: 3,
    name: "Ali",
    email: "ali@gmail.com",
    subject: "Public event registration",
    message: "Can external participants register for Culture Day?",
    status: "UNREAD",
    response: null,
    respondedAt: null,
    createdAt: new Date("2026-03-23T16:05:00"),
  },
  {
    messageID: 4,
    userID: 7,
    name: "Noura",
    email: "noura@ku.edu.kw",
    subject: "Organizer dashboard question",
    message: "How can I check how many students registered for my programming contest?",
    status: "RESPONDED",
    response: "Open Organizer Dashboard and check the Total Registrations value. You can also view registrations for your own events through the backend registration endpoint.",
    respondedAt: new Date("2026-03-25T11:30:00"),
    createdAt: new Date("2026-03-25T08:50:00"),
  },
];

async function upsertUser(userData) {
  let user = await User.findOne({ userID: userData.userID });

  if (!user) {
    user = new User(userData);
  } else {
    Object.assign(user, userData);
  }

  await user.save();
}

async function seedMilestoneThreeData() {
  for (const user of sampleUsers) {
    await upsertUser(user);
  }

  for (const organizer of sampleOrganizers) {
    await Organizer.updateOne(
      { organizerID: organizer.organizerID },
      { $set: organizer },
      { upsert: true, runValidators: true }
    );
  }

  for (const event of sampleEvents) {
    await Event.updateOne(
      { eventID: event.eventID },
      { $set: event },
      { upsert: true, runValidators: true }
    );
  }

  for (const registration of sampleRegistrations) {
    await Registration.updateOne(
      { registrationID: registration.registrationID },
      { $set: registration },
      { upsert: true, runValidators: true }
    );
  }

  for (const contactMessage of sampleContactMessages) {
    await ContactMessage.updateOne(
      { messageID: contactMessage.messageID },
      { $set: contactMessage },
      { upsert: true, runValidators: true }
    );
  }

  await Promise.all([
    Counter.updateOne(
      { _id: "userID" },
      { $max: { sequenceValue: 10 } },
      { upsert: true }
    ),
    Counter.updateOne(
      { _id: "organizerID" },
      { $max: { sequenceValue: 3 } },
      { upsert: true }
    ),
    Counter.updateOne(
      { _id: "eventID" },
      { $max: { sequenceValue: 8 } },
      { upsert: true }
    ),
    Counter.updateOne(
      { _id: "registrationID" },
      { $max: { sequenceValue: 9 } },
      { upsert: true }
    ),
    Counter.updateOne(
      { _id: "messageID" },
      { $max: { sequenceValue: 4 } },
      { upsert: true }
    ),
  ]);
}

async function initializeDatabase() {
  await connectToDatabase();

  const models = [Counter, User, Organizer, Event, Registration, ContactMessage];

  for (const model of models) {
    await model.createCollection();
    await model.syncIndexes();
  }

  await seedMilestoneThreeData();

  return {
    databaseName: Counter.db.name,
    collections: models.map((model) => model.collection.name),
    seeded: {
      users: sampleUsers.length,
      organizers: sampleOrganizers.length,
      events: sampleEvents.length,
      registrations: sampleRegistrations.length,
      contactMessages: sampleContactMessages.length,
    },
  };
}

if (require.main === module) {
  initializeDatabase()
    .then(async (result) => {
      console.log("Database initialized successfully.");
      console.log(JSON.stringify(result, null, 2));
      await disconnectFromDatabase();
    })
    .catch(async (error) => {
      console.error("Database initialization failed.");
      console.error(error);
      await disconnectFromDatabase();
      process.exitCode = 1;
    });
}

module.exports = initializeDatabase;
