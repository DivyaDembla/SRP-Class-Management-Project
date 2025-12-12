import React, { useState, useEffect } from "react";
import "./RoleMaster.css";
import axios from "axios";

const API = "http://localhost:5000/api/roles";

const RoleMaster = () => {
  const [roles, setRoles] = useState([]); // ⬅ NEW (needed)

  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");

  // Validation errors
  const [errors, setErrors] = useState({
    roleName: "",
    roleDescription: "",
  });

  const nameRegex = /^[A-Za-z\s]+$/;

  // ------------------------
  // FETCH ROLES FROM DB
  // ------------------------
  useEffect(() => {
    axios.get(API).then((res) => setRoles(res.data));
  }, []);

  // ------------------------
  // LIVE VALIDATION
  // ------------------------
  const validateField = (field, value) => {
    let message = "";

    if (field === "roleName") {
      if (!value.trim()) message = "Role Name is required";
      else if (!nameRegex.test(value.trim()))
        message = "Only letters and spaces allowed";
    }

    if (field === "roleDescription") {
      if (!value.trim()) message = "Role Description is required";
    }

    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const handleCreate = async () => {
    validateField("roleName", roleName);
    validateField("roleDescription", roleDescription);

    if (!roleName.trim() || !roleDescription.trim()) return;

    try {
      const res = await axios.post(API, {
        roleName: roleName.trim(),
        roleDescription: roleDescription.trim(),
      });

      setRoles((prev) => [res.data, ...prev]);

      alert("✅ Role created successfully!");
      handleCancel();
    } catch (error) {
      alert("❌ Error creating role");
      console.log(error);
    }
  };

  const handleCancel = () => {
    setRoleName("");
    setRoleDescription("");
    setErrors({
      roleName: "",
      roleDescription: "",
    });
  };

  return (
    <div className="rolemaster-content">
      <div className="card">
        <h2 className="title">Role Master</h2>
        <hr className="divider" />
        <form>
          {/* ROLE NAME */}
          <div className="form-group">
            <label className="label">Role Name *</label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => {
                setRoleName(e.target.value);
                validateField("roleName", e.target.value);
              }}
              onBlur={() => validateField("roleName", roleName)}
              placeholder="Enter Role name"
              className={`input ${errors.roleName ? "input-error" : ""}`}
            />
            {errors.roleName && (
              <span className="error">{errors.roleName}</span>
            )}
          </div>

          {/* ROLE DESCRIPTION */}
          <div className="form-group">
            <label className="label">Role Description *</label>
            <textarea
              value={roleDescription}
              onChange={(e) => {
                setRoleDescription(e.target.value);
                validateField("roleDescription", e.target.value);
              }}
              onBlur={() => validateField("roleDescription", roleDescription)}
              placeholder="What is the role about"
              className={`textarea ${
                errors.roleDescription ? "input-error" : ""
              }`}
              rows="4"
            />
            {errors.roleDescription && (
              <span className="error">{errors.roleDescription}</span>
            )}
          </div>

          <div className="button-group">
            <button
              type="button"
              onClick={handleCreate}
              className="btn btn-create"
            >
              Create
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-cancel"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleMaster;
