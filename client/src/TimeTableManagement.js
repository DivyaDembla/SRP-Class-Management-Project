import React, { useState, useEffect } from "react";
import CollapsibleCard from "./CollapsibleCard";
import "./TimeTableManagement.css";
import axios from "axios";

const API = "http://localhost:5000/api/timetable";
const TEACHER_API = "http://localhost:5000/api/teachers";

export default function TimetableManagement() {
  const [teachers, setTeachers] = useState([]);
  const [timetables, setTimetables] = useState([]);

  const [formData, setFormData] = useState({
    className: "",
    day: "",
    timeFrom: "",
    timeTo: "",
    subject: "",
    teacher: "",
  });

  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);

  // ---------------- FETCH ON LOAD ----------------
  useEffect(() => {
    fetchTimetables();
    fetchTeachers(); // 🔥 IMPORTANT
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(TEACHER_API);
      setTeachers(res.data);
    } catch (err) {
      console.error("Failed to fetch teachers", err);
    }
  };

  const fetchTimetables = async () => {
    try {
      const res = await axios.get(API);
      setTimetables(res.data);
    } catch (err) {
      console.error("Failed to fetch timetables", err);
    }
  };

  // ---------------- VALIDATION ----------------
  const validateForm = () => {
    const newErrors = {};

    if (!formData.className) newErrors.className = "Please select class.";
    if (!formData.day) newErrors.day = "Please select day.";
    if (!formData.timeFrom) newErrors.timeFrom = "Select start time.";
    if (!formData.timeTo) newErrors.timeTo = "Select end time.";
    if (!formData.subject) newErrors.subject = "Choose a subject.";
    if (!formData.teacher) newErrors.teacher = "Choose a teacher.";

    if (
      formData.timeFrom &&
      formData.timeTo &&
      formData.timeFrom >= formData.timeTo
    ) {
      newErrors.timeTo = "End time must be later than start time.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------- INPUT CHANGE ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ---------------- SAVE / UPDATE ----------------
  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editId) {
        await axios.put(`${API}/${editId}`, formData);
        alert("Timetable updated successfully ✅");
      } else {
        await axios.post(API, formData);
        alert("Timetable saved successfully ✅");
      }

      resetForm();
      fetchTimetables();
    } catch (err) {
      console.error("Failed to save timetable", err);
    }
  };

  // ---------------- EDIT ----------------
  const handleEdit = (row) => {
    setFormData({
      className: row.className,
      day: row.day,
      timeFrom: row.timeFrom,
      timeTo: row.timeTo,
      subject: row.subject,
      teacher: row.teacher,
    });
    setEditId(row._id);
    setErrors({});
  };

  // ---------------- DEACTIVATE ----------------
  const handleToggle = async (id) => {
    const res = await axios.patch(`${API}/${id}/toggle`);

    setTimetables((prev) =>
      prev.map((t) => (t._id === res.data._id ? res.data : t))
    );
  };

  // ---------------- RESET ----------------
  const resetForm = () => {
    setFormData({
      className: "",
      day: "",
      timeFrom: "",
      timeTo: "",
      subject: "",
      teacher: "",
    });
    setErrors({});
    setEditId(null);
  };

  // ---------------- UI ----------------
  return (
    <div className="timeTable-content">
      <CollapsibleCard title="Create / Manage Timetable" defaultOpen={false}>
        <form onSubmit={handleSave} className="form-row">
          {/* CLASS */}
          <div className="form-group">
            <label>Class</label>
            <select
              name="className"
              value={formData.className}
              onChange={handleChange}
            >
              <option value="" disabled hidden>
                Select Class
              </option>
              <option value="Class 1">Class 1</option>
              <option value="Class 2">Class 2</option>
            </select>
            {errors.className && (
              <p className="error-text">{errors.className}</p>
            )}
          </div>

          {/* DAY */}
          <div className="form-group">
            <label>Day</label>
            <select name="day" value={formData.day} onChange={handleChange}>
              <option value="" disabled hidden>
                Select Day
              </option>
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            {errors.day && <p className="error-text">{errors.day}</p>}
          </div>

          {/* TIME FROM */}
          <div className="form-group">
            <label>Time From</label>
            <input
              type="time"
              name="timeFrom"
              value={formData.timeFrom}
              onChange={handleChange}
            />
            {errors.timeFrom && <p className="error-text">{errors.timeFrom}</p>}
          </div>

          {/* TIME TO */}
          <div className="form-group">
            <label>Time To</label>
            <input
              type="time"
              name="timeTo"
              value={formData.timeTo}
              onChange={handleChange}
            />
            {errors.timeTo && <p className="error-text">{errors.timeTo}</p>}
          </div>

          {/* SUBJECT */}
          <div className="form-group">
            <label>Subject</label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
            >
              <option value="" disabled hidden>
                Select Subject
              </option>
              <option value="Math">Math</option>
              <option value="Science">Science</option>
            </select>
            {errors.subject && <p className="error-text">{errors.subject}</p>}
          </div>

          {/* TEACHER (FROM BACKEND) */}
          <div className="form-group">
            <label>Teacher</label>
            <select
              name="teacher"
              value={formData.teacher}
              onChange={handleChange}
            >
              <option value="" disabled hidden>
                Select Teacher
              </option>

              {teachers
                .filter((t) => t.status === "Active")
                .map((t) => (
                  <option key={t._id} value={t.fullName}>
                    {t.fullName}
                  </option>
                ))}
            </select>
            {errors.teacher && <p className="error-text">{errors.teacher}</p>}
          </div>

          {/* BUTTONS */}
          <div className="form-group buttons-group">
            <button type="submit" className="save-btn">
              {editId ? "Update" : "Save"}
            </button>
            <button type="button" onClick={resetForm} className="delete-btn">
              Reset
            </button>
          </div>
        </form>
      </CollapsibleCard>

      {/* LIST */}
      <div className="timeTable-list">
        <h3>Timetable List</h3>

        <div className="timeTable-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Class</th>
                <th>Day</th>
                <th>Time From</th>
                <th>Time To</th>
                <th>Subject</th>
                <th>Teacher</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {timetables.length === 0 ? (
                <tr>
                  <td colSpan="7" className="timeTable-no-data">
                    No records found
                  </td>
                </tr>
              ) : (
                timetables.map((row) => (
                  <tr key={row._id}>
                    <td>{row.className}</td>
                    <td>{row.day}</td>
                    <td>{row.timeFrom}</td>
                    <td>{row.timeTo}</td>
                    <td>{row.subject}</td>
                    <td>{row.teacher}</td>
                    <td className="action-cell">
                      <span
                        className="action-edit"
                        onClick={() => handleEdit(row)}
                      >
                        Edit
                      </span>

                      {row.status === "Active" ? (
                        <button
                          className="btn-deactivate"
                          onClick={() => handleToggle(row._id)}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          className="btn-activate"
                          onClick={() => handleToggle(row._id)}
                        >
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
