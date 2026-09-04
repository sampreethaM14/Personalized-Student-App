const TimetableEntry = require("../models/TimetableEntry");

// @route GET /api/timetable
const getTimetable = async (req, res) => {
  const entries = await TimetableEntry.find({ user: req.user._id }).sort({ day: 1, startTime: 1 });
  res.json(entries);
};

// @route POST /api/timetable
const createEntry = async (req, res) => {
  const { day, startTime, endTime, subject, activityType } = req.body;
  if (!day || !startTime || !endTime || !subject) {
    return res.status(400).json({ message: "day, startTime, endTime and subject are required" });
  }

  const entry = await TimetableEntry.create({
    user: req.user._id,
    day,
    startTime,
    endTime,
    subject,
    activityType,
  });

  res.status(201).json(entry);
};

// @route PUT /api/timetable/:id
const updateEntry = async (req, res) => {
  const entry = await TimetableEntry.findOne({ _id: req.params.id, user: req.user._id });
  if (!entry) return res.status(404).json({ message: "Timetable entry not found" });

  Object.assign(entry, req.body);
  const updated = await entry.save();
  res.json(updated);
};

// @route DELETE /api/timetable/:id
const deleteEntry = async (req, res) => {
  const entry = await TimetableEntry.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!entry) return res.status(404).json({ message: "Timetable entry not found" });
  res.json({ message: "Timetable entry deleted" });
};

module.exports = { getTimetable, createEntry, updateEntry, deleteEntry };
