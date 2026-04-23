const { mongoose } = require("../config/db");
const Counter = require("./Counter");

const organizerSchema = new mongoose.Schema(
  {
    organizerID: {
      type: Number,
      unique: true,
      index: true,
      min: 1,
    },
    userID: {
      type: Number,
      required: true,
      unique: true,
      index: true,
      min: 1,
    },
    organizationName: {
      type: String,
      required: true,
      trim: true,
    },
    organizationType: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    collection: "organizers",
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

organizerSchema.pre("save", async function assignOrganizerId(next) {
  if (!this.isNew || this.organizerID) {
    return next();
  }

  this.organizerID = await Counter.getNextSequence("organizerID");
  next();
});

organizerSchema.virtual("user", {
  ref: "User",
  localField: "userID",
  foreignField: "userID",
  justOne: true,
});

organizerSchema.virtual("events", {
  ref: "Event",
  localField: "organizerID",
  foreignField: "organizerID",
});

module.exports =
  mongoose.models.Organizer || mongoose.model("Organizer", organizerSchema);
