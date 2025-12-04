import React, { useState } from "react";
import "./Holidaymaster.css";

export default function HolidayMaster() {
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [holidays, setHolidays] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!date || !description || !selectedClass || !selectedSection) {
      alert("Please fill all fields!");
      return;
    }

    const newHoliday = {
      id: Date.now(),
      date,
      description,
      class: selectedClass,
      section: selectedSection,
    };

    setHolidays([...holidays, newHoliday]);

    // Reset form
    setDate("");
    setDescription("");
    setSelectedClass("");
    setSelectedSection("");
  };

  return (
    <div className="holidaymaster-content">
      <div className="holidaymaster-card">
        <h2>Holiday Master</h2>
        <div className="line"></div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Topic Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">Select applicable Class</option>
                <option value="Class 1">Class 1</option>
                <option value="Class 2">Class 2</option>
                <option value="Class 3">Class 3</option>
              </select>
            </div>

            <div className="form-group">
              <label>Section</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <option value="">Select applicable Section</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>
          </div>

          <button type="submit" className="save-btn">
            Save Holiday
          </button>
        </form>
      </div>

      {/* Holiday List */}
      <div className="holidaymaster-list">
        <h3>Saved Holidays</h3>
        {holidays.length === 0 ? (
          <p>No holidays added yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Class</th>
                <th>Section</th>
              </tr>
            </thead>
            <tbody>
              {holidays.map((holiday) => (
                <tr key={holiday.id}>
                  <td>{holiday.date}</td>
                  <td>{holiday.description}</td>
                  <td>{holiday.class}</td>
                  <td>{holiday.section}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
