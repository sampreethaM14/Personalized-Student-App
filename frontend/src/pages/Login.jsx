import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      await login(form.email.trim(), form.password);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-app">
      {/* Decorative background */}
      <div
        className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl"
        aria-hidden="true"
      />

      {/* Left branding panel - desktop */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-surface border-r border-border-default p-10 lg:flex xl:p-14">
        <div
          className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full border border-primary/20"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -right-10 top-36 h-48 w-48 rounded-full border border-primary/20"
          aria-hidden="true"
        />

        {/* Brand */}
        <div className="relative">
          <img 
            src="/logo.png" 
            alt="Personalized Students App" 
            className="h-24 w-auto rounded-2xl object-contain shadow-lg shadow-primary/10" 
          />
        </div>

        {/* Main message */}
        <div className="relative max-w-xl">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-muted text-primary border border-border-default">
            <Sparkles size={24} />
          </div>

          <h1 className="font-display text-4xl font-semibold leading-tight xl:text-5xl text-primary-text">
            Your journey.
            <br />
            <span className="text-primary font-bold">Your goals.</span>
            <br />
            One place.
          </h1>

          <p className="mt-5 max-w-lg text-sm leading-7 text-secondary">
            Organise your studies, understand your wellbeing, build the right
            skills, prepare for placements, and get personalised guidance
            whenever you need it.
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            {["Study smarter", "Track progress", "Prepare better"].map(
              (item) => (
                <span
                  key={item}
                  className="rounded-full border border-border-default bg-surface-muted px-3 py-1.5 text-xs font-medium text-secondary"
                >
                  {item}
                </span>
              )
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="relative text-xs text-secondary font-medium">
          Plan Better. Learn Smarter. Grow Together.
        </p>
      </div>

      {/* Login area */}
      <div className="relative flex w-full items-center justify-center px-4 py-8 sm:px-6 lg:w-1/2 lg:px-10">
        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <div className="mb-8 text-center lg:hidden">
            <img 
              src="/logo.png" 
              alt="Personalized Students App" 
              className="mx-auto mb-4 h-20 w-auto rounded-2xl object-contain shadow-md shadow-primary/20" 
            />
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary">
              VIGYAN '26 • Project Expo
            </p>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
              Welcome back
            </p>

            <h1 className="font-display text-3xl font-bold tracking-tight text-primary-text">
              Continue your journey.
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-secondary">
              Sign in to access your dashboard.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-border-default bg-surface p-5 shadow-sm sm:p-7"
          >
            {/* Error */}
            {error && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
              >
                <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                <p>{error}</p>
              </div>
            )}

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="login-email" className="label">
                Email
              </label>

              <div className="relative">
                <Mail
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary"
                  aria-hidden="true"
                />

                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  className="input-field pl-10"
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    if (error) setError("");
                  }}
                  placeholder="you@gmail.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-6">
              <label htmlFor="login-password" className="label">
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary"
                  aria-hidden="true"
                />

                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  className="input-field pl-10 pr-11"
                  value={form.password}
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                    if (error) setError("");
                  }}
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-secondary transition-colors hover:bg-surface-muted hover:text-primary-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={17} aria-hidden="true" />
                  ) : (
                    <Eye size={17} aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full min-h-[46px] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                    aria-hidden="true"
                  />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={16} aria-hidden="true" />
                </>
              )}
            </button>

            {/* Register */}
            <div className="mt-5 border-t border-border-default pt-5 text-center">
              <p className="text-sm text-secondary">
                New to the platform?{" "}
                <Link
                  to="/register"
                  className="font-bold text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:text-primary-hover hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </form>

          {/* Bottom reassurance */}
          <div className="mt-5 flex items-center justify-center gap-2 text-center">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <p className="text-[11px] font-medium text-secondary">
              Your academic journey, organised in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;