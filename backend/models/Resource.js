const mongoose = require("mongoose");

// Powers the Learning Hub and Placement Prep modules
const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    url: { type: String, required: true },
    category: {
      type: String,
      enum: ["academic", "skill", "placement", "interview"],
      default: "academic",
    },
    tags: [{ type: String }],
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resource", resourceSchema);
