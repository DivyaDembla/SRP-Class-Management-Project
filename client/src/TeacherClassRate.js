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

  const [availableSubjects, setAvailableSubjects] = useState([]);


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

  const selectedTeacher = teachers.find(
    (t) => t._id === teacherName
  );

  if (!selectedTeacher) {
    alert("Invalid teacher selected");
    return;
  }

  const alreadyExists = rates.some(
    (r) =>
      r.teacherName === selectedTeacher.fullName &&
      r.classValue === classValue &&
      r.sectionValue === sectionValue &&
      r.status === "Active"
  );

  if (alreadyExists && !editingId) {
    alert("Active record already exists for this teacher & class.");
    return;
  }

  const payload = Object.keys(subjectRates).map((subject) => ({
  teacherName: selectedTeacher.fullName,
  classValue,
  sectionValue,
  subject,
  rate: Number(subjectRates[subject]),
  status: "Active",
  effectiveFrom: new Date().toISOString(),
  effectiveTo: null,
}));

  try {
    if (editingId) {
      const subject = Object.keys(subjectRates)[0];

      await axios.put(`${RATE_API}/${editingId}`, {
        teacherName: selectedTeacher.fullName,
        classValue,
        sectionValue,
        subject,
        rate: Number(subjectRates[subject]),
      });
    } else {
      await axios.post(RATE_API, payload);
    }

    resetForm();
    fetchRates();
  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
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
  if (status === "Active") {
    const choice = window.prompt(
      "Deactivate from:\n1 - Tomorrow\n2 - Next Month Start\n\nEnter 1 or 2"
    );

    if (!choice) return;

    let effectiveDate = new Date();

    if (choice === "1") {
      effectiveDate.setDate(effectiveDate.getDate() + 1);
    } else if (choice === "2") {
      effectiveDate = new Date(
        effectiveDate.getFullYear(),
        effectiveDate.getMonth() + 1,
        1
      );
    } else {
      alert("Invalid selection");
      return;
    }

    await axios.patch(`${RATE_API}/${id}/status`, {
  status: "Inactive",
  effectiveTo: effectiveDate.toISOString(),
});

  } else {
    await axios.patch(`${RATE_API}/${id}/status`, {
      effectiveFrom: new Date().toISOString(),
effectiveTo: null,
status: "Active"
    });
  }

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
      (!filterStatus || getDisplayStatus(r) === filterStatus)
  );
  
const getDisplayStatus = (r) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // If no effectiveFrom, treat createdAt as start date
  const from = r.effectiveFrom
    ? new Date(r.effectiveFrom)
    : new Date(r.createdAt);

  from.setHours(0, 0, 0, 0);

  const to = r.effectiveTo ? new Date(r.effectiveTo) : null;
  if (to) to.setHours(23, 59, 59, 999);

  if (today < from) return "Inactive";

  if (to && today > to) return "Inactive";

  return "Active";
};

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
  onChange={(e) => {
  const selectedId = e.target.value;

  setTeacherName(selectedId);
  setClassValue("");
  setSectionValue("");
  setAvailableSubjects([]);
  setSubjectRates({});
}}

>

            <option value="">Select Teacher</option>
            {teachers
              .filter((t) => t.status === "Active")
              .map((t) => (
                <option key={t._id} value={t._id}>
                  {t.fullName}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label>Class</label>
          <select
  value={classValue}
  onChange={(e) => {
    const selectedClassId = e.target.value;
    setClassValue(selectedClassId);

    const teacher = teachers.find(
      (t) => t._id === teacherName
    );

    const assignment = teacher?.teachingAssignments.find(
      (a) => a.classId === selectedClassId
    );

    if (assignment) {
      const section = assignment.standard.split(" ").pop();
      setSectionValue(section);
      setAvailableSubjects(assignment.subjects || []);
    } else {
      setSectionValue("");
      setAvailableSubjects([]);
    }

    setSubjectRates({});
  }}
>
  <option value="">Select Class</option>

  {teachers
    .find((t) => t._id === teacherName)
    ?.teachingAssignments.map((a, i) => (
      <option key={i} value={a.classId}>
        {a.standard}
      </option>
    ))}
</select>

        </div>

        <div>
          <label>Section</label>
          <input
  type="text"
  value={sectionValue}
  readOnly
/>

        </div>
      </div>

      {teacherName &&
  teachers.find(t => t._id === teacherName)?.status === "Active" &&
  availableSubjects.length > 0 && (
        <div className="tcr-subject-grid">
          {availableSubjects.map((sub) => (
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

      <button
  type="button"
  onClick={handleAddRate}
  className="tcr-add-btn"
>
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
    <th>Effective From</th>
    <th>Effective To</th>
    <th>Action</th>
  </tr>
</thead>

          <tbody>
            {filteredRates.length ? (
              filteredRates.map((r) => (
                <tr key={r._id}>
                  <td>{r.teacherName}</td>
                  <td>
  {classes.find(c => c._id === r.classValue)
    ? `${classes.find(c => c._id === r.classValue).name}${
        classes.find(c => c._id === r.classValue).section
          ? " - " + classes.find(c => c._id === r.classValue).section
          : ""
      }`
    : r.classValue}
</td>

                  <td>{r.sectionValue}</td>
                  <td>{r.subject}</td>
                  <td>{r.rate}</td>
                  <td>
  <span
    style={{
      color:
        getDisplayStatus(r) === "Active" ? "green" : "red",
      fontWeight: "bold",
    }}
  >
    {getDisplayStatus(r)}
  </span>
</td>
                  <td>
  {r.effectiveFrom
    ? new Date(r.effectiveFrom).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-"}
</td>

<td>
  {r.effectiveTo
    ? new Date(r.effectiveTo).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Ongoing"}
</td>
                  <td>
                    <button
  className="btn-edit"
  disabled={getDisplayStatus(r) !== "Active"}
  onClick={() => {
  if (getDisplayStatus(r) === "Active") {
    handleEdit(r);
  }
}}
>
  Edit
</button>

                    <button
  className={
    getDisplayStatus(r) === "Active"
      ? "btn-deactivate"
      : "btn-activate"
  }
  onClick={() =>
    handleToggleStatus(r._id, getDisplayStatus(r))
  }
>
  {getDisplayStatus(r) === "Active"
    ? "Deactivate"
    : "Activate"}
</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No data found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherClassRate;
