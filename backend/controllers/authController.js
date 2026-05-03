const jwt = require("jsonwebtoken");
const User = require("../models/User");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isValidEmail(email) {
  return EMAIL_PATTERN.test(email);
}

function requiresKuEmail(role) {
  return ["ADMIN", "ORGANIZER", "STUDENT", "STAFF"].includes(
    String(role || "").trim().replace(/[\s-]+/g, "_").toUpperCase()
  );
}

function createToken(user) {
  return jwt.sign(
    {
      userId: user.userID,
      mongoId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET || "development_secret",
    { expiresIn: "7d" }
  );
}

function serializeUser(user) {
  return {
    id: user.userID,
    mongoId: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isAuthorized: user.isAuthorized,
    isActive: user.isActive,
  };
}

async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Name, email, password, and role are required",
      });
    }

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }

    if (requiresKuEmail(role) && !normalizedEmail.endsWith("@ku.edu.kw")) {
      return res.status(400).json({
        message: "KU users must use an email ending with @ku.edu.kw",
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role,
    });

    const token = createToken(user);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: serializeUser(user),
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const passwordMatches = await user.comparePassword(password);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = createToken(user);

    res.status(200).json({
      message: "Login successful",
      token,
      user: serializeUser(user),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
};
