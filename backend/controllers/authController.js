const jwt = require("jsonwebtoken");
const User = require("../models/User");

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
    mobileNumber: user.mobileNumber,
    isAuthorized: user.isAuthorized,
    isActive: user.isActive,
  };
}

async function register(req, res, next) {
  try {
    const { name, email, password, role, mobileNumber } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Name, email, password, and role are required",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      mobileNumber,
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

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatches = await user.comparePassword(password);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
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
