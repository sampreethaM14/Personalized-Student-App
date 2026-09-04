import React from "react";
import { Check, Trash2 } from "lucide-react";

const PRIORITY_STYLES = {
  high: "border-red-300 bg-red-100 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300",
  medium:
    "border-amber-300 bg-amber-100 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300",
  low: "border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300",
};

const TaskCard = ({ task, onToggle, onDelete }) => {
  const isCompleted = task.status === "completed";
  const priority =
    PRIORITY_STYLES[task.priority?.toLowerCase()] || PRIORITY_STYLES.medium;

  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div
      className={`
        group flex items-start justify-between gap-4
        rounded-2xl border border-border-default
        bg-surface p-4
        shadow-sm
        transition-all duration-200
        hover:border-primary/20 hover:shadow-md
        sm:p-5
      `}
    >
      {/* Task information */}
      <div className="flex min-w-0 flex-1 items-start gap-3">
        {/* Custom checkbox */}
        <label className="relative mt-0.5 shrink-0 cursor-pointer">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={() => onToggle(task)}
            className="
              peer sr-only
            "
            aria-label={
              isCompleted
                ? `Mark ${task.title} as incomplete`
                : `Mark ${task.title} as completed`
            }
          />

          <span
            className="
              flex h-5 w-5 items-center justify-center
              rounded-md border-2 border-border-strong
              bg-surface
              transition-all duration-150
              peer-checked:border-primary
              peer-checked:bg-primary
              peer-focus-visible:ring-2
              peer-focus-visible:ring-primary
              peer-focus-visible:ring-offset-2
            "
          >
            {isCompleted && (
              <Check
                size={13}
                strokeWidth={3}
                className="text-white"
                aria-hidden="true"
              />
            )}
          </span>
        </label>

        <div className="min-w-0">
          {/* Title */}
          <p
            className={`
              truncate text-sm font-semibold transition-colors sm:text-base
              ${
                isCompleted
                  ? "text-secondary line-through"
                  : "text-primary-text"
              }
            `}
          >
            {task.title}
          </p>

          {/* Subject + due date */}
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-secondary">
            {task.subject && <span>{task.subject}</span>}

            {task.subject && formattedDueDate && (
              <span aria-hidden="true">•</span>
            )}

            {formattedDueDate && (
              <span>
                Due {formattedDueDate}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions + priority */}
      <div className="flex shrink-0 items-center gap-2">
        {/* Priority */}
        <span
          className={`
            inline-flex items-center gap-1.5
            rounded-full border px-2.5 py-1
            text-[11px] font-semibold capitalize
            sm:text-xs
            ${priority.wrapper}
          `}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${priority.dot}`}
            aria-hidden="true"
          />
          {task.priority || "medium"}
        </span>

        {/* Delete */}
        <button
          type="button"
          onClick={() => onDelete(task)}
          className="
            flex h-8 w-8 items-center justify-center
            rounded-lg
            text-secondary
            transition-all duration-150
            hover:bg-red-50 hover:text-red-600
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-red-500
            focus-visible:ring-offset-2
            dark:hover:bg-red-950/40
            dark:hover:text-red-400
          "
          aria-label={`Delete task: ${task.title}`}
          title="Delete task"
        >
          <Trash2 size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;