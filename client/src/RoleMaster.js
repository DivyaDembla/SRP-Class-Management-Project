import React, { useState } from "react";
import "./RoleMaster.css";

const RoleMaster = () => {
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");

  // State to store field-specific errors
  const [errors, setErrors] = useState({});

  // Validate inputs live
  const validate = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-z\s]+$/;

    if (!roleName.trim()) newErrors.roleName = "Role Name is required";
    else if (!nameRegex.test(roleName.trim()))
      newErrors.roleName = "Only letters and spaces allowed";

    if (!roleDescription.trim())
      newErrors.roleDescription = "Role Description is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) return;

    console.log("Creating Role:", {
      roleName: roleName.trim(),
      roleDescription: roleDescription.trim(),
    });
    alert("✅ Role created successfully!");
    handleCancel();
  };

  const handleCancel = () => {
    setRoleName("");
    setRoleDescription("");
    setErrors({});
  };

  return (
    <div className="rolemaster-content">
      <div className="card">
        <h2 className="title">Role Master</h2>
        <hr className="divider" />
        <form>
          <div className="form-group">
            <label className="label">Role Name *</label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              onBlur={validate}
              placeholder="Enter Role name"
              className={`input ${errors.roleName ? "input-error" : ""}`}
              required
            />
            {errors.roleName && <span className="error">{errors.roleName}</span>}
          </div>

          <div className="form-group">
            <label className="label">Role Description *</label>
            <textarea
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
              onBlur={validate}
              placeholder="What is the role about"
              className={`textarea ${errors.roleDescription ? "input-error" : ""}`}
              rows="4"
              required
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
