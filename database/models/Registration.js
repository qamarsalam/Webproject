const { mongoose } = require("../config/db");
const Counter = require("./Counter");

const REGISTRATION_STATUS = ["REGISTERED", "CANCELLED"];

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
      uppercase: true,
      trim: true,
      default: "REGISTERED",
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

registrationSchema.pre("save", async function assignRegistrationId(next) {
  if (!this.isNew || this.registrationID) {
    return next();
  }

  this.registrationID = await Counter.getNextSequence("registrationID");
  next();
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
