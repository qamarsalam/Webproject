const { connectToDatabase, disconnectFromDatabase } = require("../config/db");
const { Counter, User, Organizer, Event, Registration } = require("../models");

async function initializeDatabase() {
  await connectToDatabase();

  const models = [Counter, User, Organizer, Event, Registration];

  for (const model of models) {
    await model.createCollection();
    await model.syncIndexes();
  }

  return {
    databaseName: Counter.db.name,
    collections: models.map((model) => model.collection.name),
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
