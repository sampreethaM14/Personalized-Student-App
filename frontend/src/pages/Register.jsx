import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  Sparkles,
  Target,
  UserRound,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    academicGoal: "",
    careerInterest: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register({
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        academicGoal: form.academicGoal.trim(),
        careerInterest: form.careerInterest.trim(),
      });

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-app text-primary-text">
      {/* Background decoration */}
      <div
        className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl"
        aria-hidden="true"
      />

      {/* =====================================================
          Desktop Brand Panel
          ===================================================== */}
      <aside className="relative hidden w-[43%] overflow-hidden bg-surface border-r border-border-default lg:flex lg:flex-col lg:justify-between">
        <div
          className="pointer-events-none absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative p-10 xl:p-14">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20">
              <GraduationCap size={23} strokeWidth={2.2} />
            </div>

            <div>
              <p className="font-display text-lg font-semibold text-primary-text">
                Personalised Student
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                Learning Portal
              </p>
            </div>
          </div>
        </div>

        <div className="relative px-10 pb-16 xl:px-14">
          <div className="mb-6 flex items-center gap-2 text-primary">
            <Sparkles size={16} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">
              VIGYAN '26 • Project Expo
            </span>
          </div>

          <h1 className="max-w-lg font-display text-4xl font-semibold leading-tight text-primary-text xl:text-5xl">
            Your journey.
            <br />
            <span className="text-primary font-bold">Your goals.</span>
            <br />
            Your path.
          </h1>

          <p className="mt-5 max-w-md text-sm leading-7 text-secondary">
            Create your personalised student profile and get a learning
            experience built around your academic goals, career interests and
            growth.
          </p>

          <div className="mt-9 grid max-w-md grid-cols-3 gap-3">
            {[
              ["Learn", "Focused resources"],
              ["Plan", "Smarter routines"],
              ["Grow", "Career readiness"],
            ].map(([title, text]) => (
              <div
                key={title}
                className="rounded-xl border border-border-default bg-surface-muted p-3"
              >
                <p className="text-xs font-bold text-primary-text">{title}</p>
                <p className="mt-1 text-[10px] leading-relaxed text-secondary">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative px-10 pb-8 xl:px-14">
          <p className="text-[11px] font-medium text-secondary">
            A personalised companion for academic & career success.
          </p>
        </div>
      </aside>

      {/* =====================================================
          Register Area
          ===================================================== */}
      <main className="relative flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
        <div className="w-full max-w-lg">
          {/* Mobile branding */}
          <div className="mb-7 text-center lg:hidden">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-md shadow-primary/20">
              <GraduationCap size={25} />
            </div>

            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              VIGYAN '26 • Project Expo
            </p>
          </div>

          <div className="mb-6 text-center sm:mb-7">
            <h1 className="font-display text-3xl font-bold tracking-tight text-primary-text sm:text-4xl">
              Create your account
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-secondary">
              Tell us a little about yourself so your learning experience can
              be personalised from day one.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-border-default bg-surface p-5 shadow-sm sm:p-7"
          >
            {/* Error */}
            {error && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
              >
                <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                <p>{error}</p>
              </div>
            )}

            {/* Full name */}
            <div className="mb-4">
              <label htmlFor="name" className="label">
                Full name
              </label>

              <div className="relative">
                <UserRound
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary"
                  aria-hidden="true"
                />

                <input
                  id="name"
                  type="text"
                  required
                  autoComplete="name"
                  className="input-field pl-10"
                  value={form.name}
                  onChange={handleChange("name")}
                  placeholder="Your full name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="label">
                Email
              </label>

              <div className="relative">
                <Mail
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary"
                  aria-hidden="true"
                />

                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="input-field pl-10"
                  value={form.email}
                  onChange={handleChange("email")}
                  placeholder="you@college.edu"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-5">
              <label htmlFor="password" className="label">
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary"
                  aria-hidden="true"
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="input-field pl-10 pr-11"
                  value={form.password}
                  onChange={handleChange("password")}
                  placeholder="At least 6 characters"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-secondary transition-colors hover:bg-surface-muted hover:text-primary-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>

              <p className="mt-1.5 text-[11px] font-medium text-secondary">
                Use at least 6 characters.
              </p>
            </div>

            {/* Personalisation divider */}
            <div className="mb-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-border-default" />
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                <Target size={12} />
                Personalise your experience
              </span>
              <div className="h-px flex-1 bg-border-default" />
            </div>

            {/* Academic goal */}
            <div className="mb-4">
              <label htmlFor="academicGoal" className="label">
                Academic goal{" "}
                <span className="font-normal text-secondary">(optional)</span>
              </label>

              <input
                id="academicGoal"
                type="text"
                className="input-field"
                value={form.academicGoal}
                onChange={handleChange("academicGoal")}
                placeholder="e.g. Score 9+ CGPA this semester"
              />
            </div>

            {/* Career interest */}
            <div className="mb-6">
              <label htmlFor="careerInterest" className="label">
                Career interest{" "}
                <span className="font-normal text-secondary">(optional)</span>
              </label>

              <input
                id="careerInterest"
                type="text"
                className="input-field"
                value={form.careerInterest}
                onChange={handleChange("careerInterest")}
                placeholder="e.g. Software Developer"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full min-h-[46px] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </>
              )}
            </button>

            {/* Login link */}
            <p className="mt-5 text-center text-sm text-secondary">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-primary transition-colors hover:text-primary-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Sign in
              </Link>
            </p>
          </form>

          <p className="mt-5 text-center text-[11px] font-medium leading-relaxed text-secondary">
            Your academic goal and career interest help the portal personalise
            recommendations for you.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Register;