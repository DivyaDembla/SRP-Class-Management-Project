import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import CollapsibleCard from "./CollapsibleCard";
import "./UserMaster.css";

const API = "http://localhost:5000/api/users";

/* ================= USER LIST TABLE ================= */
const UserListTable = ({ users, onEdit }) => {
  return (
    <div className="list-card">
      <h3>Registered Users ({users.length})</h3>
      <hr />

      {users.length === 0 ? (
        <p className="no-data">No users added yet.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Name</th>
                <th>Role</th>
                <th>Gender</th>
                <th>Locations</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.userCode}>
                  <td>{user.userCode}</td>
                  <td>{user.name}</td>
                  <td>{user.role}</td>
                  <td>{user.gender}</td>
                  <td>{user.location.join(", ")}</td>
                  <td>
                    <button className="btn-edit" onClick={() => onEdit(user)}>
                      ✏️ Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

/* ================= MAIN COMPONENT ================= */

const initialFormData = {
  _id: null,
  name: "",
  userCode: "",
  gender: "Male",
  role: "",
  location: [],
};

const UserMaster = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [errors, setErrors] = useState({});

  const editing = useMemo(() => editingUser !== null, [editingUser]);

  useEffect(() => {
    axios.get(API).then((res) => setUsers(res.data));
  }, []);

  const roles = ["Teacher", "Staff", "Accountant", "Admin"];
  const locations = ["Chembur", "Mankhur", "Andheri", "Kurla", "Ghatkopar"];

  /* ========== VALIDATION ========== */
  const validateField = (field, value) => {
    let msg = "";

    if (field === "name") {
      if (!value.trim()) msg = "Name is required";
    }

    if (field === "userCode") {
      if (!value.trim()) msg = "User name is required";
      else if (!editing && users.some((u) => u.userCode === value.trim()))
        msg = "User Code already exists";
    }

    if (field === "role" && !value) msg = "Select a role";

    if (field === "location" && formData.location.length === 0)
      msg = "Add at least one location";

    setErrors((p) => ({ ...p, [field]: msg }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    validateField(name, value);
  };

  const handleAddLocation = () => {
    if (selectedLocation && !formData.location.includes(selectedLocation)) {
      setFormData((p) => ({
        ...p,
        location: [...p.location, selectedLocation],
      }));
      setSelectedLocation("");
      validateField("location");
    }
  };

  const handleRemoveLocation = (loc) => {
    setFormData((p) => ({
      ...p,
      location: p.location.filter((l) => l !== loc),
    }));
    validateField("location");
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData(user);
    setErrors({});
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setSelectedLocation("");
    setEditingUser(null);
    setErrors({});
  };

  const handleSaveOrUpdate = async (e) => {
    e.preventDefault();

    validateField("name", formData.name);
    validateField("userCode", formData.userCode);
    validateField("role", formData.role);
    validateField("location");

    if (Object.values(errors).some((e) => e)) return;

    if (editing) {
      const res = await axios.put(`${API}/${formData._id}`, formData);
      setUsers((p) => p.map((u) => (u._id === res.data._id ? res.data : u)));
      alert("User updated successfully");
    } else {
      const res = await axios.post(API, formData);
      setUsers((p) => [...p, res.data]);
      alert("User added successfully");
    }

    handleReset();
  };

  return (
    <div className="usermaster-content">
      <CollapsibleCard title="User Master" defaultOpen={false}>
        <form onSubmit={handleSaveOrUpdate}>
          <div className="form-grid">
            <div>
              <label>Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? "input-error" : ""}
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>

            <div>
              <label>Username *</label>
              <input
                type="text"
                name="userCode"
                value={formData.userCode}
                onChange={handleInputChange}
                disabled={editing}
                className={errors.userCode ? "input-error" : ""}
              />
              {errors.userCode && (
                <span className="error">{errors.userCode}</span>
              )}
            </div>
          </div>

          <div className="form-grid">
            <div>
              <label>Gender</label>
              <div className="gender-options">
                {["Male", "Female", "Others"].map((g) => (
                  <label key={g}>
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={formData.gender === g}
                      onChange={handleInputChange}
                    />
                    {g}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="form-grid">
            <div>
              <label>Role *</label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, role: e.target.value }))
                }
              >
                <option value="">Select Role</option>
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              {errors.role && <span className="error">{errors.role}</span>}
            </div>

            <div className="location-control">
              <label>Location(s) *</label>
              <div className="location-select-add">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="">Select Location</option>
                  {locations.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>

                <button type="button" onClick={handleAddLocation}>
                  Add
                </button>
              </div>

              <div className="location-tags">
                {formData.location.map((loc) => (
                  <span key={loc} className="location-tag">
                    {loc}
                    <button
                      type="button"
                      onClick={() => handleRemoveLocation(loc)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {errors.location && (
                <span className="error">{errors.location}</span>
              )}
            </div>
          </div>

          <div className="button-group">
            <button
              type="submit"
              className="btn-form btn-save-mode"
              disabled={editing}
            >
              Save
            </button>

            <button
              type="submit"
              className="btn-form btn-update-mode"
              disabled={!editing}
            >
              Update
            </button>

            <button
              type="button"
              className="btn-form btn-reset-mode"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </form>
      </CollapsibleCard>

      {/* USER LIST */}
      <UserListTable users={users} onEdit={handleEdit} />
    </div>
  );
};

export default UserMaster;
