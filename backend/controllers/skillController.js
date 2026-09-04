const SkillGap = require("../models/SkillGap");

// Rule-based "career -> required skills" map used for the hackathon prototype.
// In production this would come from a curated database or an AI-generated mapping.
const ROLE_SKILL_MAP = {
  "software developer": ["DSA", "OOP", "DBMS", "Git", "Programming (Java/Python/C++)", "System Design Basics"],
  "frontend developer": ["HTML/CSS", "JavaScript", "React.js", "Responsive Design", "Git", "REST APIs"],
  "backend developer": ["Node.js", "Databases (SQL/NoSQL)", "REST APIs", "System Design Basics", "Authentication", "Git"],
  "full stack developer": ["JavaScript", "React.js", "Node.js", "DBMS", "REST APIs", "Git", "DSA"],
  "data analyst": ["Excel", "SQL", "Python", "Statistics", "Data Visualization", "Power BI/Tableau"],
  "data scientist": ["Python", "Statistics", "Machine Learning", "SQL", "Data Visualization", "Pandas/Numpy"],
  "ai/ml engineer": ["Python", "Machine Learning", "Deep Learning", "Statistics", "DSA", "Model Deployment"],
  "cybersecurity analyst": ["Networking", "Linux", "Security Fundamentals", "Cryptography Basics", "Ethical Hacking Basics"],
  "product manager": ["Communication", "Market Research", "Wireframing", "Analytics", "Prioritisation Frameworks"],
};

const normalise = (s) => s.trim().toLowerCase();

// @route POST /api/skills/analyse
// body: { targetRole, knownSkills: [] }
const analyseSkillGap = async (req, res) => {
  const { targetRole, knownSkills = [] } = req.body;
  if (!targetRole) return res.status(400).json({ message: "targetRole is required" });

  const key = normalise(targetRole);
  const required = ROLE_SKILL_MAP[key] || [
    "Core fundamentals",
    "Problem solving",
    "Communication",
    "Domain-specific tools",
  ];

  const knownNormalised = knownSkills.map(normalise);
  const missing = required.filter((skill) => !knownNormalised.includes(normalise(skill)));

  const result = await SkillGap.create({
    user: req.user._id,
    targetRole,
    requiredSkills: required,
    knownSkills,
    missingSkills: missing,
  });

  res.status(201).json(result);
};

// @route GET /api/skills/history
const getSkillGapHistory = async (req, res) => {
  const history = await SkillGap.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(history);
};

module.exports = { analyseSkillGap, getSkillGapHistory };
