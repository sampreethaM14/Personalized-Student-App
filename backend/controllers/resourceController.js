const Resource = require("../models/Resource");

// @route GET /api/resources?category=academic|skill|placement|interview
const getResources = async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  const resources = await Resource.find(filter).sort({ createdAt: -1 });
  res.json(resources);
};

// @route POST /api/resources
const createResource = async (req, res) => {
  const { title, description, url, category, tags } = req.body;
  if (!title || !url) return res.status(400).json({ message: "title and url are required" });

  const resource = await Resource.create({
    title,
    description,
    url,
    category,
    tags,
    addedBy: req.user._id,
  });

  res.status(201).json(resource);
};

// @route DELETE /api/resources/:id
const deleteResource = async (req, res) => {
  const resource = await Resource.findOneAndDelete({ _id: req.params.id, addedBy: req.user._id });
  if (!resource) return res.status(404).json({ message: "Resource not found or not owned by you" });
  res.json({ message: "Resource deleted" });
};

module.exports = { getResources, createResource, deleteResource };
