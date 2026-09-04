import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  HeartPulse,
  ListTodo,
  Sparkles,
  Target,
} from "lucide-react";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [burnout, setBurnout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [taskRes, burnoutRes] = await Promise.all([
          api.get("/tasks"),
          api.get("/mood/burnout-status"),
        ]);

        setTasks(taskRes.data);
        setBurnout(burnoutRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const pending = tasks.filter((task) => task.status !== "completed");
  const completed = tasks.filter((task) => task.status === "completed");
  const highPriority = pending.filter((task) => task.priority === "high");

  const firstName = user?.name?.split(" ")[0] || "Student";

  const wellbeingStatus =
    burnout?.status === "no-data"
      ? "No data"
      : burnout?.status?.replace("-", " ") || "—";

  const quickLinks = [
    {
      to: "/planner",
      title: "Study Planner",
      desc: "Organise your daily & weekly study",
      icon: ListTodo,
    },
    {
      to: "/emotion",
      title: "Emotion Tracker",
      desc: "Check in with your wellbeing",
      icon: HeartPulse,
    },
    {
      to: "/skills",
      title: "Skill Gap",
      desc: "Discover skills to strengthen",
      icon: Target,
    },
    {
      to: "/assistant",
      title: "AI Assistant",
      desc: "Get personalised guidance",
      icon: Sparkles,
    },
  ];

  return (
    <Layout
      title={`Welcome back, ${firstName}`}
      subtitle="One platform for your whole academic journey."
    >
      <div className="space-y-6">
        {/* =====================================================
            Welcome Banner
            ===================================================== */}
        <section
          className="
            relative overflow-hidden rounded-2xl
            border border-border-default
            bg-surface
            shadow-sm
          "
        >
          <div
            className="
              pointer-events-none absolute -right-20 -top-24
              h-64 w-64 rounded-full
              bg-amber-400/10 blur-3xl
            "
            aria-hidden="true"
          />

          <div className="relative flex flex-col gap-4 px-5 py-5 sm:px-6 sm:py-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div
                className="
                  flex h-11 w-11 shrink-0 items-center justify-center
                  rounded-xl bg-amber-400 text-ink-950
                  shadow-sm
                "
                aria-hidden="true"
              >
                <Sparkles size={21} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Your learning journey
                </p>

                <h2 className="mt-1 font-display text-xl font-semibold text-primary-text sm:text-2xl">
                  Keep moving forward, {firstName}.
                </h2>

                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-secondary">
                  Stay organised, take care of your wellbeing, and make
                  steady progress toward your goals.
                </p>
              </div>
            </div>

            <Link
              to="/planner"
              className="
                inline-flex shrink-0 items-center justify-center gap-2
                rounded-xl bg-ink-900 px-4 py-2.5
                text-sm font-semibold text-white
                transition-all duration-150
                hover:bg-ink-800
                active:scale-[0.98]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-amber-500
                focus-visible:ring-offset-2
                dark:bg-amber-500 dark:text-ink-950
                dark:hover:bg-amber-400
              "
            >
              View planner
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>

        {/* =====================================================
            Statistics
            ===================================================== */}
        <section aria-label="Academic overview">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-primary-text">
                Your overview
              </h2>

              <p className="mt-0.5 text-xs text-secondary">
                A quick look at where you are today.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Pending tasks"
              value={loading ? "—" : pending.length}
              hint="Across planner & to-do"
            />

            <StatCard
              label="Completed"
              value={loading ? "—" : completed.length}
              hint="Great progress so far"
            />

            <StatCard
              label="High priority"
              value={loading ? "—" : highPriority.length}
              hint={
                highPriority.length > 0
                  ? "Needs attention soon"
                  : "You're all caught up"
              }
              accent
            />

            <StatCard
              label="Wellbeing status"
              value={loading ? "—" : wellbeingStatus}
              hint={
                burnout?.message || "Log your mood to see personalised insights"
              }
            />
          </div>
        </section>

        {/* =====================================================
            Main Dashboard
            ===================================================== */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          {/* Upcoming tasks */}
          <section className="card xl:col-span-2">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <CalendarDays size={18} aria-hidden="true" />
                  </div>

                  <h2 className="font-display text-lg font-semibold text-primary-text">
                    Upcoming tasks
                  </h2>
                </div>

                <p className="mt-2 text-xs text-secondary">
                  Focus on what needs your attention next.
                </p>
              </div>

              <Link
                to="/planner"
                className="
                  hidden items-center gap-1 text-xs font-semibold
                  text-primary transition-colors
                  hover:text-primary-hover sm:inline-flex
                "
              >
                View all
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3" aria-label="Loading tasks">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="
                      h-[62px] animate-pulse rounded-xl
                      bg-surface-muted
                    "
                  />
                ))}
              </div>
            ) : pending.length === 0 ? (
              <div
                className="
                  flex flex-col items-center justify-center
                  rounded-xl border border-dashed
                  border-border-default
                  bg-surface-muted/50 px-5 py-10 text-center
                "
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={22} />
                </div>

                <p className="text-sm font-semibold text-primary-text">
                  You're all caught up!
                </p>

                <p className="mt-1 max-w-sm text-xs leading-relaxed text-secondary">
                  Nothing is pending right now. Add a task when you're ready
                  for your next study goal.
                </p>

                <Link
                  to="/planner"
                  className="
                    mt-4 inline-flex items-center gap-2
                    rounded-lg bg-amber-500 px-3.5 py-2
                    text-xs font-semibold text-ink-950
                    transition hover:bg-amber-400
                  "
                >
                  Add a task
                  <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-border-default">
                {pending.slice(0, 5).map((task) => (
                  <li
                    key={task._id}
                    className="
                      group flex items-center justify-between
                      gap-4 py-3.5 first:pt-0 last:pb-0
                    "
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`
                          h-2 w-2 shrink-0 rounded-full
                          ${
                            task.priority === "high"
                              ? "bg-red-500"
                              : task.priority === "medium"
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                          }
                        `}
                        aria-hidden="true"
                      />

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-primary-text">
                          {task.title}
                        </p>

                        {task.subject && (
                          <p className="mt-0.5 truncate text-xs text-secondary">
                            {task.subject}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <Clock3
                        size={13}
                        className="hidden text-secondary sm:block"
                        aria-hidden="true"
                      />

                      <span className="text-xs font-medium text-secondary">
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString(
                              undefined,
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "No date"}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <Link
              to="/planner"
              className="
                mt-5 inline-flex items-center gap-2
                text-sm font-semibold text-amber-600
                transition-colors hover:text-amber-700
                dark:text-amber-400 dark:hover:text-amber-300
              "
            >
              Go to Study Planner
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </section>

          {/* Quick access */}
          <section className="card">
            <div className="mb-5">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400/15 text-amber-600 dark:text-amber-400">
                  <Sparkles size={18} aria-hidden="true" />
                </div>

                <h2 className="font-display text-lg font-semibold text-primary-text">
                  Quick access
                </h2>
              </div>

              <p className="mt-2 text-xs text-secondary">
                Jump straight to the tools you use most.
              </p>
            </div>

            <div className="space-y-2.5">
              {quickLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="
                      group flex items-center gap-3
                      rounded-xl border border-border-default
                      bg-surface-muted/40 p-3.5
                      transition-all duration-150
                      hover:-translate-y-0.5
                      hover:border-amber-400/60
                      hover:bg-amber-400/5
                      hover:shadow-sm
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-amber-500
                    "
                  >
                    <span
                      className="
                        flex h-9 w-9 shrink-0 items-center justify-center
                        rounded-lg bg-surface text-secondary
                        transition-colors
                        group-hover:bg-amber-400/15
                        group-hover:text-amber-600
                        dark:group-hover:text-amber-400
                      "
                    >
                      <Icon size={17} aria-hidden="true" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-primary-text">
                        {link.title}
                      </span>

                      <span className="mt-0.5 block truncate text-xs text-secondary">
                        {link.desc}
                      </span>
                    </span>

                    <ArrowRight
                      size={15}
                      className="
                        shrink-0 text-secondary/50
                        transition-all duration-150
                        group-hover:translate-x-0.5
                        group-hover:text-amber-500
                      "
                      aria-hidden="true"
                    />
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;