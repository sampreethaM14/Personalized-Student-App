import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Menu } from "lucide-react";

const Layout = ({ title, subtitle, children }) => {
  // Desktop sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Mobile sidebar state
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const toggleMobile = () => setIsMobileOpen((prev) => !prev);

  return (
    <div className="min-h-screen bg-app text-primary transition-colors duration-200">
      {/* Keyboard accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Skip to main content
      </a>

      {/* =========================================
          MOBILE TOP HEADER (Hidden on Desktop)
          ========================================= */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border-default bg-surface px-4 py-3 md:hidden">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="h-8 w-auto rounded-lg object-contain" 
          />
          <p className="font-display text-sm font-bold text-primary-text">
            Personalized Student App
          </p>
        </div>
        
        <button
          onClick={toggleMobile}
          className="rounded-lg p-2 text-secondary transition-colors hover:bg-surface-muted hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* MOBILE OVERLAY (Darkens background when open) */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity md:hidden"
          onClick={toggleMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Component */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar}
        isMobileOpen={isMobileOpen}
        closeMobile={toggleMobile}
      />

      {/* Main content wrapper with margin transitions */}
      <div 
        className={`flex min-h-screen flex-1 flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "md:ml-64" : "md:ml-20"
        }`}
      >
        <Topbar title={title} subtitle={subtitle} />

        <main
          id="main-content"
          className="flex-1 px-4 py-5 sm:px-5 lg:px-6 lg:py-6"
        >
          <div className="mx-auto w-full max-w-[1440px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;