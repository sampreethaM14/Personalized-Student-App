const fetch = require("node-fetch");
const Task = require("../models/Task");
const MoodLog = require("../models/MoodLog");

// Builds a short context string from the student's real data so the
// assistant's replies are personalised (see slide 5 & 6: Personalisation
// Engine + AI Assistant).
const buildContext = async (userId, user) => {
  const pendingTasks = await Task.find({ user: userId, status: { $ne: "completed" } })
    .sort({ dueDate: 1 })
    .limit(5);
  const lastMood = await MoodLog.findOne({ user: userId }).sort({ createdAt: -1 });

  const taskSummary = pendingTasks.length
    ? pendingTasks.map((t) => `- ${t.title} (${t.subject}, due ${t.dueDate ? new Date(t.dueDate).toDateString() : "no date"})`).join("\n")
    : "No pending tasks logged.";

  return `Student name: ${user.name}
Academic goal: ${user.academicGoal || "not set"}
Career interest: ${user.careerInterest || "not set"}
Current mood: ${lastMood ? lastMood.mood : "not logged"}
Upcoming tasks:
${taskSummary}`;
};

// Rule-based fallback so the app is fully demoable without any paid API key.
const fallbackReply = (message, context) => {
  const lower = message.toLowerCase();

  if (lower.includes("plan") || lower.includes("schedule")) {
    return `Here's a simple starting plan based on your pending tasks:\n\n${context.split("Upcoming tasks:\n")[1] || "Add a few tasks in Study Planner first, then ask me again."}\n\nTip: tackle the highest-priority, nearest-deadline task in your first focused session of the day.`;
  }
  if (lower.includes("stress") || lower.includes("burnout") || lower.includes("tired")) {
    return "It sounds like things feel heavy right now. Log your mood in the Emotion Tracker so we can watch the trend, and consider a 20-minute break, some water, and one small task instead of everything at once.";
  }
  if (lower.includes("skill") || lower.includes("gap")) {
    return "Head to the Skill Gap page and enter your target role — I'll compare it against the skills you already have and show exactly what to learn next.";
  }
  if (lower.includes("interview") || lower.includes("placement")) {
    return "For placement prep: revise core CS fundamentals daily, do 2 mock DSA problems, and review one commonly asked interview question. Check the Placement Prep hub for curated resources.";
  }
  return "I'm your study & career assistant. Ask me to build a study plan, explain a concept, check your skill gaps, or help with interview prep — I'll personalise it using your goals, tasks and mood.";
};

// @route POST /api/ai/chat
// body: { message }
const chatWithAssistant = async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: "message is required" });

  const context = await buildContext(req.user._id, req.user);

  // If an AI_API_KEY is configured, call the real model. Otherwise use the
  // rule-based fallback so the prototype still works end-to-end (see slide 7:
  // "backend and database integration as the next stage").
  if (!process.env.AI_API_KEY) {
    return res.json({ reply: fallbackReply(message, context), source: "fallback" });
  }

  try {
    const response = await fetch(process.env.AI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a supportive personal academic & career mentor inside the Personalised Student App. Use this student's context to tailor your answer. Keep replies concise and actionable.\n\n${context}`,
          },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || fallbackReply(message, context);
    res.json({ reply, source: "ai-api" });
  } catch (err) {
    console.error("AI API error:", err.message);
    res.json({ reply: fallbackReply(message, context), source: "fallback-error" });
  }
};

module.exports = { chatWithAssistant };
