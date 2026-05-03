const bcrypt = require("bcryptjs");
const { mongoose } = require("../config/db");
const Counter = require("./Counter");

const USER_ROLES = [
  "ADMIN",
  "ORGANIZER",
  "STUDENT",
  "STAFF",
  "EXTERNAL_PARTICIPANT",
];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const KU_EMAIL_ROLES = ["ADMIN", "ORGANIZER", "STUDENT", "STAFF"];

function normalizeRole(value) {
  if (typeof value !== "string") {
    return value;
  }

  return value.trim().replace(/[\s-]+/g, "_").toUpperCase();
}

function isKuEmailRequired(role) {
  return KU_EMAIL_ROLES.includes(normalizeRole(role));
}

const userSchema = new mongoose.Schema(
  {
    userID: {
      type: Number,
      unique: true,
      index: true,
      min: 1,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [
        {
          validator: (value) => EMAIL_PATTERN.test(value),
          message: "Please enter a valid email",
        },
        {
          validator: function validateKuEmail(value) {
            return !isKuEmailRequired(this.role) || value.endsWith("@ku.edu.kw");
          },
          message: "KU users must use an email ending with @ku.edu.kw",
        },
      ],
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: USER_ROLES,
      trim: true,
      set: normalizeRole,
    },
    isAuthorized: {
      type: Boolean,
      required: true,
      default: false,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    collection: "users",
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre("save", async function assignUserId() {
  if (!this.isNew || this.userID) {
    return;
  }

  this.userID = await Counter.getNextSequence("userID");
});

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.virtual("organizerProfile", {
  ref: "Organizer",
  localField: "userID",
  foreignField: "userID",
  justOne: true,
});

userSchema.virtual("registrations", {
  ref: "Registration",
  localField: "userID",
  foreignField: "userID",
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
