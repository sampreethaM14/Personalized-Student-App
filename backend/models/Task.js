const mongoose = require("mongoose");

// Powers both the Study Planner and the To-Do List modules
const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    subject: { type: String, default: "General" },
    description: { type: String, default: "" },
    dueDate: { type: Date },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
    type: { type: String, enum: ["study", "todo"], default: "todo" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
