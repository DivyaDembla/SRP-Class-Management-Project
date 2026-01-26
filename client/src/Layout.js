// Layout.js
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import "./ClassMaster.css";
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

        {/* Logout button */}
        <button
          onClick={handleLogout}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "white",
          }}
          title="Logout"
        >
          <LogOut size={20} />
        </button>
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
