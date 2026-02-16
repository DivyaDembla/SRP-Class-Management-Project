import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import CollapsibleCard from "./CollapsibleCard";
import "./ClassesGroupMaster.css";

const API = "http://localhost:5000/api/class-groups";
const LOCATION_API = "http://localhost:5000/api/locations";

/* ================= CLASS GROUP LIST ================= */
const ClassesGroupList = ({ groups, onEdit }) => (
  <div className="card list-card">
    <h3 className="card-subtitle">Class Groups List ({groups.length})</h3>
    <hr className="divider" />

    <div className="table-wrapper">
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
  </div>
);

/* ================= INITIAL FORM DATA ================= */
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
  const [locations, setLocations] = useState([]);
  const [editingGroup, setEditingGroup] = useState(null);

  const editing = useMemo(() => editingGroup !== null, [editingGroup]);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    axios.get(API).then((res) => setGroups(res.data));
    axios.get(LOCATION_API).then((res) => setLocations(res.data));
  }, []);

  /* ================= HANDLE INPUT ================= */
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // autofill when location selected
    if (name === "location") {
      const selected = locations.find(
        (loc) => `${loc.locationName} - ${loc.pincode}` === value,
      );

      if (selected) {
        setFormData((prev) => ({
          ...prev,
          location: value,
          city: selected.city || "",
          pinCode: selected.pincode || "",
        }));
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  /* ================= VALIDATION ================= */
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

  /* ================= EDIT ================= */
  const handleEdit = (group) => {
    setEditingGroup(group);
    setFormData({
      ...group,
      location: group.location,
    });
    setErrors({});
  };

  /* ================= RESET ================= */
  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    setEditingGroup(null);
  };

  /* ================= SAVE / UPDATE ================= */
  const handleSaveOrUpdate = async (e) => {
    e.preventDefault();

    if (!formData.location || !formData.className) {
      alert("Fill required fields.");
      return;
    }

    if (Object.values(errors).some((err) => err)) {
      alert("Fix validation errors.");
      return;
    }

    try {
      if (editing) {
        const res = await axios.put(`${API}/${editingGroup._id}`, formData);
        setGroups((prev) =>
          prev.map((g) => (g._id === editingGroup._id ? res.data : g)),
        );
        alert("✅ Updated successfully");
      } else {
        const res = await axios.post(API, formData);
        setGroups((prev) => [...prev, res.data]);
        alert("✅ Saved successfully");
      }

      handleReset();
    } catch (err) {
      alert("❌ Error saving data");
      console.error(err);
    }
  };

  return (
    <div className="classesgroupmaster-content">
      {/* ========= FORM CARD ========= */}
      <CollapsibleCard
        title={editing ? "Update Class Group" : "Classes Group Master"}
        defaultOpen={false}
      >
        <form onSubmit={handleSaveOrUpdate}>
          <div className="form-grid">
            {/* LOCATION DROPDOWN */}
            <div>
              <label className="label">Location *</label>
              <select
                name="location"
                value={formData.location || ""}
                onChange={handleInputChange}
                className="input"
              >
                <option value="">-- Select Location --</option>

                {locations.map((loc) => {
                  const label = `${loc.locationName} - ${loc.pincode}`;
                  return (
                    <option key={loc._id} value={label}>
                      {label} ({loc.city})
                    </option>
                  );
                })}
              </select>
              {errors.location && <p className="error">{errors.location}</p>}
            </div>

            {/* CLASS NAME */}
            <div>
              <label className="label">Class Name *</label>
              <input
                type="text"
                name="className"
                value={formData.className}
                onChange={handleInputChange}
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

            {/* AUTO FILLED */}
            <div>
              <label className="label">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                readOnly
                className="input"
              />
            </div>

            <div>
              <label className="label">Pin Code</label>
              <input
                type="text"
                name="pinCode"
                value={formData.pinCode}
                readOnly
                className="input"
              />
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
            <button
              type="submit"
              className={`btn-form ${editing ? "btn-update-mode" : "btn-save-mode"}`}
            >
              {editing ? "Update" : "Save"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="btn-form btn-reset-mode"
            >
              Reset
            </button>
          </div>
        </form>
      </CollapsibleCard>

      {/* ========= LIST CARD ========= */}
      <ClassesGroupList groups={groups} onEdit={handleEdit} />
    </div>
  );
};

export default ClassesGroupMaster;
