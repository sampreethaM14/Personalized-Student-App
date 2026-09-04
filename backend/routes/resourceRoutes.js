const express = require("express");
const { getResources, createResource, deleteResource } = require("../controllers/resourceController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getResources);
router.post("/", protect, createResource);
router.delete("/:id", protect, deleteResource);

module.exports = router;
