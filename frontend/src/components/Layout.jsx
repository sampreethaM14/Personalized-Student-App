import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Layout = ({ title, subtitle, children }) => {
  // State to manage sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="min-h-screen bg-app text-primary transition-colors duration-200">
      {/* Keyboard accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Skip to main content
      </a>

      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content wrapper with dynamic margin transition */}
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