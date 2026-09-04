const mongoose = require("mongoose");

// Stores the last skill-gap analysis result for a student/target role
const skillGapSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetRole: { type: String, required: true },
    requiredSkills: [{ type: String }],
    knownSkills: [{ type: String }],
    missingSkills: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("SkillGap", skillGapSchema);
