const initializeDatabase = require("../../backend/setup/initializeDatabase");
const { disconnectFromDatabase } = require("../../backend/config/db");

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
