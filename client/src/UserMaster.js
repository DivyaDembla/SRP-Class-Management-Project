import React, { useState, useMemo } from "react";
import "./UserMaster.css";

// --- User List Component ---
const UserListTable = ({ users, onEdit }) => {
  return (
    <div className="list-card">
      <h3>Registered Users ({users.length})</h3>
      <hr />
      {users.length === 0 ? (
        <p className="no-data">No users added yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Code</th>
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
      )}
    </div>
  );
};
// ----------------------------

const initialFormData = {
  id: null, 
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
  const [errors, setErrors] = useState({}); // Error state

  const editing = useMemo(() => editingUser !== null, [editingUser]);

  const roles = ["Teacher", "Staff", "Accountant", "Admin"];
  const locations = ["Chembur", "Mankhur", "Andheri", "Kurla", "Ghatkopar"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

     const preventEnterSubmit = (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
  }
};


  const handleRoleChange = (e) => {
    setFormData((prev) => ({ ...prev, role: e.target.value }));
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  const handleAddLocation = () => {
    if (selectedLocation && !formData.location.includes(selectedLocation)) {
      setFormData((prev) => ({
        ...prev,
        location: [...prev.location, selectedLocation],
      }));
      setSelectedLocation("");
    }
  };

  const handleRemoveLocation = (locToRemove) => {
    setFormData((prev) => ({
      ...prev,
      location: prev.location.filter((loc) => loc !== locToRemove),
    }));
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setSelectedLocation("");
    setEditingUser(null);
    setErrors({});
  };

  const handleEdit = (userToEdit) => {
    setEditingUser(userToEdit);
    setFormData(userToEdit);
    setSelectedLocation("");
    setErrors({});
  };

  // --- Validation function ---
  const validate = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-z\s]+$/;
    const codeRegex = /^[0-9]+$/;

    if (!formData.name.trim()) newErrors.name = "Name is required";
    else if (!nameRegex.test(formData.name.trim()))
      newErrors.name = "Only letters and spaces allowed";

    if (!/^[a-zA-Z0-9]+$/.test(formData.user_code)) {
  errors.user_code = "User code must be alphanumeric (A–Z, 0–9 only)";
} else {
  delete errors.user_code;
}

    if (!formData.role) newErrors.role = "Select a role";
    if (formData.location.length === 0)
      newErrors.location = "Add at least one location";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveOrUpdate = (e) => {
    e.preventDefault();

    if (!validate()) return;

    if (!editing && users.some((u) => u.userCode === formData.userCode)) {
      setErrors({ userCode: "User Code already exists" });
      return;
    }

    const userData = { ...formData, id: formData.id || Date.now() };

    if (editing) {
      setUsers((prev) =>
        prev.map((user) =>
          user.userCode === editingUser.userCode ? userData : user
        )
      );
      alert(`✅ User ${userData.name} updated successfully!`);
    } else {
      setUsers((prev) => [...prev, userData]);
      alert("✅ New user added successfully!");
    }

    handleReset();
  };

  return (
    <div className="usermaster-content">
      <div className="form-card">
        <h2>{editing ? "Update User Details" : "User Master"}</h2>
        <hr />
        <form onSubmit={handleSaveOrUpdate} onKeyDown={preventEnterSubmit}>

          <div className="form-grid">
            <div>
              <label>Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                
                placeholder="Enter your name"
                className={errors.name ? "input-error" : ""}
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>
            <div>
              <label>User Code *</label>
              <input
                type="text"
                name="userCode"
                value={formData.userCode}
                onChange={handleInputChange}
                placeholder="Numeric Value"
                disabled={editing}
                className={errors.userCode ? "input-error" : ""}
              />
              {errors.userCode && <span className="error">{errors.userCode}</span>}
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
                name="role"
                value={formData.role}
                onChange={handleRoleChange}
                className={errors.role ? "input-error" : ""}
              >
                <option value="">Select a Role</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              {errors.role && <span className="error">{errors.role}</span>}
            </div>

            <div className="location-control">
              <label>Location(s) *</label>
              <div className="location-select-add">
                <select
                  name="selectedLocation"
                  value={selectedLocation}
                  onChange={handleLocationChange}
                >
                  <option value="">Select a Location</option>
                  {locations.map((loc) => (
                    <option
                      key={loc}
                      value={loc}
                      disabled={formData.location.includes(loc)}
                    >
                      {loc}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddLocation}
                  className="btn-add-loc"
                  disabled={!selectedLocation}
                >
                  Add
                </button>
              </div>
              <div className="location-tags">
                {formData.location.map((loc) => (
                  <span key={loc} className="location-tag">
                    {loc}
                    <button type="button" onClick={() => handleRemoveLocation(loc)}>
                      x
                    </button>
                  </span>
                ))}
              </div>
              {errors.location && <span className="error">{errors.location}</span>}
            </div>
          </div>

          <div className="button-group">
            <button
              type="submit"
              className={`btn-form ${!editing ? "btn-save-mode" : "btn-reset-mode"}`}
              disabled={editing}
            >
              Save
            </button>
            <button
              type="submit"
              className={`btn-form ${editing ? "btn-update-mode" : "btn-reset-mode"}`}
              disabled={!editing}
            >
              Update
            </button>
            <button type="button" onClick={handleReset} className="btn-form btn-reset-mode">
              Reset
            </button>
          </div>
        </form>
      </div>

      <UserListTable users={users} onEdit={handleEdit} />
    </div>
  );
};

export default UserMaster;
