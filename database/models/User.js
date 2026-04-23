const { mongoose } = require("../config/db");
const Counter = require("./Counter");

const USER_ROLES = [
  "ADMIN",
  "ORGANIZER",
  "STUDENT",
  "STAFF",
  "EXTERNAL_PARTICIPANT",
];

function normalizeRole(value) {
  if (typeof value !== "string") {
    return value;
  }

  return value.trim().replace(/[\s-]+/g, "_").toUpperCase();
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
    mobileNumber: {
      type: String,
      default: null,
      trim: true,
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

userSchema.pre("validate", function setExternalParticipantRules(next) {
  if (this.role === "EXTERNAL_PARTICIPANT" && !this.mobileNumber) {
    this.invalidate(
      "mobileNumber",
      "mobileNumber is required for external participants."
    );
  }

  if (this.role !== "EXTERNAL_PARTICIPANT" && !this.mobileNumber) {
    this.mobileNumber = null;
  }

  next();
});

userSchema.pre("save", async function assignUserId(next) {
  if (!this.isNew || this.userID) {
    return next();
  }

  this.userID = await Counter.getNextSequence("userID");
  next();
});

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
