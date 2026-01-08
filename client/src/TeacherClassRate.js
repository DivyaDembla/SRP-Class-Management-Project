import React, { useEffect, useState } from "react";
import "./TeacherClassRate.css";
import axios from "axios";

const RATE_API = "http://localhost:5000/api/teacher-class-rates";
const TEACHER_API = "http://localhost:5000/api/teachers";
const CLASS_API = "http://localhost:5000/api/classes";

const TeacherClassRate = () => {
  // ---------------- FORM STATE ----------------
  const [teacherName, setTeacherName] = useState("");
  const [classValue, setClassValue] = useState("");
  const [sectionValue, setSectionValue] = useState("");
  const [subjectRates, setSubjectRates] = useState({});
  const [editingId, setEditingId] = useState(null); // ✅ NEW

  // ---------------- MASTER DATA ----------------
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [rates, setRates] = useState([]);

  // ---------------- FILTERS ----------------
  const [filterTeacher, setFilterTeacher] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterSection, setFilterSection] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // ---------------- ERRORS ----------------
  const [errors, setErrors] = useState({
    teacherName: "",
    classValue: "",
    sectionValue: "",
    subjects: "",
    rates: {},
  });

  const allSections = ["A", "B", "C", "D"];

  const subjects = [
    "Math",
    "Science",
    "English",
    "History",
    "Geography",
    "Computer",
    "Physics",
    "Chemistry",
    "Biology",
  ];

  // ---------------- FETCH DATA ----------------
  useEffect(() => {
    fetchTeachers();
    fetchClasses();
    fetchRates();
  }, []);

  const fetchTeachers = async () => {
    const res = await axios.get(TEACHER_API);
    setTeachers(res.data);
  };

  const fetchClasses = async () => {
    const res = await axios.get(CLASS_API);
    setClasses(res.data);
  };

  const fetchRates = async () => {
    const res = await axios.get(RATE_API);
    setRates(res.data);
  };

  // ---------------- SUBJECT HANDLERS ----------------
  const handleSubjectToggle = (subject) => {
    setSubjectRates((prev) => {
      const updated = { ...prev };
      if (updated[subject]) delete updated[subject];
      else updated[subject] = "";
      return updated;
    });
  };

  const handleRateChange = (subject, value) => {
    setSubjectRates((prev) => ({ ...prev, [subject]: value }));
  };

  // ---------------- VALIDATION ----------------
  const validateForm = () => {
    let newErrors = {};

    if (!teacherName) newErrors.teacherName = "Teacher required";
    if (!classValue) newErrors.classValue = "Class required";
    if (!sectionValue) newErrors.sectionValue = "Section required";
    if (Object.keys(subjectRates).length === 0)
      newErrors.subjects = "Select at least one subject";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------- ADD / UPDATE ----------------
  const handleAddRate = async () => {
    if (!validateForm()) return;

    const payload = Object.keys(subjectRates).map((subject) => ({
      teacherName,
      classValue,
      sectionValue,
      subject,
      rate: Number(subjectRates[subject]),
      status: "Active",
    }));

    if (editingId) {
      // Editing only ONE record (keep as-is)
      const subject = Object.keys(subjectRates)[0];
      await axios.put(`${RATE_API}/${editingId}`, {
        teacherName,
        classValue,
        sectionValue,
        subject,
        rate: Number(subjectRates[subject]),
      });
    } else {
      // ADD MULTIPLE SUBJECTS
      await axios.post(RATE_API, payload);
    }

    resetForm();
    fetchRates();
  };

  // ---------------- EDIT ----------------
  const handleEdit = (row) => {
    setEditingId(row._id);
    setTeacherName(row.teacherName);
    setClassValue(row.classValue);
    setSectionValue(row.sectionValue);
    setSubjectRates({ [row.subject]: row.rate.toString() });
  };

  // ---------------- TOGGLE STATUS ----------------
  const handleToggleStatus = async (id, status) => {
    await axios.patch(`${RATE_API}/${id}/status`, {
      status: status === "Active" ? "Inactive" : "Active",
    });
    fetchRates();
  };

  const resetForm = () => {
    setTeacherName("");
    setClassValue("");
    setSectionValue("");
    setSubjectRates({});
    setEditingId(null);
    setErrors({});
  };

  // ---------------- FILTER ----------------
  const filteredRates = rates.filter(
    (r) =>
      (!filterTeacher || r.teacherName === filterTeacher) &&
      (!filterClass || r.classValue === filterClass) &&
      (!filterSection || r.sectionValue === filterSection) &&
      (!filterStatus || r.status === filterStatus)
  );

  // ---------------- UI ----------------
  return (
    <div className="tcr-card">
      <h1>Teacher–Class Rate Management</h1>

      {/* FORM (UNCHANGED UI) */}
      <div className="tcr-form-grid">
        <div>
          <label>Teacher</label>
          <select
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
          >
            <option value="">Select Teacher</option>
            {teachers
              .filter((t) => t.status === "Active")
              .map((t) => (
                <option key={t._id} value={t.fullName}>
                  {t.fullName}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label>Class</label>
          <select
            value={classValue}
            onChange={(e) => setClassValue(e.target.value)}
          >
            <option value="">Select Class</option>
            {classes
              .filter((c) => c.status === "Active")
              .map((c) => {
                const val = `${c.name}${c.section ? " - " + c.section : ""}`;
                return (
                  <option key={c._id} value={val}>
                    {val}
                  </option>
                );
              })}
          </select>
        </div>

        <div>
          <label>Section</label>
          <select
            value={sectionValue}
            onChange={(e) => setSectionValue(e.target.value)}
          >
            <option value="">Select Section</option>
            {allSections.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {classValue && sectionValue && (
        <div className="tcr-subject-grid">
          {subjects.map((sub) => (
            <div key={sub}>
              <label>
                <input
                  type="checkbox"
                  checked={subjectRates.hasOwnProperty(sub)}
                  onChange={() => handleSubjectToggle(sub)}
                  disabled={editingId !== null}
                />

                {sub}
              </label>

              {subjectRates[sub] !== undefined && (
                <input
                  type="number"
                  value={subjectRates[sub]}
                  onChange={(e) => handleRateChange(sub, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <button onClick={handleAddRate} className="tcr-add-btn">
        {editingId ? "Update" : "Add"}
      </button>

      {/* TABLE (UNCHANGED UI + EDIT BUTTON ADDED) */}
      <div className="tcr-table-container">
        <table className="tcr-table">
          <thead>
            <tr>
              <th>Teacher</th>
              <th>Class</th>
              <th>Section</th>
              <th>Subject</th>
              <th>Rate</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredRates.length ? (
              filteredRates.map((r) => (
                <tr key={r._id}>
                  <td>{r.teacherName}</td>
                  <td>{r.classValue}</td>
                  <td>{r.sectionValue}</td>
                  <td>{r.subject}</td>
                  <td>{r.rate}</td>
                  <td>{r.status}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(r)}>
                      Edit
                    </button>
                    <button
                      className={
                        r.status === "Active"
                          ? "btn-deactivate"
                          : "btn-activate"
                      }
                      onClick={() => handleToggleStatus(r._id, r.status)}
                    >
                      {r.status === "Active" ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No data found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherClassRate;
