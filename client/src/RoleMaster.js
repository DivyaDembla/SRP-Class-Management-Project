import React, { useState, useEffect } from "react";
import "./RoleMaster.css";
import axios from "axios";

const API = "http://localhost:5000/api/roles";

const RoleMaster = () => {
  const [roles, setRoles] = useState([]);

  const [roleType, setRoleType] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [roleDescription, setRoleDescription] = useState("");

  const [errors, setErrors] = useState({
    roleName: "",
    roleDescription: "",
  });

  const nameRegex = /^[A-Za-z\s]+$/;

  /* ================= FETCH ================= */
  useEffect(() => {
    axios.get(API).then((res) => setRoles(res.data));
  }, []);

  /* ================= VALIDATION ================= */
  const validateRoleName = (value) => {
    if (!value || !value.trim()) return "Please select at least one role";
    if (!nameRegex.test(value.trim())) return "Only letters and spaces allowed";
    return "";
  };

  const validateDescription = (value) => {
    if (!value.trim()) return "Role Description is required";
    return "";
  };

  /* ================= CREATE ================= */
  const handleCreate = async () => {
    const finalRoleName = roleType === "Custom" ? customRole.trim() : roleType;

    const roleNameError = validateRoleName(finalRoleName);
    const descError = validateDescription(roleDescription);

    setErrors({
      roleName: roleNameError,
      roleDescription: descError,
    });

    if (roleNameError || descError) return;

    try {
      const res = await axios.post(API, {
        roleName: finalRoleName,
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

  /* ================= RESET ================= */
  const handleCancel = () => {
    setRoleType("");
    setCustomRole("");
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
          {/* ROLE NAME DROPDOWN */}
          <div className="form-group">
            <label className="label">Role Name *</label>

            <select
              value={roleType}
              onChange={(e) => {
                setRoleType(e.target.value);
                setCustomRole("");
                setErrors((p) => ({ ...p, roleName: "" }));
              }}
              onBlur={() => {
                if (!roleType)
                  setErrors((p) => ({
                    ...p,
                    roleName: "Please select at least one role",
                  }));
              }}
              className={`input ${errors.roleName ? "input-error" : ""}`}
            >
              {/* PLACEHOLDER (NOT SELECTABLE) */}
              <option value="" disabled hidden>
                Select Role
              </option>

              <option value="Admin">Admin</option>
              <option value="Teacher">Teacher</option>
              <option value="Accountant">Accountant</option>
              <option value="Custom">Custom</option>
            </select>

            {/* CUSTOM ROLE INPUT */}
            {roleType === "Custom" && (
              <input
                type="text"
                value={customRole}
                onChange={(e) => {
                  setCustomRole(e.target.value);
                  setErrors((p) => ({
                    ...p,
                    roleName: validateRoleName(e.target.value),
                  }));
                }}
                onBlur={() =>
                  setErrors((p) => ({
                    ...p,
                    roleName: validateRoleName(customRole),
                  }))
                }
                placeholder="Enter custom role name"
                className={`input ${errors.roleName ? "input-error" : ""}`}
                style={{ marginTop: "10px" }}
              />
            )}

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
                setErrors((p) => ({
                  ...p,
                  roleDescription: validateDescription(e.target.value),
                }));
              }}
              onBlur={() =>
                setErrors((p) => ({
                  ...p,
                  roleDescription: validateDescription(roleDescription),
                }))
              }
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
