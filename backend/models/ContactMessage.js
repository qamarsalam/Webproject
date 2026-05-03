const { mongoose } = require("../config/db");
const Counter = require("./Counter");

const CONTACT_MESSAGE_STATUS = ["UNREAD", "READ", "RESPONDED"];

function normalizeStatus(value) {
  if (typeof value !== "string") {
    return value;
  }

  return value.trim().replace(/[\s-]+/g, "_").toUpperCase();
}

const contactMessageSchema = new mongoose.Schema(
  {
    messageID: {
      type: Number,
      unique: true,
      index: true,
      min: 1,
    },
    userID: {
      type: Number,
      default: null,
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
      lowercase: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: CONTACT_MESSAGE_STATUS,
      default: "UNREAD",
      set: normalizeStatus,
    },
    response: {
      type: String,
      default: null,
      trim: true,
    },
    respondedAt: {
      type: Date,
      default: null,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    collection: "contactmessages",
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

contactMessageSchema.pre("save", async function assignMessageId() {
  if (!this.isNew || this.messageID) {
    return;
  }

  this.messageID = await Counter.getNextSequence("messageID");
});

contactMessageSchema.virtual("user", {
  ref: "User",
  localField: "userID",
  foreignField: "userID",
  justOne: true,
});

module.exports =
  mongoose.models.ContactMessage ||
  mongoose.model("ContactMessage", contactMessageSchema);
