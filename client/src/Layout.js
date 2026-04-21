import React, { useState } from "react";
import Sidebar from "./Sidebar";
import "./Layout.css";
import { Outlet, useNavigate } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="layout-root">
      {/* Header */}
      <header className="layout-header">
        {/* LEFT SIDE */}
        <div className="header-left">
          <button
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            <Menu size={22} color="white" />
          </button>

          <h1>Dashboard</h1>
        </div>

        {/* RIGHT SIDE */}
        <button onClick={handleLogout} className="logout-btn" title="Logout">
          <LogOut size={20} />
        </button>
      </header>

      {/* Container */}
      <div className={`layout-container ${sidebarOpen ? "sidebar-open" : ""}`}>
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main */}
        <main className="layout-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
