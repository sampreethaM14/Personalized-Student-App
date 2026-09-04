require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Route modules — one per feature from the VIGYAN'26 pitch deck
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const timetableRoutes = require("./routes/timetableRoutes");
const moodRoutes = require("./routes/moodRoutes");
const skillRoutes = require("./routes/skillRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const groupRoutes = require("./routes/groupRoutes");
const groupContentRoutes = require("./routes/groupContentRoutes");
const aiRoutes = require("./routes/aiRoutes");

connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Personalised Student App API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/mood", moodRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/groups", groupContentRoutes);
app.use("/api/ai", aiRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
