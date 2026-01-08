// Layout.js
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import "./ClassMaster.css";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="classmaster-root">
      {/* Top Header */}
      <header className="classmaster-header">
        {/* Mobile menu button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={22} color="white" />
        </button>

        <h1>Dashboard</h1>
      </header>

      <div className="classmaster-container">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content */}
        <main className="classmaster-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
