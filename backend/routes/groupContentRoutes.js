const express = require("express");
const router = express.Router();

const StudyGroup = require("../models/StudyGroup");
const GroupResource = require("../models/GroupResource");
const GroupTask = require("../models/GroupTask");
const GroupDiscussion = require("../models/GroupDiscussion");

const { protect } = require("../middleware/authMiddleware");


// ==========================================
// AUTHENTICATION
// ==========================================

router.use(protect);


// ==========================================
// CHECK IF USER IS A MEMBER
// ==========================================

const checkMembership = async (req, res, next) => {
  try {
    const group = await StudyGroup.findById(
      req.params.groupId
    );

    if (!group) {
      return res.status(404).json({
        message: "Study group not found",
      });
    }

    const isMember = group.members.some(
      (member) =>
        member.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You must join this group first",
      });
    }

    req.group = group;

    next();

  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to verify group membership",
    });
  }
};


// ==========================================
// RESOURCES
// ==========================================


// GET GROUP RESOURCES

router.get(
  "/:groupId/resources",
  checkMembership,
  async (req, res) => {
    try {
      const resources = await GroupResource.find({
        group: req.params.groupId,
      })
        .populate("sharedBy", "name email")
        .sort({ createdAt: -1 });

      res.json(resources);

    } catch (error) {
      res.status(500).json({
        message: error.message || "Failed to fetch resources",
      });
    }
  }
);


// ADD RESOURCE

router.post(
  "/:groupId/resources",
  checkMembership,
  async (req, res) => {
    try {
      const { title, url, description } = req.body;

      if (!title?.trim() || !url?.trim()) {
        return res.status(400).json({
          message: "Resource title and URL are required",
        });
      }

      const resource = await GroupResource.create({
        group: req.params.groupId,
        title: title.trim(),
        url: url.trim(),
        description: description?.trim() || "",
        sharedBy: req.user._id,
      });

      const populatedResource =
        await GroupResource.findById(resource._id)
          .populate("sharedBy", "name email");

      res.status(201).json(populatedResource);

    } catch (error) {
      res.status(500).json({
        message: error.message || "Failed to add resource",
      });
    }
  }
);


// DELETE RESOURCE

router.delete(
  "/:groupId/resources/:resourceId",
  checkMembership,
  async (req, res) => {
    try {

      // Make sure resource belongs to this group
      const resource = await GroupResource.findOne({
        _id: req.params.resourceId,
        group: req.params.groupId,
      });

      if (!resource) {
        return res.status(404).json({
          message: "Resource not found in this group",
        });
      }

      // Only person who shared can delete
      if (
        resource.sharedBy.toString() !==
        req.user._id.toString()
      ) {
        return res.status(403).json({
          message:
            "You can only delete resources shared by you",
        });
      }

      await resource.deleteOne();

      res.json({
        message: "Resource deleted successfully",
      });

    } catch (error) {
      res.status(500).json({
        message: error.message || "Failed to delete resource",
      });
    }
  }
);


// ==========================================
// DISCUSSIONS
// ==========================================


// GET DISCUSSIONS

router.get(
  "/:groupId/discussions",
  checkMembership,
  async (req, res) => {
    try {

      const discussions =
        await GroupDiscussion.find({
          group: req.params.groupId,
        })
          .populate("postedBy", "name email")
          .sort({ createdAt: -1 });

      res.json(discussions);

    } catch (error) {
      res.status(500).json({
        message:
          error.message ||
          "Failed to fetch discussions",
      });
    }
  }
);


// ADD DISCUSSION

router.post(
  "/:groupId/discussions",
  checkMembership,
  async (req, res) => {
    try {

      const { content } = req.body;

      if (!content?.trim()) {
        return res.status(400).json({
          message:
            "Discussion content is required",
        });
      }

      const discussion =
        await GroupDiscussion.create({
          group: req.params.groupId,
          content: content.trim(),
          postedBy: req.user._id,
        });

      const populatedDiscussion =
        await GroupDiscussion.findById(
          discussion._id
        )
          .populate("postedBy", "name email");

      res.status(201).json(
        populatedDiscussion
      );

    } catch (error) {
      res.status(500).json({
        message:
          error.message ||
          "Failed to post discussion",
      });
    }
  }
);


// ==========================================
// TASKS
// ==========================================


// GET GROUP TASKS

router.get(
  "/:groupId/tasks",
  checkMembership,
  async (req, res) => {
    try {

      const tasks = await GroupTask.find({
        group: req.params.groupId,
      })
        .populate("createdBy", "name")
        .populate("completedBy", "name")
        .sort({ createdAt: -1 });

      res.json(tasks);

    } catch (error) {
      res.status(500).json({
        message:
          error.message ||
          "Failed to fetch tasks",
      });
    }
  }
);


// ADD TASK

router.post(
  "/:groupId/tasks",
  checkMembership,
  async (req, res) => {
    try {

      const {
        title,
        description,
        dueDate,
      } = req.body;

      if (!title?.trim()) {
        return res.status(400).json({
          message: "Task title is required",
        });
      }

      const task = await GroupTask.create({
        group: req.params.groupId,
        title: title.trim(),
        description: description?.trim() || "",
        dueDate: dueDate || undefined,
        createdBy: req.user._id,
      });

      const populatedTask =
        await GroupTask.findById(task._id)
          .populate("createdBy", "name")
          .populate("completedBy", "name");

      res.status(201).json(populatedTask);

    } catch (error) {
      res.status(500).json({
        message:
          error.message ||
          "Failed to create task",
      });
    }
  }
);


// ==========================================
// COMPLETE / UNCOMPLETE TASK
// ==========================================

router.post(
  "/:groupId/tasks/:taskId/toggle",
  checkMembership,
  async (req, res) => {
    try {

      // Ensure task belongs to requested group
      const task = await GroupTask.findOne({
        _id: req.params.taskId,
        group: req.params.groupId,
      });

      if (!task) {
        return res.status(404).json({
          message: "Task not found in this group",
        });
      }

      const alreadyCompleted =
        task.completedBy.some(
          (memberId) =>
            memberId.toString() ===
            req.user._id.toString()
        );

      if (alreadyCompleted) {

        task.completedBy =
          task.completedBy.filter(
            (memberId) =>
              memberId.toString() !==
              req.user._id.toString()
          );

      } else {

        task.completedBy.push(
          req.user._id
        );

      }

      await task.save();

      const updatedTask =
        await GroupTask.findById(task._id)
          .populate("createdBy", "name")
          .populate("completedBy", "name");

      res.json(updatedTask);

    } catch (error) {
      res.status(500).json({
        message:
          error.message ||
          "Failed to update task",
      });
    }
  }
);


module.exports = router;