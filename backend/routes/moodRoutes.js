const express = require("express");
const { getMoodLogs, logMood, getBurnoutStatus } = require("../controllers/moodController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);

router.route("/").get(getMoodLogs).post(logMood);
router.get("/burnout-status", getBurnoutStatus);

module.exports = router;
