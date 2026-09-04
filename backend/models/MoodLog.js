const mongoose = require("mongoose");

// Powers the Emotion Tracker / Burnout Monitor modules
const moodLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mood: {
      type: String,
      enum: ["great", "good", "okay", "stressed", "burnt-out"],
      required: true,
    },
    energyLevel: { type: Number, min: 1, max: 5, default: 3 },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MoodLog", moodLogSchema);
