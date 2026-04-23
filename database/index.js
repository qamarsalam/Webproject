const { connectToDatabase, disconnectFromDatabase, mongoose } = require("./config/db");
const models = require("./models");
const initializeDatabase = require("./setup/initializeDatabase");

module.exports = {
  connectToDatabase,
  disconnectFromDatabase,
  initializeDatabase,
  mongoose,
  ...models,
};
