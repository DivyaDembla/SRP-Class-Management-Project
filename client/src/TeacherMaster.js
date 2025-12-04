import React, { useState } from "react";
import CollapsibleCard from "./CollapsibleCard";
import "./TeacherMaster.css";
import ExcelManager from "./ExcelManager";

export default function TeacherMaster() {
  const [teachers, setTeachers] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

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

  // ---------------------------
  // Toggle select for classes/batches
  // ---------------------------
  const toggleSelect = (field, value) => {
  setFormData((prev) => ({
    ...prev,
    [field]: prev[field].includes(value)
      ? prev[field].filter((v) => v !== value)
      : [...prev[field], value],
  }));

  // Clear error instantly
  setErrors((prev) => ({ ...prev, [field]: "" }));
};


  // ---------------------------
  // Handle input change
  // ---------------------------
  const handleInputChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({ ...prev, [name]: value }));

  // Instant validation
  const errorMsg = validateField(name, value);
  setErrors((prev) => ({ ...prev, [name]: errorMsg }));
};


  // ---------------------------
  // Subject handlers
  // ---------------------------
  const handleSubjectChange = (index, e) => {
    const newSubjects = [...formData.subjects];
    newSubjects[index] = e.target.value;
    setFormData((prev) => ({ ...prev, subjects: newSubjects }));
  };

  const addSubjectField = () =>
    setFormData((prev) => ({ ...prev, subjects: [...prev.subjects, ""] }));

  const removeSubjectField = (index) => {
    if (formData.subjects.length > 1) {
      const newSubjects = formData.subjects.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, subjects: newSubjects }));
    }
  };

  // ---------------------------
  // File upload
  // ---------------------------
const handleFileChange = (e) => {
  setFormData((prev) => ({
    ...prev,
    fileName: e.target.files.length > 0 ? e.target.files[0].name : "Upload Files",
  }));

  setErrors((prev) => ({ ...prev, fileName: "" }));
};

