const { mongoose } = require("../config/db");
const Counter = require("./Counter");

const REGISTRATION_STATUS = ["REGISTERED", "CANCELLED"];

function normalizeRegistrationStatus(value) {
  if (typeof value !== "string") {
    return value;
  }

  return value.trim().replace(/[\s-]+/g, "_").toUpperCase();
}

const registrationSchema = new mongoose.Schema(
  {
    registrationID: {
      type: Number,
      unique: true,
      index: true,
      min: 1,
    },
    eventID: {
      type: Number,
      required: true,
      index: true,
      min: 1,
    },
    userID: {
      type: Number,
      required: true,
      index: true,
      min: 1,
    },
    registrationDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    registrationStatus: {
      type: String,
      required: true,
      enum: REGISTRATION_STATUS,
      trim: true,
      default: "REGISTERED",
      set: normalizeRegistrationStatus,
    },
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    collection: "registrations",
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

registrationSchema.index({ eventID: 1, userID: 1 }, { unique: true });

registrationSchema.pre("save", async function assignRegistrationId() {
  if (!this.isNew || this.registrationID) {
    return;
  }

  this.registrationID = await Counter.getNextSequence("registrationID");
});

registrationSchema.virtual("event", {
  ref: "Event",
  localField: "eventID",
  foreignField: "eventID",
  justOne: true,
});

registrationSchema.virtual("user", {
  ref: "User",
  localField: "userID",
  foreignField: "userID",
  justOne: true,
});

module.exports =
  mongoose.models.Registration ||
  mongoose.model("Registration", registrationSchema);

