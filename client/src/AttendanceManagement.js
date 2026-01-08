import React, { useState } from "react";
import "./AttendanceManagement.css";
import axios from "axios";

const API = "http://localhost:5000/api/attendance";

export default function AttendanceManagement() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    academicYear: "2025-2026",
    month: "January",
    className: "8th",
    section: "A",
    date: "",
  });

  const [holiday, setHoliday] = useState(false);

  // --- Validation State ---
  const [errors, setErrors] = useState({
    date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Live validation
    if (name === "date" && value.trim() !== "") {
      setErrors((prev) => ({ ...prev, date: "" }));
    }
  };

  const validateFields = () => {
    let newErrors = {};

    if (!formData.date.trim()) newErrors.date = "Please select a date.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const fetchStudents = async () => {
    if (!validateFields()) return;

    try {
      const res = await axios.get(API, {
        params: {
          date: formData.date,
          className: formData.className,
          section: formData.section,
        },
      });

      const fetchedStudents = res.data?.students || [
        { rollNo: 1, name: "Amit Kumar", attendance: "Present" },
        { rollNo: 2, name: "Sneha Sharma", attendance: "Present" },
      ];

      setStudents(fetchedStudents);
      setHoliday(res.data?.holiday || false);
    } catch (err) {
      //alert("Failed to fetch attendance");
      // fallback default list
      setStudents([
        { rollNo: 1, name: "Amit Kumar", attendance: "Present" },
        { rollNo: 2, name: "Sneha Sharma", attendance: "Present" },
      ]);
      setHoliday(false);
    }
  };

  const markAll = (status) => {
    if (holiday) return;

    setStudents((prev) => prev.map((s) => ({ ...s, attendance: status })));
  };

  const handleAttendanceChange = (index, value) => {
    const updated = [...students];
    updated[index].attendance = value;
    setStudents(updated);
  };

  const saveAttendance = async () => {
    if (!validateFields()) return;

    try {
      await axios.post(API, {
        academicYear: formData.academicYear,
        month: formData.month,
        className: formData.className,
        section: formData.section,
        date: formData.date,
        holiday,
        students,
      });

      //alert("Attendance saved successfully ✅");
    } catch (err) {
      //alert("Failed to save attendance ❌");
    }
  };

  return (
    <div className="attendance-container">
      <div className="attendance-card">
        <h2>Record Attendance</h2>
        <hr />

        <div className="form-grid">
          <div>
            <label>Academic Year</label>
            <select
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
            >
              <option value="2025-2026">2025-2026</option>
              <option value="2024-2025">2024-2025</option>
            </select>
          </div>

          <div>
            <label>Month</label>
            <select name="month" value={formData.month} onChange={handleChange}>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
          </div>

          <div>
            <label>Class</label>
            <select
              name="className"
              value={formData.className}
              onChange={handleChange}
            >
              <option value="8th">8th</option>
              <option value="9th">9th</option>
            </select>
          </div>

          <div>
            <label>Section</label>
            <select
              name="section"
              value={formData.section}
              onChange={handleChange}
            >
              <option value="A">A</option>
              <option value="B">B</option>
            </select>
          </div>

          <div className="date-field">
            <label>Date</label>
            <input
              type="date"
              name="date"
              className={errors.date ? "input-error" : ""}
              value={formData.date}
              onChange={handleChange}
            />
            {errors.date && <p className="error-text">{errors.date}</p>}
          </div>
        </div>

        <div className="actions">
          <button onClick={fetchStudents}>Fetch Student’s List</button>

          <label className="holiday-label">
            <input
              type="checkbox"
              checked={holiday}
              onChange={(e) => setHoliday(e.target.checked)}
            />{" "}
            Mark this day as holiday
          </label>

          <button onClick={() => markAll("Present")}>Mark all Present</button>
          <button onClick={() => markAll("Absent")}>Mark all Absent</button>
        </div>

        <div className="attendance-table-wrapper">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Roll No.</th>
                <th>Student Name</th>
                <th>Attendance</th>
              </tr>
            </thead>

            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="3" className="no-data">
                    No students found
                  </td>
                </tr>
              ) : (
                students.map((s, i) => (
                  <tr key={i}>
                    <td>{s.rollNo}</td>
                    <td>{s.name}</td>
                    <td>
                      <select
                        value={s.attendance}
                        disabled={holiday}
                        onChange={(e) =>
                          handleAttendanceChange(i, e.target.value)
                        }
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="footer-actions">
          <button className="save-btn" onClick={saveAttendance}>
            Save Attendance
          </button>

          <div className="export-buttons">
            <button>Excel</button>
            <button>PDF</button>
          </div>
        </div>
      </div>
    </div>
  );
}
