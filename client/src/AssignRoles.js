import React, { useState, useEffect } from "react";
import "./AssignRoles.css";

// Define initial permissions structure
const initialPermissions = {
    studentManagement: {
        addEditStudents: false,
        classBatchAssignment: false,
        attendanceMarking: false,
    },
    teacherManagement: {
        addEditTeachers: false,
        monthlyPaymentCalculation: false,
    },
    timetableBatches: {
        batchCreation: false,
        subjectWiseTimetable: false,
        roomSlotManagement: false,
    },
    attendanceModule: {
        dailyAttendanceEntry: false,
        absentReport: false,
        regularityReport: false,
    },
    financeModule: {
        studentFeeEntry: false,
        expenseEntry: false,
        teacherPayments: false,
        profitLossSummary: false,
    },
    reports: {
        studentAttendance: false,
        teacherPaymentSheet: false,
        incomeVsExpense: false,
        batchWiseStrength: false,
    },
};

const AssignRoles = () => {
  const [userCode, setUserCode] = useState("");
  const [username, setUsername] = useState("");
  const [location, setLocation] = useState("");
  const [permissions, setPermissions] = useState(initialPermissions);

  // State for button logic
  const [isPermissionsChanged, setIsPermissionsChanged] = useState(false);
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  const handleCheckboxChange = (module, permission) => {
    setPermissions((prev) => {
        const newPermissions = {
            ...prev,
            [module]: {
                ...prev[module],
                [permission]: !prev[module][permission],
            },
        };
        setIsPermissionsChanged(true); // Mark as changed whenever a checkbox is toggled
        return newPermissions;
    });
  };

  const handleReset = () => {
    setUserCode("");
    setUsername("");
    setLocation("");
    setPermissions(initialPermissions);
    setIsPermissionsChanged(false);
    setIsUserLoaded(false);
  };

  const handleUpdate = () => {
    if (!userCode || !isUserLoaded) {
      alert("Please enter a User Code and load user details before updating.");
      return;
    }
    if (!isPermissionsChanged) {
        alert("No changes detected. Skipping update.");
        return;
    }

    // API Call: Send {userCode, permissions} to update the backend
    console.log("Updating permissions for User:", userCode, permissions);
    alert(`✅ Permissions for User ${userCode} updated successfully!`);
    
    handleReset();
  };

  // Placeholder Effect: Mock user loading based on userCode input
  useEffect(() => {
    if (userCode.trim().length > 3) {
        // Mock successful user load (should fetch from API)
        setUsername("Priya Sharma");
        setLocation("Chembur, Kurla");
        setIsUserLoaded(true);
        // In a real app: fetchPermissions(userCode).then(setPermissions)
    } else if (userCode.trim().length === 0) {
        handleReset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCode]);


  return (
    <div className="assignroles-content">
      <div className="card">
        <h2 className="title">Assign Roles</h2>
        <hr className="divider" />

        <div className="form-grid">
          <div>
            <label className="label">User Code</label>
            <input
              type="text"
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              placeholder="Select User Code"
              className="input"
            />
          </div>
          <div>
            <label className="label">Username</label>
            <input
              type="text"
              value={username}
              placeholder="Auto-filled"
              className="input input-disabled"
              disabled
            />
          </div>
          <div>
            <label className="label">Location</label>
            <input
              type="text"
              value={location}
              placeholder="Assigned Locations"
              className="input input-disabled"
              disabled
            />
          </div>
        </div>

        <h3 className="subtitle">List of Roles</h3>
        <hr className="divider" />

        <div className="roles-grid">
          {/* Student Management */}
          <div className="role-card">
            <h4 className="role-title">Student Management</h4>
            <ul className="role-list">
              <li className="role-item">
                <input
                  type="checkbox"
                  checked={permissions.studentManagement.addEditStudents}
                  onChange={() =>
                    handleCheckboxChange("studentManagement", "addEditStudents")
                  }
                  className="checkbox"
                />
                <span className="checkbox-label">Add/Edit Students</span>
              </li>
              <li className="role-item">
                <input
                  type="checkbox"
                  checked={permissions.studentManagement.classBatchAssignment}
                  onChange={() =>
                    handleCheckboxChange(
                      "studentManagement",
                      "classBatchAssignment"
                    )
                  }
                  className="checkbox"
                />
                <span className="checkbox-label">Class & Batch Assignment</span>
              </li>
              <li className="role-item">
                <input
                  type="checkbox"
                  checked={permissions.studentManagement.attendanceMarking}
                  onChange={() =>
                    handleCheckboxChange(
                      "studentManagement",
                      "attendanceMarking"
                    )
                  }
                  className="checkbox"
                />
                <span className="checkbox-label">Attendance Marking</span>
              </li>
            </ul>
          </div>

          {/* Teacher Management */}
          <div className="role-card">
            <h4 className="role-title">Teacher Management</h4>
            <ul className="role-list">
              <li className="role-item">
                <input
                  type="checkbox"
                  checked={permissions.teacherManagement.addEditTeachers}
                  onChange={() =>
                    handleCheckboxChange("teacherManagement", "addEditTeachers")
                  }
                  className="checkbox"
                />
                <span className="checkbox-label">Add/Edit Teachers</span>
              </li>
              <li className="role-item">
                <input
                  type="checkbox"
                  checked={
                    permissions.teacherManagement.monthlyPaymentCalculation
                  }
                  onChange={() =>
                    handleCheckboxChange(
                      "teacherManagement",
                      "monthlyPaymentCalculation"
                    )
                  }
                  className="checkbox"
                />
                <span className="checkbox-label">
                  Monthly Payment Calculation
                </span>
              </li>
            </ul>
          </div>

          {/* Timetable & Batches */}
          <div className="role-card">
            <h4 className="role-title">Timetable & Batches</h4>
            <ul className="role-list">
              <li className="role-item">
                <input
                  type="checkbox"
                  checked={permissions.timetableBatches.batchCreation}
                  onChange={() =>
                    handleCheckboxChange("timetableBatches", "batchCreation")
                  }
                  className="checkbox"
                />
                <span className="checkbox-label">Batch Creation</span>
              </li>
              <li className="role-item">
                <input
                  type="checkbox"
                  checked={permissions.timetableBatches.subjectWiseTimetable}
                  onChange={() =>
                    handleCheckboxChange(
                      "timetableBatches",
                      "subjectWiseTimetable"
                    )
                  }
                  className="checkbox"
                />
                <span className="checkbox-label">Subject-wise Timetable</span>
              </li>
              <li className="role-item">
                <input
                  type="checkbox"
                  checked={permissions.timetableBatches.roomSlotManagement}
                  onChange={() =>
                    handleCheckboxChange(
                      "timetableBatches",
                      "roomSlotManagement"
                    )
                  }
                  className="checkbox"
                />
                <span className="checkbox-label">Room/Slot Management</span>
              </li>
            </ul>
          </div>

          {/* Attendance Module */}
          <div className="role-card">
            <h4 className="role-title">Attendance Module</h4>
            <ul className="role-list">
              <li className="role-item">
                <input
                  type="checkbox"
                  checked={permissions.attendanceModule.dailyAttendanceEntry}
                  onChange={() =>
                    handleCheckboxChange(
                      "attendanceModule",
                      "dailyAttendanceEntry"
                    )
                  }
                  className="checkbox"
                />
                <span className="checkbox-label">Daily Attendance Entry</span>
              </li>
              <li className="role-item">
                <input
                  type="checkbox"
                  checked={permissions.attendanceModule.absentReport}
                  onChange={() =>
                    handleCheckboxChange("attendanceModule", "absentReport")
                  }
                  className="checkbox"
                />
                <span className="checkbox-label">Absent Report</span>
              </li>
              <li className="role-item">
                <input
                  type="checkbox"
                  checked={permissions.attendanceModule.regularityReport}
                  onChange={() =>
                    handleCheckboxChange("attendanceModule", "regularityReport")
                  }
                  className="checkbox"
                />
                <span className="checkbox-label">Regularity Report</span>
              </li>
            </ul>
          </div>

          {/* Finance Module */}
          <div className="role-card">
            <h4 className="role-title">Finance Module</h4>
            <ul className="role-list">
              <li className="role-item">
                <input
                  type="checkbox"
                  checked={permissions.financeModule.studentFeeEntry}
                  onChange={() =>
                    handleCheckboxChange("financeModule", "studentFeeEntry")
                  }
                  className="checkbox"
                />
                <span className="checkbox-label">Student Fee Entry</span>
              </li>
              <li className="role-item">
                <input
                  type="checkbox"
                  checked={permissions.financeModule.expenseEntry}
                  onChange={() =>
                    handleCheckboxChange("financeModule", "expenseEntry")
                  }
                  className="checkbox"
                />
                <span className="checkbox-label">Expense Entry</span>
              </li>
              <li className="role-item">
                <input
                  type="checkbox"
                  checked={permissions.financeModule.teacherPayments}
                  onChange={() =>
                    handleCheckboxChange("financeModule", "teacherPayments")
                  }
                  className="checkbox"
                />
                <span className="checkbox-label">Teacher Payments</span>
              </li>
              <li className="role-item">
                <input
                  type="checkbox"
                  checked={permissions.financeModule.profitLossSummary}
                  onChange={() =>
                    handleCheckboxChange("financeModule", "profitLossSummary")
                  }
                  className="checkbox"
                />
                <span className="checkbox-label">Profit & Loss Summary</span>
              </li>
            </ul>
          </div>

          {/* Reports */}
          <div className="role-card">
            <h4 className="role-title">Reports</h4>
            <ul className="role-list">
              <li className="role-item">
                <input
                  type="checkbox"
                  checked={permissions.reports.studentAttendance}
                  onChange={() =>
                    handleCheckboxChange("reports", "studentAttendance")
                  }
                  className="checkbox"
                />
                <span className="checkbox-label">Student Attendance</span>
              </li>
              <li className="role-item">
                <input
                  type="checkbox"
                  checked={permissions.reports.teacherPaymentSheet}
                  onChange={() =>
                    handleCheckboxChange("reports", "teacherPaymentSheet")
                  }
                  className="checkbox"
                />
                <span className="checkbox-label">Teacher Payment Sheet</span>
              </li>
              <li className="role-item">
                <input
                  type="checkbox"
                  checked={permissions.reports.incomeVsExpense}
                  onChange={() =>
                    handleCheckboxChange("reports", "incomeVsExpense")
                  }
                  className="checkbox"
                />
                <span className="checkbox-label">Income vs Expense</span>
              </li>
              <li className="role-item">
                <input
                  type="checkbox"
                  checked={permissions.reports.batchWiseStrength}
                  onChange={() =>
                    handleCheckboxChange("reports", "batchWiseStrength")
                  }
                  className="checkbox"
                />
                <span className="checkbox-label">Batch-wise Strength</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Dynamic Button Group */}
        <div className="button-group">
            <button 
                type="button" 
                onClick={handleUpdate}
                // Button is enabled only if a user is loaded AND changes have been made
                disabled={false}
                className="btn-form btn-update-mode"
            >Save
            </button>
            
            <button 
                type="button" 
                onClick={handleReset} 
                className="btn-form btn-reset-mode"
            >
                Reset
            </button>
        </div>
      </div>
    </div>
  );
};

export default AssignRoles;