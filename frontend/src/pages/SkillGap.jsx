import React, { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Lightbulb,
  Loader2,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  X,
  CircleDashed,
  Plus
} from "lucide-react";

const SkillGap = () => {
  const [targetRole, setTargetRole] = useState("");
  const [knownSkillsInput, setKnownSkillsInput] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState("");

  const loadHistory = async () => {
    try {
      setHistoryLoading(true);
      const { data } = await api.get("/skills/history");
      setHistory(data);
    } catch (err) {
      console.error("Error loading skill history:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleAnalyse = async (e) => {
    e.preventDefault();

    if (!targetRole.trim()) return;

    setLoading(true);
    setError("");

    try {
      const knownSkills = knownSkillsInput
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const { data } = await api.post("/skills/analyse", {
        targetRole: targetRole.trim(),
        knownSkills,
      });

      setResult(data);
      await loadHistory();
    } catch (err) {
      console.error("Skill analysis error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to analyse this role right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // 1 & 2: Mark skill as learned and dynamically update coverage
  const markAsLearned = (skillToMove) => {
    if (!result) return;
    
    setResult((prevResult) => {
      // Remove from missing skills
      const updatedMissing = prevResult.missingSkills.filter(
        (skill) => skill !== skillToMove
      );
      
      // Add to known skills
      const updatedKnown = [...prevResult.knownSkills, skillToMove];

      return {
        ...prevResult,
        missingSkills: updatedMissing,
        knownSkills: updatedKnown,
      };
    });

    // Optional: If you have an endpoint to save this progress to the backend,
    // you can trigger it here: api.put(`/skills/update`, { skill: skillToMove })
  };

  const clearForm = () => {
    setTargetRole("");
    setKnownSkillsInput("");
    setError("");
    setResult(null); // Clear previous results on reset
  };

  const knownSkills = useMemo(() => {
    if (!result) return [];

    return result.knownSkills.filter(
      (skill) => !result.missingSkills.includes(skill)
    );
  }, [result]);

  const gapPercentage = useMemo(() => {
    if (!result?.requiredSkills?.length) return 100;

    const covered = result.requiredSkills.length - result.missingSkills.length;
    return Math.round((covered / result.requiredSkills.length) * 100);
  }, [result]);

  return (
    <Layout
      title="Skill Gap Analysis"
      subtitle="Spot exactly what's missing between you and your target role."
    >
      <div className="mx-auto w-full max-w-7xl space-y-6">
        {/* =====================================================
            Hero
            ===================================================== */}
        <section className="relative overflow-hidden rounded-2xl border border-border-default bg-surface shadow-sm">
          <div
            className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative flex flex-col gap-5 px-5 py-6 sm:px-7 sm:py-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Target size={25} />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-xl font-semibold text-primary-text sm:text-2xl">
                    Find your next skill
                  </h2>

                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/15 px-2.5 py-1 text-[10px] font-semibold text-amber-700 dark:text-amber-400 border border-amber-500/20">
                    <Sparkles size={11} />
                    Personalised
                  </span>
                </div>

                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-secondary">
                  Compare what you already know with the core skills expected
                  for your target career and turn the gaps into a focused
                  learning plan.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-border-default bg-surface-muted px-4 py-3">
              <BarChart3 size={18} className="text-primary" />

              <div>
                <p className="text-xs font-semibold text-primary-text">
                  Track your progress
                </p>
                <p className="mt-0.5 text-[10px] text-secondary">
                  Analyse different roles anytime
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            Main content
            ===================================================== */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* ===================================================
              Analysis form
              =================================================== */}
          <section className="h-fit lg:col-span-1">
            <form
              onSubmit={handleAnalyse}
              className="card"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400/15 text-amber-600 dark:text-amber-400">
                  <Search size={18} />
                </div>

                <div>
                  <h2 className="font-display text-lg font-semibold text-primary-text">
                    Analyse a role
                  </h2>
                  <p className="text-xs text-secondary">
                    Start with your career target
                  </p>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
                >
                  <AlertCircle
                    size={15}
                    className="mt-0.5 shrink-0"
                  />
                  <p>{error}</p>
                </div>
              )}

              <div className="mb-4">
                <label htmlFor="target-role" className="label">
                  Target role
                </label>

                <input
                  id="target-role"
                  required
                  className="input-field"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Software Developer"
                  autoComplete="off"
                />
              </div>

              <div className="mb-5">
                <label htmlFor="known-skills" className="label">
                  Skills you already have
                </label>

                <textarea
                  id="known-skills"
                  className="input-field resize-none"
                  rows={4}
                  value={knownSkillsInput}
                  onChange={(e) => setKnownSkillsInput(e.target.value)}
                  placeholder="e.g. Java, Python, Git, SQL"
                />

                <p className="mt-1.5 flex items-center gap-1 text-[11px] text-secondary">
                  <Lightbulb size={12} />
                  Separate multiple skills with commas.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !targetRole.trim()}
                className="
                  group flex w-full items-center justify-center gap-2
                  rounded-xl bg-amber-500 px-4 py-3
                  text-sm font-semibold text-ink-950
                  transition-all duration-200
                  hover:bg-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-amber-500
                  focus-visible:ring-offset-2
                "
              >
                {loading ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                    Analysing...
                  </>
                ) : (
                  <>
                    Analyse skill gap
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </>
                )}
              </button>

              {(targetRole || knownSkillsInput) && !loading && (
                <button
                  type="button"
                  onClick={clearForm}
                  className="mx-auto mt-3 flex items-center gap-1 text-[11px] font-medium text-secondary hover:text-primary-text"
                >
                  <X size={12} />
                  Clear form
                </button>
              )}
            </form>

            {/* Preparation tip */}
            <div className="mt-4 rounded-2xl border border-border-default bg-surface p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <TrendingUp size={16} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-primary-text">
                    Make the result useful
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-secondary">
                    Be honest about your current skills. The more accurate your
                    input is, the more useful your gap analysis becomes.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ===================================================
              Results + history
              =================================================== */}
          <div className="space-y-5 lg:col-span-2">
            {/* Results */}
            {result ? (
              <section className="card overflow-hidden p-0 animate-in fade-in zoom-in-95 duration-300">
                {/* Result header */}
                <div className="border-b border-border-default px-5 py-5 sm:px-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-32 w-32 bg-emerald-500/5 blur-3xl pointer-events-none rounded-full"></div>
                  
                  <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2
                          size={19}
                          className="text-emerald-600 dark:text-emerald-400"
                        />
                        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                          Analysis complete
                        </span>
                      </div>

                      <h2 className="mt-2 font-display text-xl font-semibold text-primary-text">
                        Results for "{result.targetRole}"
                      </h2>

                      <p className="mt-1 text-sm text-secondary">
                        {result.missingSkills.length === 0
                          ? "You already cover every core skill we track for this role. Great work!"
                          : `You're missing `}
                          {result.missingSkills.length > 0 && (
                            <span className="font-bold text-amber-600 dark:text-amber-400">
                              {result.missingSkills.length}
                            </span>
                          )}
                          {result.missingSkills.length > 0 
                            ? ` skill${result.missingSkills.length > 1 ? "s" : ""} from the tracked requirements.`
                            : ""}
                      </p>
                    </div>

                    {/* Readiness score (Updated to Animate Properly) */}
                    <div className="flex shrink-0 items-center gap-3 rounded-xl border border-border-default bg-surface-muted px-4 py-3 shadow-sm">
                      <div className="relative flex h-12 w-12 items-center justify-center">
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-primary-text z-10">
                          {gapPercentage}%
                        </span>

                        <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 48 48">
                          {/* Background Circle */}
                          <circle
                            className="text-border-default stroke-current"
                            strokeWidth="4"
                            cx="24"
                            cy="24"
                            r="20"
                            fill="transparent"
                          />
                          {/* Progress Circle */}
                          <circle
                            className="text-emerald-500 stroke-current transition-all duration-1000 ease-out"
                            strokeWidth="4"
                            strokeLinecap="round"
                            cx="24"
                            cy="24"
                            r="20"
                            fill="transparent"
                            strokeDasharray="125.6"
                            strokeDashoffset={125.6 - (gapPercentage / 100) * 125.6}
                          />
                        </svg>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-primary-text">
                          Skill coverage
                        </p>
                        <p className="text-[10px] text-secondary">
                          Based on tracked skills
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skill groups */}
                <div className="grid grid-cols-1 gap-6 px-5 py-5 sm:px-6 md:grid-cols-2">
                  {/* Known */}
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                          Known skills
                        </p>
                        <p className="mt-0.5 text-[10px] text-secondary">
                          Skills you already cover
                        </p>
                      </div>

                      <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                        {knownSkills.length}
                      </span>
                    </div>

                    <div className="flex min-h-16 flex-wrap content-start gap-2 rounded-xl border border-border-default bg-surface-muted/40 p-3">
                      {knownSkills.length > 0 ? (
                        knownSkills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 animate-in fade-in zoom-in duration-300"
                          >
                            <Check size={12} />
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-secondary">
                          No matching skills yet.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Missing (Interactive Buttons) */}
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                          To learn next
                        </p>
                        <p className="mt-0.5 text-[10px] text-secondary">
                          Click to mark as learned
                        </p>
                      </div>

                      <span className="rounded-full bg-amber-500/10 px-2 py-1 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                        {result.missingSkills.length}
                      </span>
                    </div>

                    <div className="flex min-h-16 flex-wrap content-start gap-2 rounded-xl border border-border-default bg-surface-muted/40 p-3">
                      {result.missingSkills.length > 0 ? (
                        result.missingSkills.map((skill) => (
                          <button
                            key={skill}
                            onClick={() => markAsLearned(skill)}
                            title={`Mark ${skill} as learned`}
                            className="group inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-700 transition-all duration-200 hover:bg-amber-500 hover:text-white dark:text-amber-400 dark:hover:text-ink-950"
                          >
                            <CircleDashed size={12} className="group-hover:hidden" />
                            <Plus size={12} className="hidden group-hover:block" />
                            {skill}
                          </button>
                        ))
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400">
                          <CheckCircle2 size={14} />
                          No major gaps found.
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Progress Bar */}
                {result.requiredSkills?.length > 0 && (
                  <div className="border-t border-border-default bg-surface-muted/30 px-5 py-4 sm:px-6">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2">
                        <BarChart3
                          size={15}
                          className="text-primary"
                        />
                        <p className="text-xs font-semibold text-primary-text">
                          Required skill set
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-border-default">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all duration-1000 ease-out"
                        style={{ width: `${gapPercentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </section>
            ) : (
              /* Empty result state */
              <section className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-border-default bg-surface p-6 text-center shadow-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Target size={25} />
                </div>

                <h2 className="mt-4 font-display text-lg font-semibold text-primary-text">
                  Your skill map starts here
                </h2>

                <p className="mt-1 max-w-md text-xs leading-relaxed text-secondary">
                  Enter a target role and the skills you already know. We'll
                  compare them and highlight where you should focus next.
                </p>

                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {["Full Stack Developer", "Frontend Developer", "Backend Developer"].map(
                    (role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setTargetRole(role)}
                        className="rounded-full border border-border-default bg-surface-muted px-3 py-1.5 text-[11px] font-medium text-secondary transition hover:border-primary/40 hover:text-primary-text"
                      >
                        {role}
                      </button>
                    )
                  )}
                </div>
              </section>
            )}

            {/* =================================================
                Past analyses
                ================================================= */}
            <section className="card">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-muted text-secondary">
                    <Clock3 size={17} />
                  </div>

                  <div>
                    <h2 className="font-display text-lg font-semibold text-primary-text">
                      Past analyses
                    </h2>

                    <p className="text-xs text-secondary">
                      Review your previous career targets
                    </p>
                  </div>
                </div>

                {history.length > 0 && (
                  <span className="rounded-full bg-surface-muted px-2.5 py-1 text-[10px] font-semibold text-secondary">
                    {history.length}
                  </span>
                )}
              </div>

              {historyLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="h-14 animate-pulse rounded-xl bg-surface-muted"
                    />
                  ))}
                </div>
              ) : history.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border-default bg-surface-muted/40 px-4 py-8 text-center">
                  <BarChart3
                    size={20}
                    className="mx-auto text-secondary"
                  />

                  <p className="mt-2 text-xs font-medium text-primary-text">
                    No analyses yet
                  </p>

                  <p className="mt-1 text-[11px] text-secondary">
                    Run your first skill gap analysis above.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-border-default">
                  {history.map((item) => {
                    const gapCount = item.missingSkills?.length || 0;

                    return (
                      <li key={item._id}>
                        <button
                          type="button"
                          onClick={() => {
                            setTargetRole(item.targetRole);
                            setResult(item);
                          }}
                          className="group flex w-full items-center justify-between gap-4 py-3 text-left transition hover:bg-surface-muted/50"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-primary-text">
                              {item.targetRole}
                            </p>

                            <div className="mt-1 flex items-center gap-2 text-[10px] text-secondary">
                              <span>
                                {gapCount} gap
                                {gapCount !== 1 ? "s" : ""}
                              </span>

                              <span className="h-1 w-1 rounded-full bg-border-strong" />

                              <span>
                                {new Date(
                                  item.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <ChevronRight
                            size={16}
                            className="shrink-0 text-secondary transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                          />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SkillGap;