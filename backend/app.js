const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const healthRoutes = require("./routes/healthRoutes");// is just a small test route
//later i will add more routes for users, events, etc. but for now this is just to test the server is working and can connect to the database.

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json({ limit: "1mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/health", healthRoutes);//craetes this endpoint

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({
    message: error.message || "Internal server error",
  });
});

module.exports = app;
