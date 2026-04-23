const { mongoose } = require("../config/db");
const Counter = require("./Counter");

const EVENT_VISIBILITY = ["KU_ONLY", "PUBLIC"];
const EVENT_STATUS = [
  "DRAFT",
  "PENDING_APPROVAL",
  "PUBLISHED",
  "CANCELLED",
  "ARCHIVED",
];

const eventSchema = new mongoose.Schema(
  {
    eventID: {
      type: Number,
      unique: true,
      index: true,
      min: 1,
    },
    organizerID: {
      type: Number,
      required: true,
      index: true,
      min: 1,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
      trim: true,
    },
    endTime: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    visibility: {
      type: String,
      required: true,
      enum: EVENT_VISIBILITY,
      uppercase: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: EVENT_STATUS,
      uppercase: true,
      trim: true,
    },
    posterURL: {
      type: String,
      default: null,
      trim: true,
    },
    speakerInfo: {
      type: String,
      default: null,
      trim: true,
    },
    registrationRequired: {
      type: Boolean,
      required: true,
      default: false,
    },
    capacityLimit: {
      type: Number,
      default: null,
      min: 1,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    collection: "events",
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

eventSchema.pre("validate", function enforceCapacityRules(next) {
  if (!this.registrationRequired) {
    this.capacityLimit = null;
  }

  next();
});

eventSchema.pre("save", async function assignEventId(next) {
  if (!this.isNew || this.eventID) {
    return next();
  }

  this.eventID = await Counter.getNextSequence("eventID");
  next();
});

eventSchema.virtual("organizer", {
  ref: "Organizer",
  localField: "organizerID",
  foreignField: "organizerID",
  justOne: true,
});

eventSchema.virtual("registrations", {
  ref: "Registration",
  localField: "eventID",
  foreignField: "eventID",
});

module.exports = mongoose.models.Event || mongoose.model("Event", eventSchema);
