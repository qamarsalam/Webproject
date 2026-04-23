const { mongoose } = require("../config/db");

const counterSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      trim: true,
    },
    sequenceValue: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    versionKey: false,
  }
);

counterSchema.statics.getNextSequence = async function getNextSequence(counterId) {
  const counter = await this.findByIdAndUpdate(
    counterId,
    { $inc: { sequenceValue: 1 } },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  return counter.sequenceValue;
};

module.exports = mongoose.models.Counter || mongoose.model("Counter", counterSchema);
