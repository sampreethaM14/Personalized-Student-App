import React, { useEffect, useState } from "react";
import {
  Activity,
  BatteryMedium,
  CheckCircle2,
  HeartPulse,
  History,
  Info,
  Save,
  Sparkles,
} from "lucide-react";
import Layout from "../components/Layout";
import api from "../api/axios";

const MOODS = [
  {
    key: "great",
    label: "Great",
    emoji: "😄",
    description: "Feeling positive",
  },
  {
    key: "good",
    label: "Good",
    emoji: "🙂",
    description: "Doing well",
  },
  {
    key: "okay",
    label: "Okay",
    emoji: "😐",
    description: "Could be better",
  },
  {
    key: "stressed",
    label: "Stressed",
    emoji: "😣",
    description: "Feeling pressure",
  },
  {
    key: "burnt-out",
    label: "Burnt out",
    emoji: "🥵",
    description: "Need some rest",
  },
];

const STATUS_STYLES = {
  healthy: {
    wrapper: "border-border-default bg-surface",
    icon: "bg-surface-muted text-secondary",
    badge: "status-badge-healthy",
  },

  "at-risk": {
    wrapper: "border-border-default bg-surface",
    icon: "bg-surface-muted text-secondary",
    badge: "status-badge-at-risk",
  },

  "high-risk": {
    wrapper: "border-border-default bg-surface",
    icon: "bg-surface-muted text-secondary",
    badge: "status-badge-high-risk",
  },

  "no-data": {
    wrapper: "border-border-default bg-surface",
    icon: "bg-surface-muted text-secondary",
    badge: "border-border-default bg-surface-muted text-secondary",
  },
};

const ENERGY_LABELS = {
  1: "Very low",
  2: "Low",
  3: "Moderate",
  4: "Good",
  5: "Excellent",
};

