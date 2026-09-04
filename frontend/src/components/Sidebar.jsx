import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  CalendarDays,
  HeartPulse,
  Target,
  Bot,
  BookOpen,
  BriefcaseBusiness,
  Users,
  PanelLeftClose,
  Menu,
  UserCircle
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/planner", label: "Study Planner", icon: ClipboardList },
  { to: "/timetable", label: "Timetable", icon: CalendarDays },
  { to: "/emotion", label: "Emotion Tracker", icon: HeartPulse },
  { to: "/skills", label: "Skill Gap", icon: Target },
  { to: "/assistant", label: "AI Assistant", icon: Bot },
  { to: "/learning-hub", label: "Learning Hub", icon: BookOpen },
  { to: "/placement", label: "Placement Prep", icon: BriefcaseBusiness },
  { to: "/groups", label: "Study Groups", icon: Users },
  { to: "/profile", label: "Profile", icon: UserCircle}
];

const Sidebar = ({ isOpen, toggleSidebar, isMobileOpen, closeMobile }) => {
  // On mobile, the sidebar is always 64px wide when visible, so text should always show.
  const showText = isOpen || isMobileOpen;

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 shrink-0
        flex flex-col border-r border-border-default
        bg-surface text-primary-text
        transition-all duration-300 ease-in-out
        
        /* Mobile: Hidden off-screen by default, slides in when open */
        ${isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"}
        
        /* Desktop: Always on screen, toggles width */
        md:translate-x-0
        ${isOpen ? "md:w-64" : "md:w-20 md:items-center"}
      `}
      aria-label="Main navigation"
    >
      {/* Brand & Toggle Header */}
      <div className={`flex items-center border-b border-border-default py-4 transition-all duration-300 ${showText ? "px-5 justify-between" : "px-0 justify-center w-full"}`}>
        
        <div className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${showText ? "w-auto opacity-100" : "w-0 opacity-0 hidden"}`}>
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="h-10 w-auto rounded-xl object-contain" 
          />
          <div className="whitespace-nowrap">
            <p className="font-display text-base font-semibold leading-tight text-primary-text">
              Personalised
            </p>
            <p className="font-display text-base font-bold leading-tight text-primary">
              Student App
            </p>
          </div>
        </div>

        {/* Desktop Toggle */}
        <button 
          onClick={toggleSidebar}
          className="hidden p-2 rounded-lg text-secondary transition-colors hover:bg-surface-muted hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 md:block"
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isOpen ? <PanelLeftClose size={20} /> : <Menu size={24} />}
        </button>

        {/* Mobile Close Toggle */}
        <button 
          onClick={closeMobile}
          className="block p-2 rounded-lg text-secondary transition-colors hover:bg-surface-muted hover:text-primary focus:outline-none md:hidden"
          aria-label="Close sidebar"
        >
          <PanelLeftClose size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav
        className={`flex flex-1 flex-col overflow-y-auto py-4 overflow-x-hidden ${showText ? "px-4" : "px-2 items-center w-full"}`}
        aria-label="Student portal"
      >
        <p className={`mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary transition-all duration-300 whitespace-nowrap ${showText ? "opacity-100 block" : "opacity-0 hidden"}`}>
          Student Portal
        </p>

        <div className="flex flex-col gap-1 w-full">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                title={!showText ? item.label : undefined}
                end={item.to === "/"}
                onClick={() => {
                  if (isMobileOpen) closeMobile();
                }}
                className={({ isActive }) =>
                  [
                    "group flex items-center rounded-xl outline-none",
                    showText ? "min-h-[44px] gap-3 px-3" : "justify-center h-12 w-12 mx-auto",
                    "text-sm font-medium transition-all duration-200",
                    "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "text-secondary hover:bg-surface-muted hover:text-primary",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={showText ? 19 : 22}
                      strokeWidth={isActive ? 2.4 : 2}
                      className={
                        isActive
                          ? "shrink-0 text-white"
                          : "shrink-0 text-secondary transition-colors duration-200 group-hover:text-primary"
                      }
                      aria-hidden="true"
                    />

                    {showText && (
                      <span className="truncate whitespace-nowrap opacity-100 transition-opacity duration-300 delay-100">
                        {item.label}
                      </span>
                    )}

                    {isActive && showText && (
                      <span
                        className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-white"
                        aria-hidden="true"
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className={`border-t border-border-default py-5 transition-all duration-300 ${showText ? "px-5" : "px-3 flex justify-center"}`}>
        {showText ? (
          <div className="rounded-xl bg-surface-muted px-4 py-3 whitespace-nowrap overflow-hidden">
            <p className="text-xs font-medium text-secondary">Plan Better.</p>
            <p className="text-xs font-medium text-secondary">Learn Smarter.</p>
            <p className="mt-0.5 text-xs font-bold text-primary">Grow Together.</p>
          </div>
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-primary font-bold shadow-sm" title="Grow Together.">
            P
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;