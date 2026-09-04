# Personalised Student App

**VIGYAN '26 Project Expo — Karpagam College of Engineering**
Team: Thilshath Rihana N • Sampreetha • Yuvarani • Harini Saravanan

> Your Personal Companion for Academic & Career Success
> Plan Better. Learn Smarter. Grow Together.

A full-stack MERN application built from the project's pitch deck. It brings
academics, wellbeing, skills, and career prep into one personalised platform.

## Modules (mapped from the pitch deck)

| Deck feature        | Where it lives                                   |
|----------------------|---------------------------------------------------|
| Study Planner / To-Do | `Task` model, `/api/tasks`, Study Planner page   |
| Timetable             | `TimetableEntry` model, `/api/timetable`         |
| Emotion Tracker / Burnout Monitor | `MoodLog` model, `/api/mood`, `/api/mood/burnout-status` |
| Skill Gap analysis    | `SkillGap` model, `/api/skills/analyse`          |
| AI Assistant          | `/api/ai/chat` (uses a real AI API key if provided, otherwise a rule-based fallback so the app always works) |
| Learning Hub / Placement Prep | `Resource` model, `/api/resources`       |
| Study Groups          | `StudyGroup` model, `/api/groups`                |

## Tech stack

- **Frontend:** React 18 + Vite + React Router + Tailwind CSS + Axios
- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas (via Mongoose)
- **Auth:** JWT + bcrypt password hashing
- **AI layer:** pluggable — set `AI_API_KEY` to call a real chat-completions API, or leave blank to use the built-in rule-based assistant

## Project structure

```
student-app/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── middleware/                # auth + error handling
│   ├── models/                    # Mongoose schemas
│   ├── controllers/               # route logic
│   ├── routes/                    # Express routers
│   ├── utils/generateToken.js
│   ├── server.js                  # app entry point
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/axios.js           # pre-configured axios instance (adds JWT)
    │   ├── context/AuthContext.jsx
    │   ├── components/            # Layout, Sidebar, Topbar, cards...
    │   ├── pages/                 # one page per module
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── tailwind.config.js
    ├── package.json
    └── .env.example
```

## Getting started

### 1. Backend

```bash
cd backend
cp .env.example .env
# then edit .env: set MONGO_URI (MongoDB Atlas connection string) and JWT_SECRET
npm install
npm run dev        # starts on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env   # defaults to http://localhost:5000/api, edit if needed
npm install
npm run dev        # starts on http://localhost:5173
```

Open `http://localhost:5173`, register a student account, and explore the
Dashboard, Study Planner, Timetable, Emotion Tracker, Skill Gap, AI
Assistant, Placement Prep, Learning Hub, and Study Groups pages.

### 3. (Optional) Enable a real AI model

By default `AI_API_KEY` is empty, so the AI Assistant uses a rule-based
fallback that still personalises replies using the student's tasks, mood,
and goals. To connect a real model, set in `backend/.env`:

```
AI_API_KEY=your_key_here
AI_API_URL=https://api.openai.com/v1/chat/completions
AI_MODEL=gpt-4o-mini
```

Any OpenAI-compatible chat-completions endpoint works.

## Notes for the demo / report

- This matches the deck's "Hackathon prototype" scope (slide 7): the full
  frontend experience plus MongoDB Atlas + AI API flow are implemented, with
  room to layer on more advanced backend features next.
- The Skill Gap engine uses a curated role → required-skills map for the
  prototype; this is a natural place to swap in an AI-generated mapping later.
- The Burnout Monitor uses a simple rule (average of the last 7 mood
  check-ins) — described in code comments in `moodController.js` for the
  report/viva.
