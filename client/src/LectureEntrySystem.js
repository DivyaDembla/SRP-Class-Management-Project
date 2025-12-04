import React, { useState } from "react";
import CollapsibleCard from "./CollapsibleCard";
import "./LectureEntrySystem.css";

const LectureEntrySystem = () => {
  const [teacher] = useState("Auto generated");
  const [date, setDate] = useState("");
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [subject, setSubject] = useState("");
  const [chapterName, setChapterName] = useState("");
  const [topicDescription, setTopicDescription] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [remarks, setRemarks] = useState("");
  const [timetable, setTimetable] = useState([]);

  // NEW ERROR STATE
  const [errors, setErrors] = useState({});

  // VALIDATION FUNCTION
  const validateForm = () => {
    const newErrors = {};

    if (!date) newErrors.date = "Please select a date.";
    if (!className) newErrors.className = "Please select class.";
    if (!section) newErrors.section = "Please enter section.";
    if (!subject) newErrors.subject = "Please select subject.";
    if (!chapterName) newErrors.chapterName = "Please enter chapter name.";
    if (!timeFrom) newErrors.timeFrom = "Select start time.";
    if (!timeTo) newErrors.timeTo = "Select end time.";

    // ✔ section must be alphanumeric  
    const alphaNum = /^[a-zA-Z0-9]+$/;
    if (section && !alphaNum.test(section)) {
      newErrors.section = "Section must be alphanumeric (e.g., A1, B2).";
    }

    // ✔ time must be valid
    if (timeFrom && timeTo && timeFrom >= timeTo) {
      newErrors.timeTo = "End time must be later than start time.";
    }

    // ✔ date must be today or yesterday
    if (date) {
      const selected = new Date(date);
      const today = new Date();
      const yesterday = new Date();

      today.setHours(0, 0, 0, 0);
      yesterday.setDate(today.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      selected.setHours(0, 0, 0, 0);

      if (selected < yesterday || selected > today) {
        newErrors.date = "Only entries for today or yesterday are allowed.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const newEntry = {
      className,
      section,
      date,
      subject,
      chapterName,
      teacher,
      topicDescription,
      timeFrom,
      timeTo,
      remarks,
    };

    setTimetable([...timetable, newEntry]);

    // reset
    setDate("");
    setClassName("");
    setSection("");
    setSubject("");
    setChapterName("");
    setTopicDescription("");
    setTimeFrom("");
    setTimeTo("");
    setRemarks("");
    setErrors({});
  };

  const handleDelete = (index) => {
    const updated = timetable.filter((_, i) => i !== index);
    setTimetable(updated);
  };

  return (
    <div className="lecture-content">
      <CollapsibleCard title="Lecture Entry System" defaultOpen={false}>
        
        <div className="form-group">
          <label>Teacher</label>
          <input type="text" value={teacher} readOnly />
        </div>

        {/* DATE */}
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              clearError("date");
            }}
          />
          {errors.date && <p className="error-text">{errors.date}</p>}
        </div>

        {/* CLASS */}
        <div className="form-group">
          <label>Class</label>
          <select
            value={className}
            onChange={(e) => {
              setClassName(e.target.value);
              clearError("className");
            }}
          >
            <option value="" disabled hidden>
              Enter Class
            </option>
            <option value="Class 10">Class 10</option>
            <option value="Class 11">Class 11</option>
            <option value="Class 12">Class 12</option>
          </select>
          {errors.className && <p className="error-text">{errors.className}</p>}
        </div>

        {/* SECTION */}
        <div className="form-group">
          <label>Section</label>
          <input
            type="text"
            value={section}
            onChange={(e) => {
              setSection(e.target.value);
              clearError("section");
            }}
            placeholder="Enter Section (e.g., A1)"
          />
          {errors.section && <p className="error-text">{errors.section}</p>}
        </div>

        {/* SUBJECT */}
        <div className="form-group">
          <label>Subject</label>
          <select
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              clearError("subject");
            }}
          >
            <option value="" disabled hidden>
              Enter Subject
            </option>
            <option value="Maths">Maths</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
          </select>
          {errors.subject && <p className="error-text">{errors.subject}</p>}
        </div>

        {/* CHAPTER */}
        <div className="form-group">
          <label>Chapter Name</label>
          <input
            type="text"
            value={chapterName}
            onChange={(e) => {
              setChapterName(e.target.value);
              clearError("chapterName");
            }}
            placeholder="Enter chapter name"
          />
          {errors.chapterName && (
            <p className="error-text">{errors.chapterName}</p>
          )}
        </div>

        {/* TOPIC DESC */}
        <div className="form-group">
          <label>Topic Description</label>
          <textarea
            value={topicDescription}
            onChange={(e) => setTopicDescription(e.target.value)}
            placeholder="Enter topic description"
            rows="3"
          />
        </div>

        {/* TIME */}
        <div className="form-row">
          <div className="form-group">
            <label>Time From</label>
            <input
              type="time"
              value={timeFrom}
              onChange={(e) => {
                setTimeFrom(e.target.value);
                clearError("timeFrom");
              }}
            />
            {errors.timeFrom && <p className="error-text">{errors.timeFrom}</p>}
          </div>

          <div className="form-group">
            <label>Time To</label>
            <input
              type="time"
              value={timeTo}
              onChange={(e) => {
                setTimeTo(e.target.value);
                clearError("timeTo");
              }}
            />
            {errors.timeTo && <p className="error-text">{errors.timeTo}</p>}
          </div>
        </div>

        {/* REMARKS */}
        <div className="form-group">
          <label>Remarks</label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Remarks"
            rows="2"
          />
        </div>

        <button onClick={handleSave} className="save-btn">
          Save
        </button>
      </CollapsibleCard>

      {/* TABLE */}
      <div className="lecture-table">
        <h3>Timetable List</h3>
        <table>
          <thead>
            <tr>
              <th>Class</th>
              <th>Section</th>
              <th>Date</th>
              <th>Time From</th>
              <th>Time To</th>
              <th>Subject</th>
              <th>Chapter</th>
              <th>Teacher</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {timetable.length === 0 ? (
              <tr>
                <td colSpan="9">No records found</td>
              </tr>
            ) : (
              timetable.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.className}</td>
                  <td>{entry.section}</td>
                  <td>{entry.date}</td>
                  <td>{entry.timeFrom}</td>
                  <td>{entry.timeTo}</td>
                  <td>{entry.subject}</td>
                  <td>{entry.chapterName}</td>
                  <td>{entry.teacher}</td>
                  <td>
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
};

export default LectureEntrySystem;
