// Layout.js
import React from "react";
import Sidebar from "./Sidebar";
import "./ClassMaster.css";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="classmaster-root">
      {/* Top Header */}
      <header className="classmaster-header">
        <h1>Dashboard</h1>
      </header>

      <div className="classmaster-container">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <main className="classmaster-main">
          <Outlet />{" "}
          {/* This will render the page (ClassMaster, HolidayMaster, etc.) */}
        </main>
      </div>
    </div>
  );
}
