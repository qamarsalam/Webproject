const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Authentication token is required" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET || "development_secret");
    const user = await User.findOne({ userID: payload.userId });

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "User account is not active or does not exist" });
    }

    req.user = {
      id: user.userID,
      mongoId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isAuthorized: user.isAuthorized,
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Invalid or expired authentication token" });
    }

    next(error);
  }
}

async function optionalAuthenticateToken(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next();
  }

  return authenticateToken(req, res, next);
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "You are not authorized to access this resource" });
    }

    next();
  };
}

module.exports = {
  authenticateToken,
  optionalAuthenticateToken,
  authorizeRoles,
};
