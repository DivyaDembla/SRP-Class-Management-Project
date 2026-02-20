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
import { Link } from "react-router-dom";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  // first load
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(user);
  }, []);

  // realtime updates
  useEffect(() => {
    const syncUser = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      setCurrentUser(user);
    };

    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  return (
    <>
      {/* Overlay (mobile) */}
      <div
        className={`sidebar-overlay ${isOpen ? "show" : ""}`}
        onClick={onClose}
      />

      <aside className={`classmaster-sidebar ${isOpen ? "open" : ""}`}>
        {/* Close button (mobile) */}
        <button className="sidebar-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <nav>
          <div className="sidebar-section">
            <p className="section-title">Home</p>
            <Link className="sidebar-link" to="/dashboard" onClick={onClose}>
              <Home size={16} /> Dashboard
            </Link>
          </div>

          <div className="sidebar-section">
            <p className="section-title">Masters</p>
            <Link className="sidebar-link" to="/class-master" onClick={onClose}>
              <BookOpen size={16} /> <span>Class Master</span>
            </Link>
            <Link
              className="sidebar-link"
              to="/student-master"
              onClick={onClose}
            >
              <Users size={16} /> <span>Student Master</span>
            </Link>
            <Link className="sidebar-link" to="/role-master" onClick={onClose}>
              <UserCog size={16} /> <span>Role Master</span>
            </Link>
            <Link className="sidebar-link" to="/user-master" onClick={onClose}>
              <UserPlus size={16} /> <span>User Master</span>
            </Link>
            <Link className="sidebar-link" to="/assign-roles" onClick={onClose}>
              <UserCheck size={16} /> <span>Assign Roles</span>
            </Link>
            <Link
              className="sidebar-link"
              to="/location-master"
              onClick={onClose}
            >
              <MapPin size={16} /> <span>Location Master</span>
            </Link>
            <Link
              className="sidebar-link"
              to="/classes-group-master"
              onClick={onClose}
            >
              <Layers size={16} /> <span>Classes Group Master</span>
            </Link>
            <Link
              className="sidebar-link"
              to="/teacher-master"
              onClick={onClose}
            >
              <User size={16} /> <span>Teacher Master</span>
            </Link>
            <Link
              className="sidebar-link"
              to="/expense-master"
              onClick={onClose}
            >
              <FileText size={16} /> <span>Expense Type Master</span>
            </Link>
            <Link
              className="sidebar-link"
              to="/subject-master"
              onClick={onClose}
            >
              <CalendarDays size={16} /> <span>Subject Master</span>
            </Link>
          </div>

          <div className="sidebar-section">
            <p className="section-title">Management</p>
            <Link className="sidebar-link" to="/teacher-rate" onClick={onClose}>
              <Briefcase size={16} /> <span>Teacher-Class Rate</span>
            </Link>
            <Link
              className="sidebar-link"
              to="/timetable-management"
              onClick={onClose}
            >
              <CalendarDays size={16} /> <span>Timetable Management</span>
            </Link>
            <Link
              className="sidebar-link"
              to="/lecture-entry-system"
              onClick={onClose}
            >
              <ClipboardList size={16} /> <span>Lecture Entry System</span>
            </Link>
            <Link className="sidebar-link" to="/attendance" onClick={onClose}>
              <ClipboardList size={16} /> <span>Student Attendance</span>
            </Link>
          </div>

          <div className="sidebar-section">
            <p className="section-title">Finance</p>
            <Link
              className="sidebar-link"
              to="/teacher-payment"
              onClick={onClose}
            >
              <CreditCard size={16} /> <span>Teacher Payment Module</span>
            </Link>
            <Link
              className="sidebar-link"
              to="/expense-entry"
              onClick={onClose}
            >
              <Wallet size={16} /> <span>Expense Entry</span>
            </Link>
            <Link className="sidebar-link" to="/income-entry" onClick={onClose}>
              <DollarSign size={16} /> <span>Income Entry</span>
            </Link>
          </div>
        </nav>

        <div
          className="sidebar-footer clickable"
          onClick={() => navigate("/profile")}
        >
          <div>
            <p className="username">{currentUser?.name}</p>
            <p className="role">{currentUser?.role}</p>
          </div>
          <Settings size={18} />
        </div>
      </aside>
    </>
  );
}
