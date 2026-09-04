const mongoose = require("mongoose");

// A single block in a student's personalised weekly timetable
const timetableEntrySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    day: {
      type: String,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      required: true,
    },
    startTime: { type: String, required: true }, // "09:00"
    endTime: { type: String, required: true }, // "10:00"
    subject: { type: String, required: true },
    activityType: {
      type: String,
      enum: ["class", "self-study", "revision", "break", "other"],
      default: "self-study",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TimetableEntry", timetableEntrySchema);