const validateField = (name, value) => {
  let msg = "";

  switch (name) {
    case "fullName":
      if (!value.trim()) msg = "Full Name is required.";
      else if (!/^[A-Za-z ]+$/.test(value))
        msg = "Name must contain only alphabets.";
      break;

    case "mobileNumber":
      if (!value.trim()) msg = "Mobile Number is required.";
      else if (!/^\d{10}$/.test(value))
        msg = "Enter a valid 10-digit number.";
      break;

    case "emailAddress":
      if (!value.trim()) msg = "Email Address is required.";
      else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value))
        msg = "Enter a valid email.";
      break;

    case "qualification":
      if (!value.trim()) msg = "Qualification is required.";
      break;

    case "address":
      if (!value.trim()) msg = "Address is required.";
      break;

    case "documentNumber":
      if (!value.trim()) msg = "Document Number is required.";
      break;

    case "joiningDate":
      if (!value.trim()) msg = "Joining Date is required.";
      break;

    default:
      break;
  }

  return msg;
};

  // ---------------------------
  // VALIDATION
  // ---------------------------
  const validateForm = () => {
    const fields = [
      "fullName",
      "mobileNumber",
      "emailAddress",
      "qualification",
      "address",
      "subjects",
      "classes",
      "batches",
      "documentNumber",
      "joiningDate",
      "fileName",
    ];

    let newErrors = {};

    fields.forEach((field) => {
      let value = formData[field];
      let msg = "";

      switch (field) {
        case "fullName":
          if (!value.trim()) msg = "Full Name is required.";
          else if (!/^[A-Za-z ]+$/.test(value))
            msg = "Name must contain only alphabets.";
          break;

        case "mobileNumber":
          if (!value.trim()) msg = "Mobile Number is required.";
          else if (!/^\d{10}$/.test(value))
            msg = "Enter a valid 10-digit number.";
          break;

        case "emailAddress":
          if (!value.trim()) msg = "Email Address is required.";
          else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value))
            msg = "Enter a valid email.";
          break;

        case "qualification":
          if (!value.trim()) msg = "Qualification is required.";
          break;

        case "address":
          if (!value.trim()) msg = "Address is required.";
          break;

        case "subjects":
          if (!value.every((s) => s.trim()))
            msg = "All subject fields are required.";
          break;

        case "classes":
          if (!value.length) msg = "Select at least one class.";
          break;

        case "batches":
          if (!value.length) msg = "Select at least one batch.";
          break;

        case "documentNumber":
          if (!value.trim()) msg = "Document Number is required.";
          break;

        case "joiningDate":
          if (!value.trim()) msg = "Joining Date is required.";
          break;

        case "fileName":
          if (!value || value === "Upload Files")
            msg = "Upload a document.";
          break;

        default:
          break;
      }

      if (msg) newErrors[field] = msg;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------------------
  // Submit
  // ---------------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingIndex !== null) {
      setTeachers((prev) =>
        prev.map((t, i) => (i === editingIndex ? formData : t))
      );
      setEditingIndex(null);
    } else {
      setTeachers((prev) => [...prev, formData]);
    }

    resetForm();
  };

  // ---------------------------
  // Reset form
  // ---------------------------
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
    });

    setErrors({});
    setEditingIndex(null);
  };

  // ---------------------------
  // Edit Item
  // ---------------------------
  const editTeacher = (index) => {
    setEditingIndex(index);
    setFormData(teachers[index]);
  };

  // ---------------------------
  // Delete
  // ---------------------------
  const deleteTeacher = (index) =>
    setTeachers((prev) => prev.filter((_, i) => i !== index));

  return (
    <div className="teachermaster-content">
      <CollapsibleCard title="Teacher Details" defaultOpen={true}>
        <form onSubmit={handleSubmit}>
          <div className="grid">
            <div>
              <label>Full Name:</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
              />
              {errors.fullName && <p className="error">{errors.fullName}</p>}
            </div>

            <div>
              <label>Mobile Number:</label>
              <input
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
              />
              {errors.mobileNumber && (
                <p className="error">{errors.mobileNumber}</p>
              )}
            </div>

            <div>
              <label>Email Address:</label>
              <input
                type="email"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleInputChange}
              />
              {errors.emailAddress && (
                <p className="error">{errors.emailAddress}</p>
              )}
            </div>

            <div>
              <label>Qualification:</label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleInputChange}
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
            ></textarea>
            {errors.address && <p className="error">{errors.address}</p>}
          </div>

          <div className="grid">
            <div>
              <label>Subjects Handled:</label>
              {formData.subjects.map((subject, index) => (
                <div key={index} className="subject-row">
                  <input
                    type="text"
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
              {errors.subjects && <p className="error">{errors.subjects}</p>}

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
                {classesList.map((cls, i) => (
                  <span
                    key={i}
                    className={`chip ${
                      formData.classes.includes(cls) ? "selected" : ""
                    }`}
                    onClick={() => toggleSelect("classes", cls)}
                  >
                    {cls}
                  </span>
                ))}
              </div>
              {errors.classes && <p className="error">{errors.classes}</p>}
            </div>
          </div>

          <div className="batches-section">
            <label>Assigned Batches:</label>
            <div className="chip-group">
              {batchesList.map((batch, i) => (
                <span
                  key={i}
                  className={`chip ${
                    formData.batches.includes(batch) ? "selected" : ""
                  }`}
                  onClick={() => toggleSelect("batches", batch)}
                >
                  {batch}
                </span>
              ))}
            </div>
            {errors.batches && <p className="error">{errors.batches}</p>}
          </div>

          <div className="grid">
            <div>
              <label>Document Number:</label>
              <input
                type="text"
                name="documentNumber"
                value={formData.documentNumber}
                onChange={handleInputChange}
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
              />
              {errors.joiningDate && (
                <p className="error">{errors.joiningDate}</p>
              )}
            </div>
          </div>

          <div className="grid">
            <div>
              <label>Document Upload:</label>
              <input type="file" name="documentFile" onChange={handleFileChange} />
              {errors.fileName && <p className="error">{errors.fileName}</p>}
            </div>

            <div>
              <label>Status:</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="actions">
            <button type="submit" className="btn-primary">
              {editingIndex !== null ? "Update" : "Save"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="btn-danger"
            >
              Reset
            </button>
          </div>
        </form>
      </CollapsibleCard>

      {/* TEACHER LIST */}
      <div className="card">
        <h2 className="title">Teacher's List</h2>

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
            {teachers.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty">
                  No teachers added yet.
                </td>
              </tr>
            ) : (
              teachers.map((teacher, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{teacher.fullName}</td>
                  <td>{teacher.joiningDate}</td>
                  <td>
                    <button
                      onClick={() => editTeacher(index)}
                      className="btn-icon"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => deleteTeacher(index)}
                      className="btn-icon"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <ExcelManager
          data={teachers}
          setData={setTeachers}
          tableName="Teacher"
          columns={[
            "Full Name",
            "Mobile Number",
            "Email Address",
            "Qualification",
            "Address",
            "Subjects",
            "Classes",
            "Batches",
            "Document Number",
            "Joining Date",
            "Status",
          ]}
          fieldMap={{
            "Full Name": "fullName",
            "Mobile Number": "mobileNumber",
            "Email Address": "emailAddress",
            Qualification: "qualification",
            Address: "address",
            Subjects: "subjects",
            Classes: "classes",
            Batches: "batches",
            "Document Number": "documentNumber",
            "Joining Date": "joiningDate",
            Status: "status",
          }}
        />
      </div>
    </div>
  );
}
