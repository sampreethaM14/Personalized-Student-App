const express = require("express");
const { getTimetable, createEntry, updateEntry, deleteEntry } = require("../controllers/timetableController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);

router.route("/").get(getTimetable).post(createEntry);
router.route("/:id").put(updateEntry).delete(deleteEntry);

module.exports = router;
