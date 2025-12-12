import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./UserMaster.css";

const API = "http://localhost:5000/api/users";

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

  const [errors, setErrors] = useState({}); // Validation errors
  useEffect(() => {
    axios.get(API).then((res) => setUsers(res.data));
  }, []);

  const editing = useMemo(() => editingUser !== null, [editingUser]);

  const roles = ["Teacher", "Staff", "Accountant", "Admin"];
  const locations = ["Chembur", "Mankhur", "Andheri", "Kurla", "Ghatkopar"];

  // ----------------------------------------
  // LIVE VALIDATION FOR EACH FIELD
  // ----------------------------------------
  const validateField = (field, value) => {
    let message = "";

    if (field === "name") {
      const nameRegex = /^[A-Za-z\s]+$/;
      if (!value.trim()) message = "Name is required";
      else if (!nameRegex.test(value.trim()))
        message = "Only letters and spaces allowed";
    }

    if (field === "userCode") {
      const codeRegex = /^[A-Za-z0-9]+$/;
      if (!value.trim()) message = "User Code is required";
      else if (!codeRegex.test(value.trim()))
        message = "User Code must be alphanumeric";
      else if (!editing && users.some((u) => u.userCode === value.trim()))
        message = "User Code already exists";
    }

    if (field === "role") {
      if (!value) message = "Select a role";
    }

    if (field === "location") {
      if (formData.location.length === 0) message = "Add at least one location";
    }

    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  // Input change + validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    validateField(name, value);
  };

  const preventEnterSubmit = (e) => {
    if (e.key === "Enter") e.preventDefault();
  };

  const handleRoleChange = (e) => {
    setFormData((prev) => ({ ...prev, role: e.target.value }));
    validateField("role", e.target.value);
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

      validateField("location");
    }
  };

  const handleRemoveLocation = (locToRemove) => {
    setFormData((prev) => {
      const updated = prev.location.filter((loc) => loc !== locToRemove);
      validateField("location");
      return { ...prev, location: updated };
    });
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
    setErrors({});
  };

  // Final form validation before save
  const validateForm = () => {
    validateField("name", formData.name);
    validateField("userCode", formData.userCode);
    validateField("role", formData.role);
    validateField("location");

    return Object.values(errors).every((err) => err === "");
  };

  const handleSaveOrUpdate = async (e) => {
    e.preventDefault();

    validateForm();
    if (Object.values(errors).some((err) => err)) return;

    const userData = {
      name: formData.name,
      userCode: formData.userCode,
      gender: formData.gender,
      role: formData.role,
      location: formData.location,
    };

    try {
      if (editing) {
        // UPDATE
        const res = await axios.put(`${API}/${formData._id}`, userData);

        setUsers((prev) =>
          prev.map((u) => (u._id === res.data._id ? res.data : u))
        );

        alert("User updated successfully!");
      } else {
        // CREATE NEW
        const res = await axios.post(API, userData);
        setUsers((prev) => [...prev, res.data]);

        alert("User added successfully!");
      }

      handleReset();
    } catch (err) {
      console.log(err);
      alert("Error saving user!");
    }
  };

  return (
    <div className="usermaster-content">
      <div className="form-card">
        <h2>{editing ? "Update User Details" : "User Master"}</h2>
        <hr />

        <form onSubmit={handleSaveOrUpdate} onKeyDown={preventEnterSubmit}>
          <div className="form-grid">
            {/* NAME */}
            <div>
              <label>Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={() => validateField("name", formData.name)}
                className={errors.name ? "input-error" : ""}
                placeholder="Enter your name"
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>

            {/* USER CODE */}
            <div>
              <label>User Code *</label>
              <input
                type="text"
                name="userCode"
                value={formData.userCode}
                onChange={handleInputChange}
                onBlur={() => validateField("userCode", formData.userCode)}
                placeholder="Alphanumeric"
                disabled={editing}
                className={errors.userCode ? "input-error" : ""}
              />
              {errors.userCode && (
                <span className="error">{errors.userCode}</span>
              )}
            </div>
          </div>

          {/* GENDER */}
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
            {/* ROLE */}
            <div>
              <label>Role *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleRoleChange}
                onBlur={() => validateField("role", formData.role)}
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

            {/* LOCATION */}
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
                  className="btn-add-loc"
                  onClick={handleAddLocation}
                  disabled={!selectedLocation}
                >
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
                      x
                    </button>
                  </span>
                ))}
              </div>

              {errors.location && (
                <span className="error">{errors.location}</span>
              )}
            </div>
          </div>

          {/* BUTTONS */}
          <div className="button-group">
            <button
              type="submit"
              className={`btn-form ${
                !editing ? "btn-save-mode" : "btn-reset-mode"
              }`}
              disabled={editing}
            >
              Save
            </button>

            <button
              type="submit"
              className={`btn-form ${
                editing ? "btn-update-mode" : "btn-reset-mode"
              }`}
              disabled={!editing}
            >
              Update
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
      </div>

      <UserListTable users={users} onEdit={handleEdit} />
    </div>
  );
};

export default UserMaster;
