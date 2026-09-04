const MoodLog = require("../models/MoodLog");

const MOOD_SCORE = { great: 5, good: 4, okay: 3, stressed: 2, "burnt-out": 1 };

// @route GET /api/mood
const getMoodLogs = async (req, res) => {
  const logs = await MoodLog.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(60);
  res.json(logs);
};

// @route POST /api/mood
const logMood = async (req, res) => {
  const { mood, energyLevel, note } = req.body;
  if (!mood) return res.status(400).json({ message: "mood is required" });

  const log = await MoodLog.create({ user: req.user._id, mood, energyLevel, note });
  res.status(201).json(log);
};

// @route GET /api/mood/burnout-status
// Simple rule-based burnout monitor (see slide 3/4): looks at the last 7 logs
const getBurnoutStatus = async (req, res) => {
  const recent = await MoodLog.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(7);

  if (recent.length === 0) {
    return res.json({ status: "no-data", averageScore: null, message: "Log your mood to see insights here." });
  }

  const avg =
    recent.reduce((sum, log) => sum + (MOOD_SCORE[log.mood] || 3), 0) / recent.length;

  let status = "healthy";
  let message = "Your recent mood trend looks stable. Keep it up!";

  if (avg <= 2) {
    status = "high-risk";
    message = "Your recent logs suggest high stress or burnout. Consider a lighter schedule and a break.";
  } else if (avg <= 2.8) {
    status = "at-risk";
    message = "You've had a few tough days. Try to balance study blocks with rest.";
  }

  res.json({ status, averageScore: Number(avg.toFixed(2)), sampleSize: recent.length, message });
};

module.exports = { getMoodLogs, logMood, getBurnoutStatus };
