import React, { useEffect, useState } from "react";
import { LogOut, Moon, Sun } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Topbar = ({ title, subtitle }) => {
  const { user, logout } = useAuth();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("student-app-theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("student-app-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  };

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "S";

  return (
    <header className="sticky top-0 z-30 flex min-h-[72px] items-center justify-between gap-4 border-b border-border-default bg-surface/95 px-4 py-3 backdrop-blur-xl sm:px-6">
      {/* Page heading */}
      <div className="min-w-0">
        <h1 className="truncate font-display text-lg font-bold text-primary-text sm:text-xl">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-0.5 hidden truncate text-sm text-secondary sm:block">
            {subtitle}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-default bg-surface-muted text-secondary transition-all duration-200 hover:bg-surface hover:text-primary-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={
            theme === "dark"
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          title={
            theme === "dark"
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
        >
          {theme === "dark" ? (
            <Sun size={18} aria-hidden="true" />
          ) : (
            <Moon size={18} aria-hidden="true" />
          )}
        </button>

        {/* User */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white"
            aria-hidden="true"
          >
            {userInitial}
          </div>

          <div className="hidden text-right sm:block">
            <p className="max-w-[180px] truncate text-sm font-semibold text-primary-text">
              {user?.name || "Student"}
            </p>

            <p className="max-w-[180px] truncate text-xs text-secondary">
              {user?.email || ""}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={logout}
          className="flex h-10 items-center gap-2 rounded-xl border border-border-default bg-surface px-3 text-sm font-medium text-secondary transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:hover:border-red-900/50 dark:hover:bg-red-950/30 dark:hover:text-red-400"
          aria-label="Log out"
          title="Log out"
        >
          <LogOut size={16} aria-hidden="true" />
          <span className="hidden md:inline">Log out</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;