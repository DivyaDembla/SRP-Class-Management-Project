import React, { useEffect, useMemo, useState } from "react";
import CollapsibleCard from "./CollapsibleCard";
import "./ClassMaster.css";
import axios from "axios";

const API = "http://localhost:5000/api/classes";

export default function ClassMaster() {
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({
    _id: null,
    name: "",
    section: "",
    description: "",
    status: "Active",
  });

  const [errors, setErrors] = useState({});
  const editing = useMemo(() => form._id !== null, [form._id]);

  // Fetch classes
  useEffect(() => {
    axios.get(API).then((res) => setClasses(res.data));
  }, []);

  const getFinancialYear = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    return m >= 4
      ? `${y}-${String(y + 1).slice(-2)}`
      : `${y - 1}-${String(y).slice(-2)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", duplicate: "" }));
  };

  const resetForm = () => {
    setForm({
      _id: null,
      name: "",
      section: "",
      description: "",
      status: "Active",
    });
    setErrors({});
  };

  const normalizeKey = (name, section) =>
    `${name}`.trim().toLowerCase() + "|" + `${section}`.trim().toLowerCase();

  const validate = (fieldName) => {
    let newErrors = { ...errors };

    if (!form.name.trim()) {
      if (!fieldName || fieldName === "name") {
        newErrors.name = "Class Name is required";
      }
    } else {
      if (fieldName === "name") newErrors.name = "";
    }

    const key = normalizeKey(form.name, form.section);
    const duplicate = classes.some(
      (c) =>
        normalizeKey(c.name, c.section) === key &&
        (editing ? c._id !== form._id : true)
    );

    if (duplicate) {
      if (!fieldName || fieldName === "name" || fieldName === "section") {
        newErrors.duplicate = "This Class Name + Section already exists";
      }
    } else {
      newErrors.duplicate = "";
    }

    setErrors(newErrors);

    if (!fieldName) {
      return Object.values(newErrors).every((v) => v === "");
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      section: form.section.trim(),
      description: form.description.trim(),
      status: form.status,
      financialYear: getFinancialYear(),
    };

    const res = await axios.post(API, payload);
    setClasses((prev) => [res.data, ...prev]);
    resetForm();
  };

  const handleEdit = (row) => {
    setForm({ ...row });
    setErrors({});
  };

  const handleUpdate = async () => {
    if (!editing || !validate()) return;

    const payload = {
      name: form.name.trim(),
      section: form.section.trim(),
      description: form.description.trim(),
      status: form.status,
    };

    const res = await axios.put(`${API}/${form._id}`, payload);
    setClasses((prev) =>
      prev.map((c) => (c._id === res.data._id ? res.data : c))
    );
    resetForm();
  };

  const handleToggle = async (id) => {
    const res = await axios.patch(`${API}/${id}/toggle`);
    setClasses((prev) =>
      prev.map((c) => (c._id === res.data._id ? res.data : c))
    );
  };

  return (
    <div className="classmaster-content">
      <CollapsibleCard title="Add / Edit Class" defaultOpen={false}>
        <div className="form-group">
          <label>Class Name:</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            onBlur={() => validate("name")}
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label>Section (optional):</label>
          <input
            type="text"
            name="section"
            value={form.section}
            onChange={handleChange}
            onBlur={() => validate("section")}
          />
        </div>

        {errors.duplicate && <p className="error">{errors.duplicate}</p>}

        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Status:</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="status"
                value="Active"
                checked={form.status === "Active"}
                onChange={handleChange}
              />
              Active
            </label>
            <label>
              <input
                type="radio"
                name="status"
                value="Inactive"
                checked={form.status === "Inactive"}
                onChange={handleChange}
              />
              Inactive
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button onClick={handleSave} disabled={editing}>
            Save
          </button>
          <button onClick={handleUpdate} disabled={!editing}>
            Update
          </button>
          <button onClick={resetForm}>Reset</button>
        </div>
      </CollapsibleCard>

      {/* TABLE */}
      <div className="table-card">
        <h2>Class List</h2>
        <hr />

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Class Name</th>
                <th>Section</th>
                <th>Description</th>
                <th>Financial Year</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {classes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty">
                    No classes added yet
                  </td>
                </tr>
              ) : (
                classes.map((row) => (
                  <tr key={row._id}>
                    <td>{row.name}</td>
                    <td>{row.section}</td>
                    <td>{row.description}</td>
                    <td>{row.financialYear}</td>
                    <td>{row.status}</td>
                    <td className="action-cell">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(row)}
                      >
                        Edit
                      </button>

                      {row.status === "Active" ? (
                        <button
                          className="btn-deactivate"
                          onClick={() => handleToggle(row._id)}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          className="btn-activate"
                          onClick={() => handleToggle(row._id)}
                        >
                          Activate
                        </button>
                      )}
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
}
