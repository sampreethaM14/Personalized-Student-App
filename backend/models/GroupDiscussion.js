const mongoose = require("mongoose");

const groupDiscussionSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "GroupDiscussion",
  groupDiscussionSchema
);