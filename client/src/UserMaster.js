import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import CollapsibleCard from "./CollapsibleCard";
import "./UserMaster.css";

const API = "http://localhost:5000/api/users";
const CLASSGROUP_API = "http://localhost:5000/api/class-groups";

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
                <th>Class Groups</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.username}</td>
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
  username: "",
  gender: "Male",
  role: "",
  location: [],
};

const UserMaster = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [users, setUsers] = useState([]);
  const [classGroups, setClassGroups] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [errors, setErrors] = useState({});

  const editing = useMemo(() => editingUser !== null, [editingUser]);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    axios.get(API).then((res) => setUsers(res.data));
    axios.get(CLASSGROUP_API).then((res) => setClassGroups(res.data));
  }, []);

  const roles = ["Teacher", "Staff", "Accountant", "Admin"];

  /* ================= INPUT HANDLING ================= */

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ ...user });
    setErrors({});
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setSelectedLocation("");
    setEditingUser(null);
    setErrors({});
  };

  /* ================= SAVE / UPDATE ================= */

  const handleSaveOrUpdate = async () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";

    if (!formData.username.trim()) newErrors.username = "Username is required";
    else if (
      !editing &&
      users.some((u) => u.username === formData.username.trim())
    )
      newErrors.username = "Username already exists";

    if (!formData.role) newErrors.role = "Select a role";

    if (formData.location.length === 0)
      newErrors.location = "Add a class group";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      if (editing) {
        const res = await axios.put(`${API}/${formData._id}`, formData);
        setUsers((p) => p.map((u) => (u._id === res.data._id ? res.data : u)));
        alert("User updated successfully");
      } else {
        const res = await axios.post(API, formData);
        setUsers((p) => [...p, res.data]);

        alert(`User created!
Login Credentials save`);
      }

      handleReset();
    } catch (err) {
      alert(err.response?.data?.message || "Server error");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="usermaster-content">
      <CollapsibleCard title="User Master" defaultOpen={false}>
        <form>
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
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={editing}
                className={errors.username ? "input-error" : ""}
              />
              {errors.username && (
                <span className="error">{errors.username}</span>
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

            {/* CLASS GROUP DROPDOWN */}
            <div>
              <label>Class Group *</label>
              <select
                value={formData.location[0] || ""}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    location: [e.target.value],
                  }))
                }
                className={errors.location ? "input-error" : ""}
              >
                <option value="">Select Class Group</option>

                {classGroups.map((cg) => {
                  const label = `${cg.className} - ${cg.location}`;
                  return (
                    <option key={cg._id} value={label}>
                      {label}
                    </option>
                  );
                })}
              </select>

              {errors.location && (
                <span className="error">{errors.location}</span>
              )}
            </div>
          </div>

          <div className="button-group">
            <button
              type="button"
              className="btn-form btn-save-mode"
              disabled={editing}
              onClick={handleSaveOrUpdate}
            >
              Save
            </button>

            <button
              type="button"
              className="btn-form btn-update-mode"
              disabled={!editing}
              onClick={handleSaveOrUpdate}
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

      <UserListTable users={users} onEdit={handleEdit} />
    </div>
  );
};

export default UserMaster;
