const { connectToDatabase, disconnectFromDatabase, mongoose } = require("../backend/config/db");
const models = require("../backend/models");
const initializeDatabase = require("../backend/setup/initializeDatabase");

module.exports = {
  connectToDatabase,
  disconnectFromDatabase,
  initializeDatabase,
  mongoose,
  ...models,
};
