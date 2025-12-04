import React, { useState } from "react";
import CollapsibleCard from "./CollapsibleCard";
import "./TimeTableManagement.css";

export default function TimetableManagement() {
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
  const [editIndex, setEditIndex] = useState(null);

  // VALIDATION FUNCTION
  const validateForm = () => {
    const newErrors = {};

    if (!formData.className) newErrors.className = "Please select class.";
    if (!formData.day) newErrors.day = "Please select day.";
    if (!formData.timeFrom) newErrors.timeFrom = "Select start time.";
    if (!formData.timeTo) newErrors.timeTo = "Select end time.";
    if (!formData.subject) newErrors.subject = "Choose a subject.";
    if (!formData.teacher) newErrors.teacher = "Choose a teacher.";

    // check if timeFrom < timeTo
    if (formData.timeFrom && formData.timeTo) {
      if (formData.timeFrom >= formData.timeTo) {
        newErrors.timeTo = "End time must be later than start time.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // remove error instantly when corrected
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (editIndex !== null) {
      const updated = [...timetables];
      updated[editIndex] = formData;
      setTimetables(updated);
      setEditIndex(null);
    } else {
      setTimetables([...timetables, formData]);
    }

    handleReset();
  };

  const handleEdit = (index) => {
    setFormData(timetables[index]);
    setEditIndex(index);
    setErrors({});
  };

  const handleDelete = (index) => {
    const updated = timetables.filter((_, i) => i !== index);
    setTimetables(updated);
  };

  const handleReset = () => {
    setFormData({
      className: "",
      day: "",
      timeFrom: "",
      timeTo: "",
      subject: "",
      teacher: "",
    });
    setErrors({});
    setEditIndex(null);
  };

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
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
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
            {errors.timeFrom && (
              <p className="error-text">{errors.timeFrom}</p>
            )}
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
            {errors.timeTo && (
              <p className="error-text">{errors.timeTo}</p>
            )}
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

          {/* TEACHER */}
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
              <option value="Mr. Sharma">Mr. Sharma</option>
              <option value="Ms. Gupta">Ms. Gupta</option>
            </select>
            {errors.teacher && <p className="error-text">{errors.teacher}</p>}
          </div>

          <div className="form-group buttons-group">
            <button type="submit" className="save-btn">
              {editIndex !== null ? "Update" : "Save"}
            </button>
            <button type="button" onClick={handleReset} className="delete-btn">
              Reset
            </button>
          </div>
        </form>
      </CollapsibleCard>

      {/* LIST */}
      <div className="timeTable-list">
        <h3>Timetable List</h3>
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
              timetables.map((row, index) => (
                <tr key={index}>
                  <td>{row.className}</td>
                  <td>{row.day}</td>
                  <td>{row.timeFrom}</td>
                  <td>{row.timeTo}</td>
                  <td>{row.subject}</td>
                  <td>{row.teacher}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(index)}
                      className="save-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
