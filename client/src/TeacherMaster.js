import React, { useState, useEffect } from "react";
import CollapsibleCard from "./CollapsibleCard";
import "./TeacherMaster.css";
import ExcelManager from "./ExcelManager";
import axios from "axios";

const API = "http://localhost:5000/api/teachers";

export default function TeacherMaster() {
  const [teachers, setTeachers] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    emailAddress: "",
    qualification: "",
    address: "",

    teachingAssignments: [{ classId: "", standard: "", subjects: [] }],

    documentNumber: "",
    joiningDate: "",
    status: "Active",
    fileName: "Upload Files",
    documentFile: null,
  });

  const [errors, setErrors] = useState({});
  const [classList, setClassList] = useState([]);
  const [subjectMap, setSubjectMap] = useState({});

  /* ================= FETCH ================= */
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [teacherRes, classRes, subjectRes] = await Promise.all([
        axios.get(API),
        axios.get("http://localhost:5000/api/classes"),
        axios.get("http://localhost:5000/api/subjects"),
      ]);

      setTeachers(teacherRes.data);
      setClassList(classRes.data);

      // map classId -> subjects[]
      const map = {};
      subjectRes.data.forEach((s) => {
        map[s.classId] = s.subjects;
      });

      setSubjectMap(map);
    } catch (err) {
      console.error("Load error", err);
    }
  };

  /* ================= VALIDATION ================= */
  const validateField = (name, value) => {
    if (!value || !value.trim()) return `${name} is required`;
    return "";
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const inputClass = () => "";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  /* ================= FILE ================= */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((p) => ({
        ...p,
        documentFile: file,
        fileName: file.name,
      }));
    }
  };

  /* ================= STATUS ================= */
  const toggleStatus = async (teacher) => {
    const fd = new FormData();
    fd.append("status", teacher.status === "Active" ? "Inactive" : "Active");

    const res = await axios.put(`${API}/${teacher._id}`, fd);
    setTeachers((prev) =>
      prev.map((t) => (t._id === teacher._id ? res.data : t)),
    );
  };

  /* ================= EDIT ================= */
  const editTeacher = (teacher) => {
    setEditingId(teacher._id);

    setFormData({
      fullName: teacher.fullName || "",
      mobileNumber: teacher.mobileNumber || "",
      emailAddress: teacher.emailAddress || "",
      qualification: teacher.qualification || "",
      address: teacher.address || "",

      teachingAssignments: teacher.teachingAssignments?.length
        ? teacher.teachingAssignments
        : [{ classId: "", standard: "", subjects: [] }],

      documentNumber: teacher.documentNumber || "",
      joiningDate: teacher.joiningDate?.slice(0, 10) || "",
      status: teacher.status || "Active",
      fileName: teacher.fileName || "Upload Files",
      documentFile: null,
    });
  };

  /* ================= RESET ================= */
  const resetForm = () => {
    setFormData({
      fullName: "",
      mobileNumber: "",
      emailAddress: "",
      qualification: "",
      address: "",
      teachingAssignments: [{ classId: "", standard: "", subjects: [] }],
      documentNumber: "",
      joiningDate: "",
      status: "Active",
      fileName: "Upload Files",
      documentFile: null,
    });

    setErrors({});
    setEditingId(null);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();

    fd.append("fullName", formData.fullName);
    fd.append("mobileNumber", formData.mobileNumber);
    fd.append("emailAddress", formData.emailAddress);
    fd.append("qualification", formData.qualification);
    fd.append("address", formData.address);
    fd.append("documentNumber", formData.documentNumber);
    fd.append("joiningDate", formData.joiningDate);
    fd.append("status", formData.status);
    fd.append("fileName", formData.fileName);

    fd.append(
      "teachingAssignments",
      JSON.stringify(formData.teachingAssignments),
    );

    if (formData.documentFile) {
      fd.append("documentFile", formData.documentFile);
    }

    let res;

    if (editingId) {
      res = await axios.put(`${API}/${editingId}`, fd);
      setTeachers((prev) =>
        prev.map((t) => (t._id === editingId ? res.data : t)),
      );
    } else {
      res = await axios.post(API, fd);
      setTeachers((prev) => [...prev, res.data]);
    }

    resetForm();
  };

  const addAssignment = () => {
    setFormData((p) => ({
      ...p,
      teachingAssignments: [
        ...p.teachingAssignments,
        { classId: "", standard: "", subjects: [] },
      ],
    }));
  };

  const handleClassChange = (index, classId) => {
    const cls = classList.find((c) => c._id === classId);

    if (!cls) return;

    const updated = [...formData.teachingAssignments];
    updated[index] = {
      classId,
      standard: `${cls.name} ${cls.section}`,
      subjects: [],
    };

    setFormData((p) => ({ ...p, teachingAssignments: updated }));
  };

  const removeAssignment = (index) => {
    const updated = formData.teachingAssignments.filter((_, i) => i !== index);
    setFormData((p) => ({ ...p, teachingAssignments: updated }));
  };

  const toggleSubject = (index, subject) => {
    const updated = [...formData.teachingAssignments];
    const subjects = updated[index].subjects || [];

    if (subjects.includes(subject)) {
      updated[index].subjects = subjects.filter((s) => s !== subject);
    } else {
      updated[index].subjects = [...subjects, subject];
    }

    setFormData((p) => ({ ...p, teachingAssignments: updated }));
  };

  /* ================= JSX ================= */
  return (
    <div className="teachermaster-content">
      <form onSubmit={handleSubmit}>
        {/* ================= PERSONAL DETAILS ================= */}
        <CollapsibleCard title="Teacher Personal Details" defaultOpen={false}>
          <div className="grid">
            <div>
              <label>Full Name:</label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
              {errors.fullName && <p className="error">{errors.fullName}</p>}
            </div>

            <div>
              <label>Mobile Number:</label>
              <input
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
              {errors.mobileNumber && (
                <p className="error">{errors.mobileNumber}</p>
              )}
            </div>

            <div>
              <label>Email Address:</label>
              <input
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
              {errors.emailAddress && (
                <p className="error">{errors.emailAddress}</p>
              )}
            </div>

            <div>
              <label>Qualification:</label>
              <input
                name="qualification"
                value={formData.qualification}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
              {errors.qualification && (
                <p className="error">{errors.qualification}</p>
              )}
            </div>
          </div>

          <div>
            <label>Address:</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              onBlur={handleBlur}
            />
            {errors.address && <p className="error">{errors.address}</p>}
          </div>

          <div className="grid">
            <div>
              <label>Document Number:</label>
              <input
                name="documentNumber"
                value={formData.documentNumber}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
              {errors.documentNumber && (
                <p className="error">{errors.documentNumber}</p>
              )}
            </div>

            <div>
              <label>Joining Date:</label>
              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
              {errors.joiningDate && (
                <p className="error">{errors.joiningDate}</p>
              )}
            </div>
          </div>

          <div className="grid">
            <div>
              <label>Document Upload:</label>
              <input type="file" onChange={handleFileChange} />
            </div>

            <div>
              <label>Status:</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>
        </CollapsibleCard>

        {/* ================= TEACHING ASSIGNMENT ================= */}
        <CollapsibleCard title="Teaching Assignment" defaultOpen={false}>
          {formData.teachingAssignments.map((row, index) => (
            <div className="assignment-box" key={index}>
              <div className="form-group">
                <label>Class:</label>
                <select
                  value={row.classId}
                  onChange={(e) => handleClassChange(index, e.target.value)}
                >
                  <option value="">Select Class</option>
                  {classList.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} {c.section}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Subjects:</label>
                <div className="chip-group">
                  {(subjectMap[row.classId] || []).map((sub) => (
                    <span
                      key={sub}
                      className={`chip ${row.subjects.includes(sub) ? "selected" : ""}`}
                      onClick={() => toggleSubject(index, sub)}
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addAssignment}
            className="assignment-add-btn"
          >
            + Add Another Class
          </button>
        </CollapsibleCard>

        {/* ================= ACTION BUTTONS ================= */}
        <div className="actions">
          <button type="submit" className="btn-primary">
            {editingId ? "Update" : "Save"}
          </button>
          <button type="button" onClick={resetForm} className="btn-danger">
            Reset
          </button>
        </div>
      </form>

      {/* ================= LIST ================= */}
      <div className="card">
        <h2 className="title">Teacher's List</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Sr. no</th>
                <th>Full Name</th>
                <th>Teaching</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {teachers.map((t, i) => (
                <tr key={t._id}>
                  <td>{i + 1}</td>
                  <td>{t.fullName}</td>

                  {/* TEACHING ASSIGNMENTS */}
                  <td>
                    {t.teachingAssignments?.length ? (
                      t.teachingAssignments.map((a, idx) => (
                        <div key={idx} className="teaching-line">
                          <b>{a.standard}</b> → {a.subjects.join(", ")}
                        </div>
                      ))
                    ) : (
                      <span className="no-data">No Subjects Assigned</span>
                    )}
                  </td>

                  {/* STATUS */}
                  <td>
                    <span className={`status-badge ${t.status.toLowerCase()}`}>
                      {t.status}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td>
                    <button className="btn-link" onClick={() => editTeacher(t)}>
                      Edit
                    </button>
                    <button
                      className={`btn-status ${
                        t.status === "Active" ? "deactivate" : "activate"
                      }`}
                      onClick={() => toggleStatus(t)}
                    >
                      {t.status === "Active" ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ExcelManager
          data={teachers}
          setData={setTeachers}
          tableName="Teacher"
        />
      </div>
    </div>
  );
}
