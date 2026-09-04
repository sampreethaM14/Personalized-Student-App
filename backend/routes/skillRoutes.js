const express = require("express");
const { analyseSkillGap, getSkillGapHistory } = require("../controllers/skillController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);

router.post("/analyse", analyseSkillGap);
router.get("/history", getSkillGapHistory);

module.exports = router;
