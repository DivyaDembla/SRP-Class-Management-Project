import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import ClassMaster from "./ClassMaster";
import HolidayMaster from "./Holidaymaster";
import TeacherMaster from "./TeacherMaster";
import LocationMaster from "./LocationMaster";
import ClassesGroupMaster from "./ClassesGroupMaster";
import UserMaster from "./UserMaster";
import ExpenseMaster from "./ExpenseMaster";
import AssignRoles from "./AssignRoles";
import RoleMaster from "./RoleMaster";
import LectureEntrySystem from "./LectureEntrySystem";
import StudentMaster from "./StudentManagement";
import TimetableManagement from "./TimeTableManagement";
import TeacherClassRate from "./TeacherClassRate";
import IncomeEntryScreen from "./IncomeEntryScreen";
import StudentManagement from "./StudentManagement";
import AttendanceManagement from "./AttendanceManagement";
import ExpenseEntryScreen from "./ExpenseEntry";
import StudentListScreen from "./StudentListScreen";
import TeacherPayment from "./TeacherPayment";
import Login from "./Login";

function App() {
  return (
    <Router>
      <Routes>
        {/* Layout wrapper */}
        <Route path="/" element={<Layout />}>
          <Route path="class-master" element={<ClassMaster />} />
          <Route path="holiday-master" element={<HolidayMaster />} />
          <Route path="teacher-master" element={<TeacherMaster />} />
          <Route path="location-master" element={<LocationMaster />} />
          <Route path="classes-group-master" element={<ClassesGroupMaster />} />
          <Route path="user-master" element={<UserMaster />} />
          <Route path="expense-master" element={<ExpenseMaster />} />
          <Route path="assign-roles" element={<AssignRoles />} />
          <Route path="role-master" element={<RoleMaster />} />
          <Route path="lecture-entry-system" element={<LectureEntrySystem />} />
          <Route path="student-master" element={<StudentMaster />} />
          <Route
            path="timetable-management"
            element={<TimetableManagement />}
          />
          <Route path="income-entry" element={<IncomeEntryScreen />} />
          <Route path="teacher-rate" element={<TeacherClassRate />} />
          <Route path="student-management" element={<StudentManagement />} />
          <Route path="attendance" element={<AttendanceManagement />} />
          <Route path="expense-entry" element={<ExpenseEntryScreen />} />
          <Route path="student-list" element={<StudentListScreen />} />
          <Route path="teacher-payment" element={<TeacherPayment />} />
          {/* Add other routes as needed */}
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;