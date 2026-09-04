const express = require("express");

const {
  getGroups,
  createGroup,
  joinGroup,
  leaveGroup,
} = require("../controllers/groupController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All group routes require login
router.use(protect);

// GET all groups
// POST create group
router.route("/")
  .get(getGroups)
  .post(createGroup);

// Join group
router.post("/:id/join", joinGroup);

// Leave group
router.post("/:id/leave", leaveGroup);

module.exports = router;