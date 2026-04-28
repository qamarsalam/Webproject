require("dotenv").config();
const app = require("./app");
const connectToDatabase = require("./config/db");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`KUEvents API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start backend server:", error.message);
    process.exit(1);
  }
}

startServer();

/*connects to mongodb and starts the server. If the connection fails, it logs the error and exits the process. This ensures that the server only runs if the database connection is successful. */