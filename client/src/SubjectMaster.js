import { useEffect } from "react";
import axios from "axios";

import React, { useState } from "react";
import CollapsibleCard from "./CollapsibleCard";
import "./SubjectMaster.css"; // reuse same styling

export default function SubjectMaster() {
  const [classList, setClassList] = useState([]);

  // form state
  const [selectedClass, setSelectedClass] = useState("");
  const [subjects, setSubjects] = useState([""]);

  // table records
  const [records, setRecords] = useState([]);

  // filter
  const [filterClass, setFilterClass] = useState("All");

  const SUBJECT_API = "http://localhost:5000/api/subjects";

  /* add new subject row */
  const addRow = () => {
    setSubjects([...subjects, ""]);
  };

  /* change subject value */
  const handleChange = (index, value) => {
    const arr = [...subjects];
    arr[index] = value;
    setSubjects(arr);
  };

  /* save subjects (frontend only) */
  const handleSave = async () => {
    if (!selectedClass) return alert("Select Standard");

    const cls = classList.find((c) => c._id === selectedClass);

    const payload = {
      classId: cls._id,
      standard: `${cls.name} ${cls.section}`,
      subjects: subjects.filter((s) => s.trim() !== ""),
    };

    try {
      const res = await axios.post(SUBJECT_API, payload);

      // update table instantly
      setRecords((prev) => {
        const filtered = prev.filter(
          (r) => String(r.classId) !== String(res.data.classId),
        );
        return [...filtered, res.data];
      });

      setSelectedClass("");
      setSubjects([""]);
    } catch (err) {
      alert("Failed to save subjects");
    }
  };

  /* filter table */
  const filtered =
    filterClass === "All"
      ? records
      : records.filter((r) => String(r.classId) === String(filterClass));

  useEffect(() => {
    fetchClasses();
    fetchSubjects();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/classes");

      // only active classes (optional but better)
      const active = res.data.filter((c) => c.status === "Active");

      // sort ascending: FY → SY → TY etc
      active.sort((a, b) =>
        `${a.name} ${a.section}`.localeCompare(`${b.name} ${b.section}`),
      );

      setClassList(active);
    } catch (err) {
      console.error("Failed to load classes", err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await axios.get(SUBJECT_API);
      setRecords(res.data);
    } catch (err) {
      console.error("Failed to load subjects", err);
    }
  };

  return (
    <div className="classmaster-content">
      {/* ADD SUBJECT CARD */}
      <CollapsibleCard title="Add Subjects" defaultOpen={false}>
        <div className="subject-row">
          <div className="form-group standard-group">
            <label>Standard:</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">Select Standard</option>
              {classList.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} {c.section}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group subject-group">
            <label>Subjects:</label>
            {subjects.map((s, i) => (
              <input
                key={i}
                className="subject-input"
                value={s}
                placeholder="Enter Subject"
                onChange={(e) => handleChange(i, e.target.value)}
              />
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button onClick={addRow}>Add More</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </CollapsibleCard>

      {/* TABLE CARD */}
      <div className="table-card">
        <h2>Subject List</h2>
        <hr />

        <div className="form-group">
          <label>Filter by Standard:</label>
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
          >
            <option value="All">All Standards</option>
            {classList.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} {c.section}
              </option>
            ))}
          </select>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Standard</th>
                <th>Subject</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={2} className="empty">
                    No subjects added
                  </td>
                </tr>
              ) : (
                filtered.flatMap((r) =>
                  r.subjects.map((sub, i) => (
                    <tr key={r.classId + i}>
                      <td>{r.standard}</td>
                      <td>{sub}</td>
                    </tr>
                  )),
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
