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

  useEffect(() => {
    axios.get(API).then((res) => setTeachers(res.data));
  }, []);

  /* ================= HELPERS ================= */
  const toggleSelect = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const toggleStatus = async (teacher) => {
    const fd = new FormData();
    fd.append("status", teacher.status === "Active" ? "Inactive" : "Active");

    const res = await axios.put(`${API}/${teacher._id}`, fd);
    setTeachers((prev) =>
      prev.map((t) => (t._id === teacher._id ? res.data : t))
    );
  };

  const validateField = (name, value) => {
    if (!value.trim()) return `${name} is required`;
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

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
    setEditingId(null);
  };

  const editTeacher = (teacher) => {
    setEditingId(teacher._id);
    setFormData({
      ...teacher,
      subjects: teacher.subjects || [""],
      classes: teacher.classes || [],
      batches: teacher.batches || [],
    });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.keys(formData).forEach((k) => {
      fd.append(
        k,
        Array.isArray(formData[k]) ? JSON.stringify(formData[k]) : formData[k]
      );
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

  return (
    <div className="teachermaster-content">
      {/* ================= FORM ================= */}
      <CollapsibleCard title="Teacher Details" defaultOpen={false}>
        <form onSubmit={handleSubmit}>
          {/* FORM CONTENT UNCHANGED */}
          {/* ... your existing form JSX stays exactly same ... */}
        </form>
      </CollapsibleCard>

      {/* ================= TEACHER LIST ================= */}
      <div className="card">
        <h2 className="title">Teacher's List</h2>

        {/* ✅ TABLE WRAPPED INSIDE CARD */}
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
                        className="btn-link"
                        onClick={() => editTeacher(teacher)}
                      >
                        Edit
                      </button>

                      <button
                        className={`btn-status ${
                          teacher.status === "Active"
                            ? "deactivate"
                            : "activate"
                        }`}
                        onClick={() => toggleStatus(teacher)}
                      >
                        {teacher.status === "Active"
                          ? "Deactivate"
                          : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

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
