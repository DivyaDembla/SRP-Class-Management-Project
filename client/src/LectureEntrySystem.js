import React, { useEffect, useState } from "react";
import CollapsibleCard from "./CollapsibleCard";
import "./LectureEntrySystem.css";
import axios from "axios";

const API = "http://localhost:5000/api/lecture-entry";
const TEACHER_API = "http://localhost:5000/api/teachers";
const CLASS_API = "http://localhost:5000/api/classes";

const LectureEntrySystem = () => {
  /* ---------- FORM STATE ---------- */
  const [teacher, setTeacher] = useState("");
  const [teacherSubjects, setTeacherSubjects] = useState([]);
  const [date, setDate] = useState("");
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [subject, setSubject] = useState("");
  const [chapterName, setChapterName] = useState("");
  const [topicDescription, setTopicDescription] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [remarks, setRemarks] = useState("");
  const [classId, setClassId] = useState("");

  /* ---------- MASTER DATA ---------- */
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [timetable, setTimetable] = useState([]);

  /* ---------- ERRORS ---------- */
  const [errors, setErrors] = useState({});
  const alphaNum = /^[a-zA-Z0-9]+$/;

  /* ---------- FETCH DATA ---------- */
  useEffect(() => {
  fetchLectures();
  fetchTeachers();
  fetchClasses();
  const today = new Date().toISOString().split("T")[0];
  setDate(today);
}, []);

  const fetchLectures = async () => {
    const res = await axios.get(API);
    setTimetable(res.data);
  };

  const fetchTeachers = async () => {
    const res = await axios.get(TEACHER_API);
    setTeachers(res.data.filter((t) => t.status === "Active"));
  };

  const fetchClasses = async () => {
    const res = await axios.get(CLASS_API);
    setClasses(res.data.filter((c) => c.status === "Active"));
  };

  /* ---------- VALIDATION ---------- */
  const validateField = (field, value) => {
    let error = "";

    switch (field) {
      case "teacher":
        if (!value) error = "Please select a teacher.";
        break;
      case "date":
        if (!value) error = "Please select a date.";
        break;
      case "className":
        if (!value) error = "Please select class.";
        break;
      case "section":
        if (!value) error = "Section required.";
        else if (!alphaNum.test(value)) error = "Section must be alphanumeric.";
        break;
      case "subject":
        if (!value) error = "Please select subject.";
        break;
      case "chapterName":
        if (!value) error = "Enter chapter name.";
        break;
      case "timeFrom":
        if (!value) error = "Select start time.";
        break;
      case "timeTo":
        if (!value) error = "Select end time.";
        else if (timeFrom && value <= timeFrom)
          error = "End time must be after start time.";
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return error === "";
  };

  const validateForm = () => {
    const values = {
      teacher,
      date,
      className,
      section,
      subject,
      chapterName,
      timeFrom,
      timeTo,
    };
    return Object.keys(values).every((f) => validateField(f, values[f]));
  };

  /* ---------- SAVE ---------- */
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

    const res = await axios.post(API, payload);
    setTimetable((prev) => [res.data, ...prev]);
    resetForm();
  };

  const resetForm = () => {
    setTeacher("");
    setTeacherSubjects([]);
    setDate("");
    setClassName("");
    setClassId("");
    setSection("");
    setSubject("");
    setChapterName("");
    setTopicDescription("");
    setTimeFrom("");
    setTimeTo("");
    setRemarks("");
    setErrors({});
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchLectures();
  };

  /* ---------- UI ---------- */
  return (
    <div className="lecture-content">
      <CollapsibleCard title="Lecture Entry System" defaultOpen={false}>
        {/* ROW 1 */}
        <div className="form-row">
          <div className="form-group">
            <label>Teacher</label>
            <select
              value={teacher}
              onChange={(e) => {
                const selectedTeacher = teachers.find(
                  (t) => t.fullName === e.target.value
                );

                setTeacher(e.target.value);
                setSubject(""); // reset subject
                setTeacherSubjects(selectedTeacher?.subjects || []);

                validateField("teacher", e.target.value);
              }}
              onBlur={() => validateField("teacher", teacher)}
              className={errors.teacher ? "error-border" : ""}
            >
              <option value="" hidden>
                Select Teacher
              </option>
              {teachers.map((t) => (
                <option key={t._id} value={t.fullName}>
                  {t.fullName}
                </option>
              ))}
            </select>
            {errors.teacher && <p className="error-text">{errors.teacher}</p>}
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                validateField("date", e.target.value);
              }}
              className={errors.date ? "error-border" : ""}
            />
            {errors.date && <p className="error-text">{errors.date}</p>}
          </div>
        </div>

        {/* ROW 2 */}
        <div className="form-row">
          <div className="form-group">
            <label>Class</label>
            <select
              value={classId}
              onChange={(e) => {
                const selected = classes.find((c) => c._id === e.target.value);

                setClassId(e.target.value); // ✅ id for select
                setClassName(selected.name); // ✅ name for backend
                setSection(selected.section || "");

                validateField("className", selected.name);
              }}
              className={errors.className ? "error-border" : ""}
            >
              <option value="" hidden>
                Select Class
              </option>

              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} {c.section && `(${c.section})`}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Section</label>
            <input
              value={section}
              onChange={(e) => {
                setSection(e.target.value);
                validateField("section", e.target.value);
              }}
            />
            {errors.section && <p className="error-text">{errors.section}</p>}
          </div>
        </div>

        {/* SUBJECT (LOCKED UNTIL TEACHER) */}
        <div className="form-group">
          <label>Subject</label>
          <select
            value={subject}
            disabled={!teacher}
            onChange={(e) => {
              setSubject(e.target.value);
              validateField("subject", e.target.value);
            }}
            className={errors.subject ? "error-border" : ""}
          >
            <option value="" hidden>
              {teacher ? "Select Subject" : "Select Teacher First"}
            </option>

            {teacherSubjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
          {errors.subject && <p className="error-text">{errors.subject}</p>}
        </div>

        {/* CHAPTER */}
        <div className="form-group">
          <label>Chapter Name</label>
          <input
            value={chapterName}
            onChange={(e) => {
              setChapterName(e.target.value);
              validateField("chapterName", e.target.value);
            }}
          />
          {errors.chapterName && (
            <p className="error-text">{errors.chapterName}</p>
          )}
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
                validateField("timeFrom", e.target.value);
                if (timeTo) validateField("timeTo", timeTo);
              }}
            />
          </div>

          <div className="form-group">
            <label>Time To</label>
            <input
              type="time"
              value={timeTo}
              onChange={(e) => {
                setTimeTo(e.target.value);
                validateField("timeTo", e.target.value);
              }}
            />
          </div>
        </div>

        {/* REMARKS */}
        <div className="form-group">
          <label>Remarks</label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
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
                <th>From</th>
                <th>To</th>
                <th>Subject</th>
                <th>Chapter</th>
                <th>Teacher</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {timetable.length === 0 ? (
                <tr>
                  <td colSpan="9">No records found</td>
                </tr>
              ) : (
                timetable.map((e) => (
                  <tr key={e._id}>
                    <td>{e.className}</td>
                    <td>{e.section}</td>
                    <td>{e.date}</td>
                    <td>{e.timeFrom}</td>
                    <td>{e.timeTo}</td>
                    <td>{e.subject}</td>
                    <td>{e.chapterName}</td>
                    <td>{e.teacher}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(e._id)}
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
