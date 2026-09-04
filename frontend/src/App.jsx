import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import StudyPlanner from "./pages/StudyPlanner";
import Timetable from "./pages/Timetable";
import EmotionTracker from "./pages/EmotionTracker";
import SkillGap from "./pages/SkillGap";
import AIAssistant from "./pages/AIAssistant";
import PlacementPrep from "./pages/PlacementPrep";
import LearningHub from "./pages/LearningHub";
import StudyGroups from "./pages/StudyGroups";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/planner" element={<ProtectedRoute><StudyPlanner /></ProtectedRoute>} />
      <Route path="/timetable" element={<ProtectedRoute><Timetable /></ProtectedRoute>} />
      <Route path="/emotion" element={<ProtectedRoute><EmotionTracker /></ProtectedRoute>} />
      <Route path="/skills" element={<ProtectedRoute><SkillGap /></ProtectedRoute>} />
      <Route path="/assistant" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
      <Route path="/placement" element={<ProtectedRoute><PlacementPrep /></ProtectedRoute>} />
      <Route path="/learning-hub" element={<ProtectedRoute><LearningHub /></ProtectedRoute>} />
      <Route path="/groups" element={<ProtectedRoute><StudyGroups /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
