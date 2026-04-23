const { connectToDatabase, disconnectFromDatabase } = require("../config/db");
const { Counter, User, Organizer, Event, Registration } = require("../models");

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
    role: "EXTERNAL PARTICIPANT",
    mobileNumber: "99887766",
    isAuthorized: true,
    isActive: true,
    createdAt: new Date("2026-03-03T09:30:00"),
  },
];

const sampleOrganizers = [
  {
    organizerID: 1,
    userID: 2,
    organizationName: "College of Engineering",
    organizationType: "College",
    description: "Official organizer for engineering events",
  },
];

// The Word template includes registration rows for event IDs 1 and 2 but leaves the
// event sample table blank, so we seed matching event records to keep the foreign
// keys valid and aligned with the front-end prototype data.
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
];

async function seedMilestoneThreeData() {
  for (const user of sampleUsers) {
    await User.updateOne({ userID: user.userID }, { $set: user }, { upsert: true });
  }

  for (const organizer of sampleOrganizers) {
    await Organizer.updateOne(
      { organizerID: organizer.organizerID },
      { $set: organizer },
      { upsert: true }
    );
  }

  for (const event of sampleEvents) {
    await Event.updateOne({ eventID: event.eventID }, { $set: event }, { upsert: true });
  }

  for (const registration of sampleRegistrations) {
    await Registration.updateOne(
      { registrationID: registration.registrationID },
      { $set: registration },
      { upsert: true }
    );
  }

  await Promise.all([
    Counter.updateOne(
      { _id: "userID" },
      { $max: { sequenceValue: 3 } },
      { upsert: true }
    ),
    Counter.updateOne(
      { _id: "organizerID" },
      { $max: { sequenceValue: 1 } },
      { upsert: true }
    ),
    Counter.updateOne(
      { _id: "eventID" },
      { $max: { sequenceValue: 2 } },
      { upsert: true }
    ),
    Counter.updateOne(
      { _id: "registrationID" },
      { $max: { sequenceValue: 2 } },
      { upsert: true }
    ),
  ]);
}

async function initializeDatabase() {
  await connectToDatabase();

  const models = [Counter, User, Organizer, Event, Registration];

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
