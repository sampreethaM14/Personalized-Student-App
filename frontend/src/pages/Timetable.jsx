import React, { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Coffee,
  GraduationCap,
  Layers3,
  Loader2,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
} from "lucide-react";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const emptyForm = {
  day: "Monday",
  startTime: "",
  endTime: "",
  subject: "",
  activityType: "self-study",
};

const ACTIVITY_STYLES = {
  class: {
    wrapper:
      "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300",
    icon: GraduationCap,
  },
  "self-study": {
    wrapper:
      "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    icon: Sparkles,
  },
  revision: {
    wrapper:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    icon: RefreshCw,
  },
  break: {
    wrapper:
      "border-slate-400/20 bg-slate-400/10 text-slate-600 dark:text-slate-300",
    icon: Coffee,
  },
  other: {
    wrapper:
      "border-border-default bg-surface-muted text-secondary",
    icon: Layers3,
  },
};

// Helper function to convert 24-hour time (HH:mm) to 12-hour format (hh:mm AM/PM)
const formatTime12Hour = (time24) => {
  if (!time24) return "";
  const [hours, minutes] = time24.split(":");
  let h = parseInt(hours, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12; // Convert 0 to 12 for midnight, and >12 to 1-11
  const paddedH = h < 10 ? `0${h}` : h;
  return `${paddedH}:${minutes} ${ampm}`;
};

// Helper function to convert time string to total minutes for accurate comparison
const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours * 60) + minutes;
};

