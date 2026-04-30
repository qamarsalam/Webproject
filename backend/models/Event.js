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

function normalizeEnumValue(value) {
  if (typeof value !== "string") {
    return value;
  }

  return value.trim().replace(/[\s-]+/g, "_").toUpperCase();
}

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
      trim: true,
      set: normalizeEnumValue,
    },
    status: {
      type: String,
      required: true,
      enum: EVENT_STATUS,
      trim: true,
      set: normalizeEnumValue,
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

eventSchema.pre("validate", function enforceCapacityRules() {
  if (!this.registrationRequired) {
    this.capacityLimit = null;
  }
});

eventSchema.pre("save", async function assignEventId() {
  if (!this.isNew || this.eventID) {
    return;
  }

  this.eventID = await Counter.getNextSequence("eventID");
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
