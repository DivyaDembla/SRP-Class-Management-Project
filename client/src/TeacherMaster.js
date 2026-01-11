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
    subjects: [""],
    classes: [],
    batches: [],
    documentNumber: "",
    joiningDate: "",
    status: "Active",
    fileName: "Upload Files",
    documentFile: null,
  });

  const [errors, setErrors] = useState({});

  const classesList = [
    "7th Standard",
    "8th Standard",
    "9th Standard",
    "10th Standard",
    "11th Standard",
  ];

  const batchesList = ["Batch A", "Batch B", "Batch C", "Batch D"];

  /* ================= FETCH ================= */
  useEffect(() => {
    axios.get(API).then((res) => setTeachers(res.data));
  }, []);

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

  const toggleSelect = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  /* ================= SUBJECTS ================= */
  const handleSubjectChange = (index, e) => {
    const updated = [...formData.subjects];
    updated[index] = e.target.value;
    setFormData((p) => ({ ...p, subjects: updated }));
  };

  const addSubjectField = () => {
    setFormData((p) => ({
      ...p,
      subjects: [...p.subjects, ""],
    }));
  };

  const removeSubjectField = (index) => {
    const updated = formData.subjects.filter((_, i) => i !== index);
    setFormData((p) => ({ ...p, subjects: updated }));
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
      prev.map((t) => (t._id === teacher._id ? res.data : t))
    );
  };

  /* ================= EDIT ================= */
  const editTeacher = (teacher) => {
    setEditingId(teacher._id);
    setFormData({
      ...teacher,
      subjects: teacher.subjects || [""],
      classes: teacher.classes || [],
      batches: teacher.batches || [],
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
      subjects: [""],
      classes: [],
      batches: [],
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
    Object.keys(formData).forEach((k) => {
      if (k === "documentFile" && formData[k]) {
        fd.append(k, formData[k]);
      } else {
        fd.append(
          k,
          Array.isArray(formData[k]) ? JSON.stringify(formData[k]) : formData[k]
        );
      }
    });

    let res;
    if (editingId) {
      res = await axios.put(`${API}/${editingId}`, fd);
      setTeachers((prev) =>
        prev.map((t) => (t._id === editingId ? res.data : t))
      );
    } else {
      res = await axios.post(API, fd);
      setTeachers((prev) => [...prev, res.data]);
    }

    resetForm();
  };

  /* ================= JSX ================= */
  return (
    <div className="teachermaster-content">
      <CollapsibleCard title="Teacher Details" defaultOpen={false}>
        <form onSubmit={handleSubmit}>
          <div className="grid">
            <div>
              <label>Full Name:</label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={inputClass("fullName")}
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
                className={inputClass("mobileNumber")}
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
                className={inputClass("emailAddress")}
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
                className={inputClass("qualification")}
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
              className={inputClass("address")}
            />
            {errors.address && <p className="error">{errors.address}</p>}
          </div>

          <div className="grid">
            <div>
              <label>Subjects Handled:</label>
              {formData.subjects.map((subject, index) => (
                <div key={index} className="subject-row">
                  <input
                    value={subject}
                    onChange={(e) => handleSubjectChange(index, e)}
                  />
                  <button
                    type="button"
                    onClick={() => removeSubjectField(index)}
                  >
                    ✖
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addSubjectField}
                className="btn-secondary"
              >
                + Add Subject
              </button>
            </div>

            <div>
              <label>Assigned Classes:</label>
              <div className="chip-group">
                {classesList.map((cls) => (
                  <span
                    key={cls}
                    className={`chip ${
                      formData.classes.includes(cls) ? "selected" : ""
                    }`}
                    onClick={() => toggleSelect("classes", cls)}
                  >
                    {cls}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="batches-section">
            <label>Assigned Batches:</label>
            <div className="chip-group">
              {batchesList.map((batch) => (
                <span
                  key={batch}
                  className={`chip ${
                    formData.batches.includes(batch) ? "selected" : ""
                  }`}
                  onClick={() => toggleSelect("batches", batch)}
                >
                  {batch}
                </span>
              ))}
            </div>
          </div>

          <div className="grid">
            <div>
              <label>Document Number:</label>
              <input
                name="documentNumber"
                value={formData.documentNumber}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={inputClass("documentNumber")}
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
                className={inputClass("joiningDate")}
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

          <div className="actions">
            <button type="submit" className="btn-primary">
              {editingId ? "Update" : "Save"}
            </button>
            <button type="button" onClick={resetForm} className="btn-danger">
              Reset
            </button>
          </div>
        </form>
      </CollapsibleCard>

      {/* ================= LIST ================= */}
      <div className="card">
        <h2 className="title">Teacher's List</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Sr. no</th>
                <th>Full Name</th>
                <th>Date of Joining</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((t, i) => (
                <tr key={t._id}>
                  <td>{i + 1}</td>
                  <td>{t.fullName}</td>
                  <td>{t.joiningDate?.slice(0, 10)}</td>
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
