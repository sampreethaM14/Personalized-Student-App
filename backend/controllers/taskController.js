const Task = require("../models/Task");

// @route GET /api/tasks?type=study|todo
const getTasks = async (req, res) => {
  const filter = { user: req.user._id };
  if (req.query.type) filter.type = req.query.type;
  if (req.query.status) filter.status = req.query.status;

  const tasks = await Task.find(filter).sort({ dueDate: 1, createdAt: -1 });
  res.json(tasks);
};

// @route POST /api/tasks
const createTask = async (req, res) => {
  const { title, subject, description, dueDate, priority, type } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });

  const task = await Task.create({
    user: req.user._id,
    title,
    subject,
    description,
    dueDate,
    priority,
    type,
  });

  res.status(201).json(task);
};

// @route PUT /api/tasks/:id
const updateTask = async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) return res.status(404).json({ message: "Task not found" });

  Object.assign(task, req.body);
  const updated = await task.save();
  res.json(updated);
};

// @route DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json({ message: "Task deleted" });
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