const Timetable = () => {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState(null);
  const [error, setError] = useState("");

  const loadEntries = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/timetable");
      setEntries(data);
    } catch (err) {
      console.error("Error loading timetable:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load your timetable. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.startTime || !form.endTime || !form.subject.trim()) {
      setError("Please fill in all the fields.");
      return;
    }

    // Accurate mathematical comparison of time
    const startMins = timeToMinutes(form.startTime);
    const endMins = timeToMinutes(form.endTime);

    if (startMins >= endMins) {
      setError("Invalid duration: End time must be later than the start time.");
      return;
    }

    try {
      setAdding(true);
      setError("");

      await api.post("/timetable", {
        ...form,
        subject: form.subject.trim(),
      });

      setForm({
        ...emptyForm,
        day: form.day,
      });

      await loadEntries();
    } catch (err) {
      console.error("Error adding timetable entry:", err);
      setError(
        err.response?.data?.message ||
          "Unable to add this timetable block. Please try again."
      );
    } finally {
      setAdding(false);
    }
  };

  const removeEntry = async (id) => {
    try {
      setRemoving(id);
      setError("");

      await api.delete(`/timetable/${id}`);
      await loadEntries();
    } catch (err) {
      console.error("Error removing timetable entry:", err);
      setError(
        err.response?.data?.message ||
          "Unable to remove this timetable block. Please try again."
      );
    } finally {
      setRemoving(null);
    }
  };

  const entriesByDay = useMemo(() => {
    return DAYS.reduce((acc, day) => {
      acc[day] = entries
        .filter((entry) => entry.day === day)
        .sort((a, b) =>
          a.startTime.localeCompare(b.startTime)
        );

      return acc;
    }, {});
  }, [entries]);

  const scheduledDays = DAYS.filter(
    (day) => entriesByDay[day]?.length > 0
  ).length;

  const totalBlocks = entries.length;

  const studyBlocks = entries.filter(
    (entry) =>
      entry.activityType === "self-study" ||
      entry.activityType === "revision"
  ).length;

  const getActivityStyle = (activityType) => {
    return (
      ACTIVITY_STYLES[activityType] ||
      ACTIVITY_STYLES.other
    );
  };

  return (
    <Layout
      title="Timetable"
      subtitle="Your personalised weekly schedule."
    >
      <div className="mx-auto w-full max-w-7xl space-y-6">
        {/* =====================================================
            HERO
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
                  <CalendarDays size={25} />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-xl font-semibold text-primary-text sm:text-2xl">
                      Structure your week
                    </h2>

                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">
                      <Sparkles size={11} />
                      Personalised
                    </span>
                  </div>

                  <p className="mt-1 max-w-2xl text-sm leading-relaxed text-secondary">
                    Build a balanced weekly routine with classes, focused
                    study sessions, revision and intentional breaks.
                  </p>
                </div>
              </div>

              {/* Summary stats */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="rounded-xl bg-surface-muted px-4 py-3 text-center">
                  <p className="text-lg font-bold text-primary-text">
                    {totalBlocks}
                  </p>
                  <p className="text-[10px] text-secondary">
                    Blocks
                  </p>
                </div>

                <div className="rounded-xl bg-surface-muted px-4 py-3 text-center">
                  <p className="text-lg font-bold text-primary-text">
                    {scheduledDays}
                  </p>
                  <p className="text-[10px] text-secondary">
                    Days
                  </p>
                </div>

                <div className="rounded-xl bg-surface-muted px-4 py-3 text-center">
                  <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                    {studyBlocks}
                  </p>
                  <p className="text-[10px] text-secondary">
                    Study
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Error Message Display */}
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300 font-medium shadow-sm"
          >
            {error}
          </div>
        )}

        {/* =====================================================
            MAIN CONTENT
            ===================================================== */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
          {/* ===================================================
              ADD BLOCK FORM
              =================================================== */}
          <section className="lg:col-span-1">
            <form
              onSubmit={handleSubmit}
              className="card h-fit w-full"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Plus size={18} />
                </div>

                <div>
                  <h2 className="font-display text-lg font-semibold text-primary-text">
                    Add a block
                  </h2>

                  <p className="text-[11px] text-secondary">
                    Schedule part of your day.
                  </p>
                </div>
              </div>

              {/* Day */}
              <div className="mb-4">
                <label htmlFor="timetable-day" className="label">
                  Day
                </label>

                <select
                  id="timetable-day"
                  className="input-field w-full"
                  value={form.day}
                  onChange={(e) => {
                    setError("");
                    setForm({ ...form, day: e.target.value });
                  }}
                >
                  {DAYS.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time */}
              <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div className="w-full">
                  <label htmlFor="timetable-start" className="label">
                    Start
                  </label>

                  <div className="relative w-full">
                    <Clock3
                      size={14}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
                    />

                    <input
                      id="timetable-start"
                      type="time"
                      required
                      className="input-field w-full pl-9"
                      value={form.startTime}
                      onChange={(e) => {
                        setError("");
                        setForm({ ...form, startTime: e.target.value });
                      }}
                    />
                  </div>
                </div>

                <div className="w-full">
                  <label htmlFor="timetable-end" className="label">
                    End
                  </label>

                  <div className="relative w-full">
                    <Clock3
                      size={14}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
                    />

                    <input
                      id="timetable-end"
                      type="time"
                      required
                      className="input-field w-full pl-9"
                      value={form.endTime}
                      onChange={(e) => {
                        setError("");
                        setForm({ ...form, endTime: e.target.value });
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className="mb-4 w-full">
                <label htmlFor="timetable-subject" className="label">
                  Subject / activity
                </label>

                <input
                  id="timetable-subject"
                  required
                  className="input-field w-full"
                  value={form.subject}
                  onChange={(e) => {
                    setError("");
                    setForm({ ...form, subject: e.target.value });
                  }}
                  placeholder="DBMS"
                />
              </div>

              {/* Activity type */}
              <div className="mb-6 w-full">
                <label htmlFor="timetable-type" className="label">
                  Type
                </label>

                <select
                  id="timetable-type"
                  className="input-field w-full"
                  value={form.activityType}
                  onChange={(e) => {
                    setError("");
                    setForm({ ...form, activityType: e.target.value });
                  }}
                >
                  <option value="class">Class</option>
                  <option value="self-study">Self-study</option>
                  <option value="revision">Revision</option>
                  <option value="break">Break</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={adding}
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
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Add to timetable
                  </>
                )}
              </button>
            </form>

            {/* Legend */}
            <div className="mt-4 rounded-2xl border border-border-default bg-surface p-4 shadow-sm w-full">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-secondary">
                Activity types
              </p>

              <div className="space-y-2">
                {[
                  ["class", "Class"],
                  ["self-study", "Self-study"],
                  ["revision", "Revision"],
                  ["break", "Break"],
                  ["other", "Other"],
                ].map(([type, label]) => {
                  const style = getActivityStyle(type);
                  const Icon = style.icon;

                  return (
                    <div
                      key={type}
                      className="flex items-center gap-2 text-[10px] text-secondary"
                    >
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-md ${style.wrapper}`}
                      >
                        <Icon size={12} />
                      </span>
                      {label}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ===================================================
              WEEKLY TIMETABLE
              =================================================== */}
          <section className="min-w-0 lg:col-span-3">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-semibold text-primary-text">
                  Weekly schedule
                </h2>

                <p className="mt-1 text-xs text-secondary">
                  Keep your week visible and make room for focused learning.
                </p>
              </div>

              {!loading && totalBlocks > 0 && (
                <span className="hidden rounded-full bg-surface-muted px-3 py-1.5 text-[10px] font-semibold text-secondary sm:inline-flex">
                  {totalBlocks} scheduled{" "}
                  {totalBlocks === 1 ? "block" : "blocks"}
                </span>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="h-44 animate-pulse rounded-2xl border border-border-default bg-surface-muted w-full"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {DAYS.map((day) => {
                  const dayEntries = entriesByDay[day] || [];
                  const isToday =
                    DAYS[new Date().getDay() - 1] === day ||
                    (new Date().getDay() === 0 && day === "Sunday");

                  return (
                    <article
                      key={day}
                      className={`
                        w-full rounded-2xl border bg-surface p-4 shadow-sm
                        transition-all duration-150
                        ${
                          isToday
                            ? "border-amber-400/50"
                            : "border-border-default"
                        }
                      `}
                    >
                      {/* Day header */}
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`
                              flex h-9 w-9 items-center justify-center rounded-lg
                              ${
                                isToday
                                  ? "bg-amber-400/15 text-amber-600 dark:text-amber-400"
                                  : "bg-surface-muted text-secondary"
                              }
                            `}
                          >
                            <CalendarDays size={16} />
                          </div>

                          <div>
                            <h3 className="text-sm font-semibold text-primary-text">
                              {day}
                            </h3>

                            {isToday && (
                              <p className="text-[9px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                                Today
                              </p>
                            )}
                          </div>
                        </div>

                        <span className="rounded-full bg-surface-muted px-2 py-1 text-[9px] font-semibold text-secondary">
                          {dayEntries.length}
                        </span>
                      </div>

                      {/* Entries */}
                      <div className="space-y-2">
                        {dayEntries.length === 0 ? (
                          <div className="rounded-xl border border-dashed border-border-default bg-surface-muted/30 px-3 py-6 text-center w-full">
                            <Clock3
                              size={16}
                              className="mx-auto text-secondary"
                            />

                            <p className="mt-2 text-[10px] text-secondary">
                              No blocks scheduled.
                            </p>
                          </div>
                        ) : (
                          dayEntries.map((entry) => {
                            const style = getActivityStyle(
                              entry.activityType
                            );
                            const Icon = style.icon;

                            return (
                              <div
                                key={entry._id}
                                className={`
                                  group relative w-full rounded-xl border p-3
                                  ${style.wrapper}
                                  transition-all duration-150
                                  hover:shadow-sm
                                `}
                              >
                                <div className="flex items-start gap-2.5">
                                  <div className="mt-0.5 shrink-0">
                                    <Icon size={14} />
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                                      {formatTime12Hour(entry.startTime)} – {formatTime12Hour(entry.endTime)}
                                    </p>

                                    <p className="mt-1 break-words text-xs font-semibold">
                                      {entry.subject}
                                    </p>
                                  </div>

                                  <button
                                    type="button"
                                    disabled={removing === entry._id}
                                    onClick={() =>
                                      removeEntry(entry._id)
                                    }
                                    className="
                                      flex h-6 w-6 shrink-0
                                      items-center justify-center
                                      rounded-md opacity-40
                                      transition
                                      hover:bg-red-500/10
                                      hover:text-red-500
                                      hover:opacity-100
                                      disabled:opacity-50
                                    "
                                    aria-label={`Remove ${entry.subject} from ${day}`}
                                  >
                                    {removing === entry._id ? (
                                      <Loader2
                                        size={12}
                                        className="animate-spin"
                                      />
                                    ) : (
                                      <Trash2 size={12} />
                                    )}
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* =====================================================
            EMPTY STATE / FOOTER TIP
            ===================================================== */}
        {!loading && entries.length === 0 && (
          <section className="w-full rounded-2xl border border-dashed border-border-default bg-surface p-6 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CheckCircle2 size={20} />
            </div>

            <h3 className="mt-3 text-sm font-semibold text-primary-text">
              Your timetable is ready to be built
            </h3>

            <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-secondary">
              Add classes, study sessions and revision blocks from the form
              above. A visible weekly structure can make your study routine
              easier to maintain.
            </p>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default Timetable;