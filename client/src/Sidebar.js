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
} from "lucide-react";
import { Link } from "react-router-dom";
import "./ClassMaster.css";

export default function Sidebar() {
  return (
    <aside className="classmaster-sidebar">
      <nav>
        <div className="sidebar-section">
          <p className="section-title">Home</p>
          <Link className="sidebar-link" to="/">
            <Home size={16} /> Dashboard
          </Link>
        </div>

        <div className="sidebar-section">
          <p className="section-title">Masters</p>
          <Link className="sidebar-link" to="/class-master">
            <BookOpen size={16} /> <span>Class Master</span>
          </Link>
          <Link className="sidebar-link" to="/student-master">
            <Users size={16} /><span> Student Master</span>
          </Link>
          <Link className="sidebar-link" to="/role-master">
            <UserCog size={16} /> <span>Role Master</span>
          </Link>
          <Link className="sidebar-link" to="/user-master">
            <UserPlus size={16} /> <span>User Master</span>
          </Link>
          <Link className="sidebar-link" to="/assign-roles">
            <UserCheck size={16} /><span> Assign Roles</span>
          </Link>
          <Link className="sidebar-link" to="/location-master">
            <MapPin size={16} /> <span>Location Master</span>
          </Link>
          <Link className="sidebar-link" to="/classes-group-master">
            <Layers size={16} /> <span>Classes Group Master</span>
          </Link>
          <Link className="sidebar-link" to="/teacher-master">
            <User size={16} /> <span>Teacher Master</span>
          </Link>
          <Link className="sidebar-link" to="/expense-master">
            <FileText size={16} /> <span>Expense Type Master</span>
          </Link>
          <Link className="sidebar-link" to="/holiday-master">
            <CalendarDays size={16} /><span> Holiday Master</span>
          </Link>
        </div>

        <div className="sidebar-section">
          <p className="section-title">Management</p>

          <Link className="sidebar-link" to="/teacher-rate">
            <Briefcase size={16} /> <span>Teacher-Class Rate</span>
          </Link>
          <Link className="sidebar-link" to="/timetable-management">
            <CalendarDays size={16} /><span> Timetable Management</span>
          </Link>
          <Link className="sidebar-link" to="/lecture-entry-system">
            <ClipboardList size={16} /> <span>Lecture Entry System</span>
          </Link>
          <Link className="sidebar-link" to="/attendance">
            <ClipboardList size={16} /> <span>Student Attendance</span>
          </Link>
        </div>

        <div className="sidebar-section">
          <p className="section-title">Finance</p>
          <Link className="sidebar-link" to="/teacher-payment">
            <CreditCard size={16} /><span> Teacher Payment Module</span>
          </Link>
          <Link className="sidebar-link" to="/expense-entry">
            <Wallet size={16} /> <span>Expense Entry</span>
          </Link>
          <Link className="sidebar-link" to="/income-entry">
            <DollarSign size={16} /> <span>Income Entry</span>
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div>
          <p className="username">Rahul Gupta</p>
          <p className="role">Admin</p>
        </div>
        <Settings size={18} />
      </div>
    </aside>
  );
}