const EmotionTracker = () => {
  const [logs, setLogs] = useState([]);
  const [burnout, setBurnout] = useState(null);
  const [mood, setMood] = useState("okay");
  const [energyLevel, setEnergyLevel] = useState(3);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const [logRes, burnoutRes] = await Promise.all([
        api.get("/mood"),
        api.get("/mood/burnout-status"),
      ]);

      setLogs(logRes.data);
      setBurnout(burnoutRes.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load your wellbeing information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    setSubmitting(true);
    setError("");

    try {
      await api.post("/mood", {
        mood,
        energyLevel,
        note: note.trim(),
      });

      setNote("");
      await load();
    } catch (err) {
      console.error(err);
      setError("We couldn't save your check-in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedMood =
    MOODS.find((item) => item.key === mood) || MOODS[2];

  const statusStyle =
    STATUS_STYLES[burnout?.status] || STATUS_STYLES["no-data"];

  const statusLabel =
    burnout?.status === "no-data"
      ? "No data yet"
      : burnout?.status
        ? burnout.status.replace("-", " ")
        : "—";

  return (
    <Layout
      title="Emotion Tracker"
      subtitle="Check in with yourself and understand your study wellbeing."
    >
      <div className="mx-auto w-full max-w-6xl space-y-6">
        {/* =====================================================
            Intro banner
            ===================================================== */}
        <section className="relative overflow-hidden rounded-2xl border border-border-default bg-surface shadow-sm">
          <div
            className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-amber-400/10 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative flex flex-col gap-4 px-5 py-5 sm:px-6 sm:py-6 md:flex-row md:items-center">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-600 dark:text-amber-400"
              aria-hidden="true"
            >
              <HeartPulse size={25} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-xl font-semibold text-primary-text">
                  Take a moment to check in
                </h2>

                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">
                  <Sparkles size={11} />
                  Self-awareness
                </span>
              </div>

              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-secondary">
                A quick check-in can help you understand your energy,
                recognise patterns, and plan your study time more thoughtfully.
              </p>
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
          >
            <Info size={17} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* =====================================================
            Main content
            ===================================================== */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* ===================================================
              Check-in form
              =================================================== */}
          <form
            onSubmit={handleSubmit}
            className="card lg:col-span-1"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <HeartPulse size={18} aria-hidden="true" />
              </div>

              <div>
                <h2 className="font-display text-lg font-semibold text-primary-text">
                  How are you feeling?
                </h2>
                <p className="text-xs text-secondary">
                  Choose what feels closest today.
                </p>
              </div>
            </div>

            {/* Mood selection */}
            <div
              className="grid grid-cols-5 gap-1.5 sm:gap-2"
              role="radiogroup"
              aria-label="Current mood"
            >
              {MOODS.map((item) => {
                const isSelected = mood === item.key;

                return (
                  <button
                    type="button"
                    key={item.key}
                    onClick={() => setMood(item.key)}
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`${item.label}: ${item.description}`}
                    title={item.description}
                    className={`
                      group relative flex min-h-[78px]
                      flex-col items-center justify-center gap-1
                      rounded-xl border p-1.5
                      text-center transition-all duration-150
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-amber-500
                      focus-visible:ring-offset-2
                      ${
                        isSelected
                          ? "border-amber-500 bg-amber-400/10 shadow-sm"
                          : "border-border-default bg-surface hover:border-amber-400/50 hover:bg-surface-muted"
                      }
                    `}
                  >
                    {isSelected && (
                      <span
                        className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-amber-500"
                        aria-hidden="true"
                      />
                    )}

                    <span
                      className={`
                        text-2xl transition-transform duration-150
                        ${isSelected ? "scale-110" : "group-hover:scale-105"}
                      `}
                      aria-hidden="true"
                    >
                      {item.emoji}
                    </span>

                    <span
                      className={`text-[10px] font-semibold sm:text-xs ${
                        isSelected
                          ? "text-amber-700 dark:text-amber-300"
                          : "text-primary-text"
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected mood */}
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-surface-muted px-3 py-2">
              <span className="text-base" aria-hidden="true">
                {selectedMood.emoji}
              </span>

              <p className="text-xs text-secondary">
                You selected{" "}
                <span className="font-semibold text-primary-text">
                  {selectedMood.label}
                </span>
                .
              </p>
            </div>

            {/* Energy */}
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="energy-level"
                  className="label mb-0"
                >
                  Energy level
                </label>

                <span className="rounded-full bg-amber-400/15 px-2 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                  {energyLevel}/5
                </span>
              </div>

              <div className="flex items-center gap-3">
                <BatteryMedium
                  size={18}
                  className="shrink-0 text-secondary"
                  aria-hidden="true"
                />

                <input
                  id="energy-level"
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={energyLevel}
                  onChange={(e) =>
                    setEnergyLevel(Number(e.target.value))
                  }
                  className="
                    h-2 w-full cursor-pointer appearance-none
                    rounded-full bg-surface-muted
                    accent-amber-500
                  "
                  aria-label={`Energy level ${energyLevel} out of 5`}
                />
              </div>

              <div className="mt-2 flex justify-between text-[10px] text-secondary">
                <span>Low energy</span>
                <span className="font-medium text-primary-text">
                  {ENERGY_LABELS[energyLevel]}
                </span>
                <span>High energy</span>
              </div>
            </div>

            {/* Note */}
            <div className="mt-6">
              <label htmlFor="mood-note" className="label">
                Note <span className="font-normal normal-case">(optional)</span>
              </label>

              <textarea
                id="mood-note"
                className="input-field resize-none"
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's on your mind?"
                maxLength={500}
              />

              <div className="mt-1 flex justify-end">
                <span className="text-[10px] text-secondary">
                  {note.length}/500
                </span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="
                btn-accent mt-2 w-full gap-2
                disabled:cursor-not-allowed
              "
            >
              {submitting ? (
                <>
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-ink-950/30 border-t-ink-950"
                    aria-hidden="true"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} aria-hidden="true" />
                  Log mood
                </>
              )}
            </button>
          </form>

          {/* ===================================================
              Right column
              =================================================== */}
          <div className="space-y-5 lg:col-span-2">
            {/* Burnout monitor */}
            <section
              className={`rounded-2xl border p-5 shadow-sm ${statusStyle.wrapper}`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${statusStyle.icon}`}
                  >
                    <Activity size={20} aria-hidden="true" />
                  </div>

                  <div>
                    <h2 className="font-display text-lg font-semibold text-primary-text">
                      Wellbeing overview
                    </h2>

                    <p className="mt-1 text-xs text-secondary">
                      Based on your recent check-ins.
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusStyle.badge}`}
                >
                  {statusLabel}
                </span>
              </div>

              <div className="mt-5 rounded-xl bg-surface/60 p-4">
                <p className="text-sm leading-relaxed text-primary-text">
                  {loading
                    ? "Loading your wellbeing information..."
                    : burnout?.message ||
                      "Log a few check-ins to start seeing personalised wellbeing insights."}
                </p>

                {burnout?.averageScore !== null &&
                  burnout?.averageScore !== undefined && (
                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border-default pt-3">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary">
                          Average score
                        </p>

                        <p className="mt-0.5 text-lg font-bold text-primary-text">
                          {burnout.averageScore}
                          <span className="text-xs font-medium text-secondary">
                            /5
                          </span>
                        </p>
                      </div>

                      <div className="h-8 w-px bg-border-default" />

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary">
                          Check-ins
                        </p>

                        <p className="mt-0.5 text-lg font-bold text-primary-text">
                          {burnout.sampleSize}
                        </p>
                      </div>
                    </div>
                  )}
              </div>
            </section>

            {/* Recent check-ins */}
            <section className="card">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <History size={18} aria-hidden="true" />
                  </div>

                  <div>
                    <h2 className="font-display text-lg font-semibold text-primary-text">
                      Recent check-ins
                    </h2>

                    <p className="text-xs text-secondary">
                      Your latest wellbeing entries.
                    </p>
                  </div>
                </div>

                {logs.length > 0 && (
                  <span className="rounded-full bg-surface-muted px-2.5 py-1 text-[10px] font-semibold text-secondary">
                    {logs.length} total
                  </span>
                )}
              </div>

              {loading ? (
                <div className="space-y-3" aria-label="Loading check-ins">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="h-[65px] animate-pulse rounded-xl bg-surface-muted"
                    />
                  ))}
                </div>
              ) : logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-default bg-surface-muted/50 px-5 py-10 text-center">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <HeartPulse size={21} />
                  </div>

                  <p className="text-sm font-semibold text-primary-text">
                    No check-ins yet
                  </p>

                  <p className="mt-1 max-w-sm text-xs leading-relaxed text-secondary">
                    Your check-in history will appear here after you log your
                    first mood.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-border-default">
                  {logs.slice(0, 10).map((log) => {
                    const currentMood = MOODS.find(
                      (item) => item.key === log.mood
                    );

                    return (
                      <li
                        key={log._id}
                        className="
                          flex items-start justify-between
                          gap-4 py-3.5
                          first:pt-0 last:pb-0
                        "
                      >
                        <div className="flex min-w-0 items-start gap-3">
                          <span
                            className="
                              flex h-10 w-10 shrink-0 items-center
                              justify-center rounded-xl
                              bg-surface-muted text-xl
                            "
                            aria-hidden="true"
                          >
                            {currentMood?.emoji || "🙂"}
                          </span>

                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-primary-text">
                              {currentMood?.label || log.mood}
                            </p>

                            {log.note ? (
                              <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-secondary">
                                {log.note}
                              </p>
                            ) : (
                              <p className="mt-0.5 text-xs text-secondary">
                                Energy level: {log.energyLevel}/5
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="text-[10px] font-medium text-secondary sm:text-xs">
                            {new Date(log.createdAt).toLocaleDateString(
                              undefined,
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </p>

                          <p className="mt-0.5 text-[10px] text-secondary/70">
                            {new Date(log.createdAt).toLocaleTimeString(
                              undefined,
                              {
                                hour: "numeric",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}

              {logs.length > 10 && (
                <p className="mt-4 text-center text-[11px] text-secondary">
                  Showing your 10 most recent check-ins.
                </p>
              )}
            </section>
          </div>
        </div>

        {/* =====================================================
            Gentle reminder
            ===================================================== */}
        <div className="flex items-start gap-3 rounded-xl border border-border-default bg-surface-muted/50 px-4 py-3.5">
          <CheckCircle2
            size={17}
            className="mt-0.5 shrink-0 text-primary"
            aria-hidden="true"
          />

          <p className="text-xs leading-relaxed text-secondary">
            <span className="font-semibold text-primary-text">
              Small check-ins matter.
            </span>{" "}
            Your wellbeing data is here to help you reflect on your study
            habits and make better decisions about your time and energy.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default EmotionTracker;