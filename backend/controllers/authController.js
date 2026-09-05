const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc  Register a new student
// @route POST /api/auth/register
const registerUser = async (req, res) => {
  const { name, email, password, academicGoal, careerInterest, interests } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: "An account with this email already exists" });
  }

  const user = await User.create({
    name,
    email,
    password,
    academicGoal,
    careerInterest,
    interests,
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    academicGoal: user.academicGoal,
    careerInterest: user.careerInterest,
    token: generateToken(user._id),
  });
};

// @desc  Login and receive a JWT
// @route POST /api/auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    academicGoal: user.academicGoal,
    careerInterest: user.careerInterest,
    token: generateToken(user._id),
  });
};

// @desc  Get the logged-in student's profile
// @route GET /api/auth/me
const getProfile = async (req, res) => {
  res.json(req.user);
};

// @desc  Update profile / personalisation signals
// @route PUT /api/auth/me
const updateProfile = async (req, res) => {
  try {
    const { name, academicGoal, careerInterest, interests } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the fields
    user.name = name || user.name;
    user.academicGoal = academicGoal || user.academicGoal;
    user.careerInterest = careerInterest || user.careerInterest;
    
    if (interests) {
      user.interests = interests;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        academicGoal: updatedUser.academicGoal,
        careerInterest: updatedUser.careerInterest,
        interests: updatedUser.interests,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

module.exports = { registerUser, loginUser, getProfile, updateProfile };
