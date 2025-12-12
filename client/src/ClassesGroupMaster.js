import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import "./ClassesGroupMaster.css";

const API = "http://localhost:5000/api/class-groups";

// --- Class Group List Component ---
const ClassesGroupList = ({ groups, onEdit }) => (
  <div className="card list-card">
    <h3 className="card-subtitle">Class Groups List ({groups.length})</h3>
    <hr className="divider" />
    <table>
      <thead>
        <tr>
          <th>Location</th>
          <th>Class Name</th>
          <th>City</th>
          <th>Email ID</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {groups.length === 0 ? (
          <tr>
            <td colSpan="5" className="empty-row">
              No Class Groups found.
            </td>
          </tr>
        ) : (
          groups.map((group) => (
            <tr key={group._id}>
              <td>{group.location}</td>
              <td>{group.className}</td>
              <td>{group.city}</td>
              <td>{group.emailId}</td>
              <td>
                <button onClick={() => onEdit(group)} className="btn-edit">
                  ✏️ Edit
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

const initialFormData = {
  location: "",
  className: "",
  address1: "",
  address2: "",
  city: "",
  pinCode: "",
  fax: "",
  emailId: "",
  gst: "",
};

const ClassesGroupMaster = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [groups, setGroups] = useState([]);
  const [editingGroup, setEditingGroup] = useState(null);

  const editing = useMemo(() => editingGroup !== null, [editingGroup]);

  // LOAD ALL GROUPS FROM MONGO
  useEffect(() => {
    axios.get(API).then((res) => setGroups(res.data));
  }, []);

  // Input change + validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMsg = "";

    if (name === "location" && !value.trim()) errorMsg = "Location required.";
    if (name === "className" && !value.trim())
      errorMsg = "Class name required.";
    if (
      name === "emailId" &&
      value &&
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
    )
      errorMsg = "Invalid email.";
    if (name === "pinCode" && value && !/^\d{6}$/.test(value))
      errorMsg = "Pin must be 6 digits.";

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    setEditingGroup(null);
  };

  const handleEdit = (group) => {
    setEditingGroup(group);
    setFormData(group);
    setErrors({});
  };

  const handleSaveOrUpdate = async (e) => {
    e.preventDefault();

    if (!formData.location || !formData.className) {
      alert("Fill required fields.");
      return;
    }

    // VALIDATION errors
    if (Object.values(errors).some((err) => err)) {
      alert("Fix validation errors.");
      return;
    }

    try {
      if (editing) {
        // UPDATE
        const res = await axios.put(`${API}/${editingGroup._id}`, formData);

        setGroups((prev) =>
          prev.map((g) => (g._id === editingGroup._id ? res.data : g))
        );

        alert("✅ Updated successfully");
      } else {
        // CREATE
        const res = await axios.post(API, formData);
        setGroups((prev) => [...prev, res.data]);

        alert("✅ Saved successfully");
      }

      handleReset();
    } catch (err) {
      alert("❌ Error saving data");
      console.log(err);
    }
  };

  return (
    <div className="classesgroupmaster-content">
      <div className="card">
        <h2 className="card-title">
          {editing ? "Update Class Group" : "Classes Group Master"}
        </h2>
        <hr className="divider" />

        <form onSubmit={handleSaveOrUpdate}>
          <div className="form-grid">
            <div>
              <label className="label">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                disabled={editing}
                className="input"
              />
              {errors.location && <p className="error">{errors.location}</p>}
            </div>

            <div>
              <label className="label">Class Name *</label>
              <input
                type="text"
                name="className"
                value={formData.className}
                onChange={handleInputChange}
                disabled={editing}
                className="input"
              />
              {errors.className && <p className="error">{errors.className}</p>}
            </div>

            <div>
              <label className="label">Address 1</label>
              <textarea
                name="address1"
                value={formData.address1}
                onChange={handleInputChange}
                className="textarea"
              />
            </div>

            <div>
              <label className="label">Address 2</label>
              <textarea
                name="address2"
                value={formData.address2}
                onChange={handleInputChange}
                className="textarea"
              />
            </div>

            <div>
              <label className="label">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="input"
              />
            </div>

            <div>
              <label className="label">Pin Code</label>
              <input
                type="text"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleInputChange}
                className="input"
              />
              {errors.pinCode && <p className="error">{errors.pinCode}</p>}
            </div>

            <div>
              <label className="label">Fax</label>
              <input
                type="text"
                name="fax"
                value={formData.fax}
                onChange={handleInputChange}
                className="input"
              />
            </div>

            <div>
              <label className="label">Email ID</label>
              <input
                type="email"
                name="emailId"
                value={formData.emailId}
                onChange={handleInputChange}
                className="input"
              />
              {errors.emailId && <p className="error">{errors.emailId}</p>}
            </div>

            <div>
              <label className="label">GST</label>
              <input
                type="text"
                name="gst"
                value={formData.gst}
                onChange={handleInputChange}
                className="input"
              />
            </div>
          </div>

          <div className="button-group">
            {/* Save button (only when NOT editing) */}
            {!editing && (
              <button type="submit" className="btn-form btn-save-mode">
                Save
              </button>
            )}

            {/* Update button (only when editing) */}
            {editing && (
              <button
                type="submit"
                className="btn-form btn-update-mode"
                style={{ backgroundColor: "green", color: "white" }}
              >
                Update
              </button>
            )}

            {/* Reset button always visible */}
            <button
              type="button"
              onClick={handleReset}
              className="btn-form btn-reset-mode"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      <ClassesGroupList groups={groups} onEdit={handleEdit} />
    </div>
  );
};

export default ClassesGroupMaster;
