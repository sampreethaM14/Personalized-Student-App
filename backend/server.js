require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Route modules
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const timetableRoutes = require("./routes/timetableRoutes");
const moodRoutes = require("./routes/moodRoutes");
const skillRoutes = require("./routes/skillRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const groupRoutes = require("./routes/groupRoutes");
const groupContentRoutes = require("./routes/groupContentRoutes");
const aiRoutes = require("./routes/aiRoutes");

// --------------------------------------------------
// Connect to MongoDB
// --------------------------------------------------
connectDB();

// --------------------------------------------------
// Initialize Express
// --------------------------------------------------
const app = express();

// --------------------------------------------------
// CORS Configuration
// --------------------------------------------------
const allowedOrigins = [
  "http://localhost:5173",
  "https://personalized-student-app.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an Origin header
      // (Postman, server-to-server requests, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log(`CORS blocked origin: ${origin}`);
      return callback(new Error(`CORS blocked: ${origin}`));
    },

    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],

    credentials: true,
  })
);

// --------------------------------------------------
// Body Parser
// --------------------------------------------------
app.use(express.json());

// --------------------------------------------------
// Health Check
// --------------------------------------------------
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Personalised Student App API is running",
  });
});

// --------------------------------------------------
// API Routes
// --------------------------------------------------
app.use("/api/auth", authRoutes);

app.use("/api/tasks", taskRoutes);

app.use("/api/timetable", timetableRoutes);

app.use("/api/mood", moodRoutes);

app.use("/api/skills", skillRoutes);

app.use("/api/resources", resourceRoutes);

app.use("/api/groups", groupRoutes);

app.use("/api/groups", groupContentRoutes);

app.use("/api/ai", aiRoutes);

// --------------------------------------------------
// Error Handling
// --------------------------------------------------
app.use(notFound);
app.use(errorHandler);

// --------------------------------------------------
// Start Server
// --------------------------------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});