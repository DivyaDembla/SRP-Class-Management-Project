import {
  Home,
  Users,
  UserCog,
  UserPlus,
  User,
  UserCheck,
  MapPin,
  Layers,
  BookOpen,
  CalendarDays,
  ClipboardList,
  CreditCard,
  Wallet,
  FileText,
  DollarSign,
  Settings,
  Briefcase,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCurrentUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "show" : ""}`}
        onClick={onClose}
      />

      <aside className={`layout-sidebar ${isOpen ? "open" : ""}`}>
        <nav>
          <div className="sidebar-section">
            <p className="section-title">Home</p>
            <Link className="sidebar-link" to="/dashboard">
              <Home size={16} /> Dashboard
            </Link>
          </div>

          <div className="sidebar-section">
            <p className="section-title">Masters</p>
            <Link className="sidebar-link" to="/class-master">
              <BookOpen size={16} /> Class Master
            </Link>
            <Link className="sidebar-link" to="/student-master">
              <Users size={16} /> Student Master
            </Link>
            <Link className="sidebar-link" to="/role-master">
              <UserCog size={16} /> Role Master
            </Link>
            <Link className="sidebar-link" to="/user-master">
              <UserPlus size={16} /> User Master
            </Link>
            <Link className="sidebar-link" to="/assign-roles">
              <UserCheck size={16} /> Assign Roles
            </Link>
            <Link className="sidebar-link" to="/location-master">
              <MapPin size={16} /> Location Master
            </Link>
            <Link className="sidebar-link" to="/classes-group-master">
              <Layers size={16} /> Classes Group Master
            </Link>
            <Link className="sidebar-link" to="/teacher-master">
              <User size={16} /> Teacher Master
            </Link>
            <Link className="sidebar-link" to="/expense-master">
              <FileText size={16} /> Expense Type Master
            </Link>
            <Link className="sidebar-link" to="/subject-master">
              <CalendarDays size={16} /> Subject Master
            </Link>
          </div>

          <div className="sidebar-section">
            <p className="section-title">Management</p>
            <Link className="sidebar-link" to="/teacher-rate">
              <Briefcase size={16} /> Teacher-Class Rate
            </Link>
            <Link className="sidebar-link" to="/timetable-management">
              <CalendarDays size={16} /> Timetable Management
            </Link>
            <Link className="sidebar-link" to="/lecture-entry-system">
              <ClipboardList size={16} /> Lecture Entry System
            </Link>
            <Link className="sidebar-link" to="/attendance">
              <ClipboardList size={16} /> Student Attendance
            </Link>
          </div>

          <div className="sidebar-section">
            <p className="section-title">Finance</p>
            <Link className="sidebar-link" to="/teacher-payment">
              <CreditCard size={16} /> Teacher Payment Module
            </Link>
            <Link className="sidebar-link" to="/expense-entry">
              <Wallet size={16} /> Expense Entry
            </Link>
            <Link className="sidebar-link" to="/income-entry">
              <DollarSign size={16} /> Income Entry
            </Link>
          </div>
        </nav>

        {/* FOOTER */}
        <div className="sidebar-footer" onClick={() => navigate("/profile")}>
          <div>
            <p className="username">{currentUser?.name || "Loading..."}</p>
            <p className="role">{currentUser?.username || ""}</p>
          </div>
          <Settings size={18} />
        </div>
      </aside>
    </>
  );
}
