const mongoose = require("mongoose");

const DEFAULT_DB_NAME = "kuevents";

async function connectToDatabase() {
  const mongoUri =
    process.env.MONGODB_URI || `mongodb://127.0.0.1:27017/${DEFAULT_DB_NAME}`;

  mongoose.set("strictQuery", true);

  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGODB_DB_NAME || undefined,
  });

  return mongoose.connection;
}

async function disconnectFromDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

module.exports = {
  connectToDatabase,
  disconnectFromDatabase,
  mongoose,
};
