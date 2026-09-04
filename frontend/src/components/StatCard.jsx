import React from "react";

const StatCard = ({ label, value, hint, accent = false }) => {
  return (
    <div
      className="
        group relative overflow-hidden rounded-2xl
        border border-border-default
        bg-surface p-5
        shadow-sm
        transition-all duration-200
        hover:-translate-y-0.5
        hover:shadow-md
      "
    >
      {/* Accent indicator */}
      <div
        className={`absolute left-0 top-0 h-full w-1 rounded-r-full ${
          accent ? "bg-primary" : "bg-transparent"
        }`}
        aria-hidden="true"
      />

      {/* Label */}
      <p className="text-sm font-medium text-secondary">
        {label}
      </p>

      {/* Main value */}
      <p
        className={`mt-2 font-display text-3xl font-bold tracking-tight ${
          accent ? "text-primary" : "text-primary-text"
        }`}
      >
        {value}
      </p>

      {/* Supporting information */}
      {hint && (
        <p className="mt-2 text-xs leading-relaxed text-secondary">
          {hint}
        </p>
      )}
    </div>
  );
};

export default StatCard;