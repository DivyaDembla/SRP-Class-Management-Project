import React, { useState } from "react";
import CollapsibleCard from "./CollapsibleCard";
import "./LectureEntrySystem.css";
import axios from "axios";

const API = "http://localhost:5000/api/lecture-entry";

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

  React.useEffect(() => {
    fetchLectures();
  }, []);

  const fetchLectures = async () => {
    const res = await axios.get(API);
    setTimetable(res.data);
  };

  // ERROR STATE
  const [errors, setErrors] = useState({});

  const alphaNum = /^[a-zA-Z0-9]+$/;

  // VALIDATE INDIVIDUAL FIELD
  const validateField = (field, value) => {
    let error = "";

    switch (field) {
      case "date":
        if (!value) error = "Please select a date.";
        else {
          const selected = new Date(value);
          const today = new Date();
          const yesterday = new Date();
          today.setHours(0, 0, 0, 0);
          yesterday.setDate(today.getDate() - 1);
          yesterday.setHours(0, 0, 0, 0);
          selected.setHours(0, 0, 0, 0);
          if (selected < yesterday || selected > today)
            error = "Only entries for today or yesterday are allowed.";
        }
        break;
      case "className":
        if (!value) error = "Please select class.";
        break;
      case "section":
        if (!value) error = "Please enter section.";
        else if (!alphaNum.test(value))
          error = "Section must be alphanumeric (e.g., A1, B2).";
        break;
      case "subject":
        if (!value) error = "Please select subject.";
        break;
      case "chapterName":
        if (!value) error = "Please enter chapter name.";
        break;
      case "timeFrom":
        if (!value) error = "Select start time.";
        break;
      case "timeTo":
        if (!value) error = "Select end time.";
        else if (timeFrom && value <= timeFrom)
          error = "End time must be later than start time.";
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return error === "";
  };

  // VALIDATE ENTIRE FORM
  const validateForm = () => {
    const values = {
      date,
      className,
      section,
      subject,
      chapterName,
      timeFrom,
      timeTo,
    };

    return Object.keys(values).every((field) =>
      validateField(field, values[field])
    );
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const payload = {
      teacher,
      date,
      className,
      section,
      subject,
      chapterName,
      topicDescription,
      timeFrom,
      timeTo,
      remarks,
    };

    try {
      const res = await axios.post(API, payload);
      setTimetable((prev) => [res.data, ...prev]);

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
    } catch (err) {
      alert("Failed to save lecture");
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchLectures();
  };

  return (
    <div className="lecture-content">
      <CollapsibleCard title="Lecture Entry System" defaultOpen={false}>
        {/* TEACHER */}
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
              validateField("date", e.target.value); // Live validation
            }}
            onBlur={() => validateField("date", date)}
            className={errors.date ? "error-border" : ""}
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
              validateField("className", e.target.value); // Live validation
            }}
            onBlur={() => validateField("className", className)}
            className={errors.className ? "error-border" : ""}
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
            placeholder="Enter Section (e.g., A1)"
            onChange={(e) => {
              setSection(e.target.value);
              validateField("section", e.target.value); // Live validation
            }}
            onBlur={() => validateField("section", section)}
            className={errors.section ? "error-border" : ""}
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
              validateField("subject", e.target.value); // Live validation
            }}
            onBlur={() => validateField("subject", subject)}
            className={errors.subject ? "error-border" : ""}
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
            placeholder="Enter chapter name"
            onChange={(e) => {
              setChapterName(e.target.value);
              validateField("chapterName", e.target.value); // Live validation
            }}
            onBlur={() => validateField("chapterName", chapterName)}
            className={errors.chapterName ? "error-border" : ""}
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
                validateField("timeFrom", e.target.value); // Live validation
              }}
              onBlur={() => validateField("timeFrom", timeFrom)}
              className={errors.timeFrom ? "error-border" : ""}
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
                validateField("timeTo", e.target.value); // Live validation
              }}
              onBlur={() => validateField("timeTo", timeTo)}
              className={errors.timeTo ? "error-border" : ""}
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

        <div className="lecture-table-wrapper">
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
                  <td colSpan="9" className="lecture-no-data">
                    No records found
                  </td>
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
                        onClick={() => handleDelete(entry._id)}
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
    </div>
  );
};

export default LectureEntrySystem;
