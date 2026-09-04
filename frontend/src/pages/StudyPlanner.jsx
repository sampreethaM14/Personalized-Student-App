import React, { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import TaskCard from "../components/TaskCard";
import api from "../api/axios";
import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  ListTodo,
  Plus,
  Sparkles,
  Target,
} from "lucide-react";

const emptyForm = {
  title: "",
  subject: "",
  dueDate: "",
  priority: "medium",
  type: "study",
};

const StudyPlanner = () => {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const loadTasks = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/tasks");
      setTasks(data);
    } catch (err) {
      console.error("Error loading tasks:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load your tasks. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) return;

    try {
      setAdding(true);
      setError("");

      await api.post("/tasks", {
        ...form,
        title: form.title.trim(),
        subject: form.subject.trim(),
      });

      setForm(emptyForm);
      await loadTasks();
    } catch (err) {
      console.error("Error adding task:", err);
      setError(
        err.response?.data?.message ||
          "Unable to add the task. Please try again."
      );
    } finally {
      setAdding(false);
    }
  };

  const toggleStatus = async (task) => {
    try {
      setError("");

      const status =
        task.status === "completed" ? "pending" : "completed";

      await api.put(`/tasks/${task._id}`, { status });
      await loadTasks();
    } catch (err) {
      console.error("Error updating task:", err);
      setError(
        err.response?.data?.message ||
          "Unable to update the task. Please try again."
      );
    }
  };

  const deleteTask = async (task) => {
    try {
      setError("");

      await api.delete(`/tasks/${task._id}`);
      await loadTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
      setError(
        err.response?.data?.message ||
          "Unable to delete the task. Please try again."
      );
    }
  };

  const filtered = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "pending") return task.status !== "completed";
    if (filter === "completed") return task.status === "completed";
    return true;
  });

  const stats = useMemo(() => {
    const completed = tasks.filter(
      (task) => task.status === "completed"
    ).length;

    const pending = tasks.length - completed;

    const highPriority = tasks.filter(
      (task) =>
        task.status !== "completed" && task.priority === "high"
    ).length;

    return {
      total: tasks.length,
      completed,
      pending,
      highPriority,
    };
  }, [tasks]);

  const filterLabels = {
    all: "All tasks",
    pending: "Pending",
    completed: "Completed",
  };

  return (
    <Layout
      title="Study Planner"
      subtitle="Organise daily and weekly study — and track deadlines."
    >
      <div className="mx-auto w-full max-w-7xl space-y-6">
        {/* =====================================================
            Hero
            ===================================================== */}
        <section className="relative overflow-hidden rounded-2xl border border-border-default bg-surface shadow-sm">
          <div
            className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative px-5 py-6 sm:px-7 sm:py-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-600 dark:text-amber-400">
                  <ClipboardList size={25} />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-xl font-semibold text-primary-text sm:text-2xl">
                      Plan your progress
                    </h2>

                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">
                      <Sparkles size={11} />
                      Stay focused
                    </span>
                  </div>

                  <p className="mt-1 max-w-2xl text-sm leading-relaxed text-secondary">
                    Turn your academic goals into manageable tasks, keep track
                    of deadlines and build a study routine that you can
                    actually maintain.
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                <div className="rounded-xl bg-surface-muted px-3 py-3 text-center">
                  <p className="text-lg font-bold text-primary-text">
                    {stats.total}
                  </p>
                  <p className="text-[10px] text-secondary">Total</p>
                </div>

                <div className="rounded-xl bg-surface-muted px-3 py-3 text-center">
                  <p className="text-lg font-bold text-primary-text">
                    {stats.pending}
                  </p>
                  <p className="text-[10px] text-secondary">Pending</p>
                </div>

                <div className="rounded-xl bg-surface-muted px-3 py-3 text-center">
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {stats.completed}
                  </p>
                  <p className="text-[10px] text-secondary">Done</p>
                </div>

                <div className="rounded-xl bg-surface-muted px-3 py-3 text-center">
                  <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                    {stats.highPriority}
                  </p>
                  <p className="text-[10px] text-secondary">Important</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            Main layout
            ===================================================== */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* ===================================================
              Add task
              =================================================== */}
          <section className="lg:col-span-1">
            <form
              onSubmit={handleSubmit}
              className="card h-fit"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Plus size={18} />
                </div>

                <div>
                  <h2 className="font-display text-lg font-semibold text-primary-text">
                    Add a task
                  </h2>

                  <p className="text-[11px] text-secondary">
                    Add something you want to accomplish.
                  </p>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
                >
                  {error}
                </div>
              )}

              {/* Title */}
              <div className="mb-3">
                <label htmlFor="task-title" className="label">
                  Title
                </label>

                <input
                  id="task-title"
                  required
                  className="input-field"
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                  placeholder="Revise Trees – DSA"
                />
              </div>

              {/* Subject */}
              <div className="mb-3">
                <label htmlFor="task-subject" className="label">
                  Subject
                </label>

                <input
                  id="task-subject"
                  className="input-field"
                  value={form.subject}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      subject: e.target.value,
                    })
                  }
                  placeholder="Data Structures"
                />
              </div>

              {/* Due date */}
              <div className="mb-3">
                <label htmlFor="task-due-date" className="label">
                  Due date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary"
                    aria-hidden="true"
                  />

                  <input
                    id="task-due-date"
                    type="date"
                    className="input-field pl-10"
                    value={form.dueDate}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        dueDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Priority */}
              <div className="mb-3">
                <label htmlFor="task-priority" className="label">
                  Priority
                </label>

                <select
                  id="task-priority"
                  className="input-field"
                  value={form.priority}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      priority: e.target.value,
                    })
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Type */}
              <div className="mb-5">
                <label htmlFor="task-type" className="label">
                  Type
                </label>

                <select
                  id="task-type"
                  className="input-field"
                  value={form.type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      type: e.target.value,
                    })
                  }
                >
                  <option value="study">Study task</option>
                  <option value="todo">To-do</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={adding || !form.title.trim()}
                className="
                  flex w-full items-center justify-center gap-2
                  rounded-xl bg-amber-500 px-4 py-3
                  text-sm font-semibold text-ink-950
                  transition-all duration-200
                  hover:bg-amber-400 hover:shadow-md
                  disabled:cursor-not-allowed disabled:opacity-50
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-amber-500
                  focus-visible:ring-offset-2
                "
              >
                {adding ? (
                  <>
                    <span
                      className="h-4 w-4 animate-spin rounded-full border-2 border-ink-950/30 border-t-ink-950"
                      aria-hidden="true"
                    />
                    Adding task...
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Add task
                  </>
                )}
              </button>
            </form>

            {/* Planning tip */}
            <div className="mt-4 rounded-2xl border border-border-default bg-surface p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-400/15 text-amber-600 dark:text-amber-400">
                  <Target size={16} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-primary-text">
                    Study smarter
                  </p>

                  <p className="mt-1 text-[11px] leading-relaxed text-secondary">
                    Break large topics into smaller tasks. Completing small
                    steps consistently makes bigger goals easier to manage.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ===================================================
              Task list
              =================================================== */}
          <section className="min-w-0 lg:col-span-2">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-display text-xl font-semibold text-primary-text">
                  Your tasks
                </h2>

                <p className="mt-1 text-xs text-secondary">
                  Keep your next actions visible and manageable.
                </p>
              </div>

              <div className="flex items-center gap-1.5 rounded-xl border border-border-default bg-surface p-1">
                {["all", "pending", "completed"].map((f) => {
                  const active = filter === f;

                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFilter(f)}
                      className={`
                        rounded-lg px-3 py-1.5
                        text-[11px] font-semibold
                        transition
                        ${
                          active
                            ? "bg-ink-900 text-white dark:bg-amber-500 dark:text-ink-950"
                            : "text-secondary hover:bg-surface-muted hover:text-primary-text"
                        }
                      `}
                    >
                      {filterLabels[f]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Progress summary */}
            {tasks.length > 0 && (
              <div className="mb-4 rounded-xl border border-border-default bg-surface p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-emerald-500"
                    />

                    <span className="text-xs font-semibold text-primary-text">
                      Overall progress
                    </span>
                  </div>

                  <span className="text-xs font-bold text-primary-text">
                    {Math.round(
                      (stats.completed / tasks.length) * 100
                    )}
                    %
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{
                      width: `${
                        (stats.completed / tasks.length) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-28 animate-pulse rounded-2xl border border-border-default bg-surface-muted"
                  />
                ))}
              </div>
            )}

            {/* Empty */}
            {!loading && filtered.length === 0 && (
              <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-border-default bg-surface p-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  {filter === "completed" ? (
                    <CheckCircle2 size={22} />
                  ) : filter === "pending" ? (
                    <Clock3 size={22} />
                  ) : (
                    <ListTodo size={22} />
                  )}
                </div>

                <h3 className="mt-4 text-sm font-semibold text-primary-text">
                  {filter === "completed"
                    ? "No completed tasks yet"
                    : filter === "pending"
                    ? "You're all caught up"
                    : "Your planner is empty"}
                </h3>

                <p className="mt-1 max-w-sm text-xs leading-relaxed text-secondary">
                  {filter === "completed"
                    ? "Completed tasks will appear here once you finish them."
                    : filter === "pending"
                    ? "Nice work. Add a new task whenever you're ready for the next goal."
                    : "Add your first study task to start organising your day."}
                </p>

                {filter !== "all" && (
                  <button
                    type="button"
                    onClick={() => setFilter("all")}
                    className="mt-4 text-xs font-semibold text-primary hover:underline"
                  >
                    View all tasks
                  </button>
                )}
              </div>
            )}

            {/* Task cards */}
            {!loading && filtered.length > 0 && (
              <div className="space-y-3">
                {filtered.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onToggle={toggleStatus}
                    onDelete={deleteTask}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default StudyPlanner;