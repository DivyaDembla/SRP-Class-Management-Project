import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AssignRoles.css";

const API = "http://localhost:5000/api/permissions";

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

  const [isPermissionsChanged, setIsPermissionsChanged] = useState(false);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [userError, setUserError] = useState("");

  // ------------------------------
  // FETCH USER + PERMISSIONS
  // ------------------------------
  useEffect(() => {
    const code = userCode.trim();

    if (code.length === 0) {
      setUsername("");
      setLocation("");
      setPermissions(initialPermissions);
      setIsUserLoaded(false);
      setUserError("");
      return;
    }

    if (code.length < 3) {
      setUserError("Enter at least 3 characters");
      setUsername("");
      setLocation("");
      setPermissions(initialPermissions);
      setIsUserLoaded(false);
      return;
    } else {
      setUserError("");
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API}/${code}`);
        const data = res.data;

        setUsername(data.user.name);
        setLocation(data.user.location.join(", "));
        setPermissions(data.permissions || initialPermissions);

        setIsPermissionsChanged(false);
        setIsUserLoaded(true);
        setUserError("");
      } catch (err) {
        setUsername("");
        setLocation("");
        setPermissions(initialPermissions);
        setIsUserLoaded(false);
        setUserError("❌ User not found");
      }
    };

    fetchUser();
  }, [userCode]);

  // ------------------------------
  // HANDLE CHECKBOX CHANGE
  // ------------------------------
  const handleCheckboxChange = (module, permission) => {
    setPermissions((prev) => {
      const updated = {
        ...prev,
        [module]: {
          ...prev[module],
          [permission]: !prev[module][permission],
        },
      };
      setIsPermissionsChanged(true);
      return updated;
    });
  };

  // ------------------------------
  // RESET FORM
  // ------------------------------
  const handleReset = () => {
    setUserCode("");
    setUsername("");
    setLocation("");
    setPermissions(initialPermissions);
    setIsPermissionsChanged(false);
    setIsUserLoaded(false);
    setUserError("");
  };

  // ------------------------------
  // SAVE OR UPDATE PERMISSIONS
  // ------------------------------
  const handleUpdate = async () => {
    if (!userCode.trim()) {
      alert("❌ Please enter a User Code");
      return;
    }

    if (!isUserLoaded) {
      alert("❌ User not found. Cannot update permissions.");
      return;
    }

    try {
      await axios.post(`${API}/update`, { userCode, permissions });
      alert("✅ Permissions updated successfully!");
      handleReset();
    } catch (err) {
      alert("❌ Failed to update permissions");
      console.log(err);
    }
  };

  return (
    <div className="assignroles-content">
      <div className="card">
        <h2 className="title">Assign Roles</h2>
        <hr className="divider" />

        {/* User info section */}
        <div className="form-grid">
          <div>
            <label className="label">User Code</label>
            <input
              type="text"
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              placeholder="Enter User Code"
              className="input"
            />
            {userError && (
              <p style={{ color: "red", marginTop: "4px" }}>{userError}</p>
            )}
          </div>

          <div>
            <label className="label">Username</label>
            <input
              type="text"
              value={username}
              placeholder=""
              className="input input-disabled"
              disabled
            />
          </div>

          <div>
            <label className="label">Location</label>
            <input
              type="text"
              value={location}
              placeholder=""
              className="input input-disabled"
              disabled
            />
          </div>
        </div>

        <h3 className="subtitle">List of Roles</h3>
        <hr className="divider" />

        {/* ---------------- PERMISSION SECTIONS ---------------- */}
        <div className="roles-grid">
          {/* Student Management */}
          <div className="role-card">
            <h4 className="role-title">Student Management</h4>
            <ul className="role-list">
              {Object.keys(initialPermissions.studentManagement).map(
                (permKey) => (
                  <li className="role-item" key={permKey}>
                    <input
                      type="checkbox"
                      checked={permissions.studentManagement[permKey]}
                      onChange={() =>
                        handleCheckboxChange("studentManagement", permKey)
                      }
                    />
                    {permKey.replace(/([A-Z])/g, " $1")}
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Teacher Management */}
          <div className="role-card">
            <h4 className="role-title">Teacher Management</h4>
            <ul className="role-list">
              {Object.keys(initialPermissions.teacherManagement).map(
                (permKey) => (
                  <li className="role-item" key={permKey}>
                    <input
                      type="checkbox"
                      checked={permissions.teacherManagement[permKey]}
                      onChange={() =>
                        handleCheckboxChange("teacherManagement", permKey)
                      }
                    />
                    {permKey.replace(/([A-Z])/g, " $1")}
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Timetable & Batches */}
          <div className="role-card">
            <h4 className="role-title">Timetable & Batches</h4>
            <ul className="role-list">
              {Object.keys(initialPermissions.timetableBatches).map(
                (permKey) => (
                  <li className="role-item" key={permKey}>
                    <input
                      type="checkbox"
                      checked={permissions.timetableBatches[permKey]}
                      onChange={() =>
                        handleCheckboxChange("timetableBatches", permKey)
                      }
                    />
                    {permKey.replace(/([A-Z])/g, " $1")}
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Attendance Module */}
          <div className="role-card">
            <h4 className="role-title">Attendance Module</h4>
            <ul className="role-list">
              {Object.keys(initialPermissions.attendanceModule).map(
                (permKey) => (
                  <li className="role-item" key={permKey}>
                    <input
                      type="checkbox"
                      checked={permissions.attendanceModule[permKey]}
                      onChange={() =>
                        handleCheckboxChange("attendanceModule", permKey)
                      }
                    />
                    {permKey.replace(/([A-Z])/g, " $1")}
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Finance Module */}
          <div className="role-card">
            <h4 className="role-title">Finance Module</h4>
            <ul className="role-list">
              {Object.keys(initialPermissions.financeModule).map((permKey) => (
                <li className="role-item" key={permKey}>
                  <input
                    type="checkbox"
                    checked={permissions.financeModule[permKey]}
                    onChange={() =>
                      handleCheckboxChange("financeModule", permKey)
                    }
                  />
                  {permKey.replace(/([A-Z])/g, " $1")}
                </li>
              ))}
            </ul>
          </div>

          {/* Reports */}
          <div className="role-card">
            <h4 className="role-title">Reports</h4>
            <ul className="role-list">
              {Object.keys(initialPermissions.reports).map((permKey) => (
                <li className="role-item" key={permKey}>
                  <input
                    type="checkbox"
                    checked={permissions.reports[permKey]}
                    onChange={() => handleCheckboxChange("reports", permKey)}
                  />
                  {permKey.replace(/([A-Z])/g, " $1")}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Buttons */}
        <div className="button-group">
          {isUserLoaded && !isPermissionsChanged && (
            <button
              type="button"
              onClick={handleUpdate}
              className="btn-form btn-update-mode"
            >
              Save
            </button>
          )}

          {isUserLoaded && isPermissionsChanged && (
            <button
              type="button"
              onClick={handleUpdate}
              className="btn-form btn-update-mode"
              style={{ background: "green" }}
            >
              Update
            </button>
          )}

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
