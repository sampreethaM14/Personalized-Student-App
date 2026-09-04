const StudyGroup = require("../models/StudyGroup");

// ==========================================
// GET ALL GROUPS
// GET /api/groups
// ==========================================

const getGroups = async (req, res) => {
  try {
    const groups = await StudyGroup.find()
      .populate("createdBy", "name")
      .populate("members", "name")
      .sort({ createdAt: -1 });

    res.json(groups);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to fetch study groups",
    });
  }
};


// ==========================================
// CREATE GROUP
// POST /api/groups
// ==========================================

const createGroup = async (req, res) => {
  try {
    const { name, subject, description } = req.body;

    if (!name?.trim() || !subject?.trim()) {
      return res.status(400).json({
        message: "Group name and subject are required",
      });
    }

    const group = await StudyGroup.create({
      name: name.trim(),
      subject: subject.trim(),
      description: description?.trim() || "",
      createdBy: req.user._id,
      members: [req.user._id],
    });

    const populatedGroup = await StudyGroup.findById(group._id)
      .populate("createdBy", "name")
      .populate("members", "name");

    res.status(201).json(populatedGroup);

  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to create study group",
    });
  }
};


// ==========================================
// JOIN GROUP
// POST /api/groups/:id/join
// ==========================================

const joinGroup = async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        message: "Study group not found",
      });
    }

    const alreadyMember = group.members.some(
      (member) =>
        member.toString() === req.user._id.toString()
    );

    if (alreadyMember) {
      return res.status(200).json({
        message: "You are already a member of this group",
        group,
      });
    }

    group.members.push(req.user._id);

    await group.save();

    const updatedGroup = await StudyGroup.findById(group._id)
      .populate("createdBy", "name")
      .populate("members", "name");

    res.json(updatedGroup);

  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to join group",
    });
  }
};


// ==========================================
// LEAVE GROUP
// POST /api/groups/:id/leave
// ==========================================

const leaveGroup = async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        message: "Study group not found",
      });
    }

    // Check membership
    const isMember = group.members.some(
      (member) =>
        member.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(400).json({
        message: "You are not a member of this group",
      });
    }

    // Prevent creator from leaving
    if (
      group.createdBy.toString() ===
      req.user._id.toString()
    ) {
      return res.status(400).json({
        message:
          "Group creator cannot leave the group. Transfer ownership or delete the group instead.",
      });
    }

    group.members = group.members.filter(
      (member) =>
        member.toString() !== req.user._id.toString()
    );

    await group.save();

    res.json({
      message: "You left the study group successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to leave group",
    });
  }
};


module.exports = {
  getGroups,
  createGroup,
  joinGroup,
  leaveGroup,
};