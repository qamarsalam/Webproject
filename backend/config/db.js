const mongoose = require("mongoose");

async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/kuevents";

  mongoose.set("strictQuery", true);

  await mongoose.connect(mongoUri);
  console.log(`MongoDB connected: ${mongoose.connection.name}`);

  return mongoose.connection;
}

module.exports = connectToDatabase;
