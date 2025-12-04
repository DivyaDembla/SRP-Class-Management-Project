import React, { useState } from "react";
import "./LocationMaster.css";

const LocationMaster = () => {
  const [locationData, setLocationData] = useState({
    locationName: "",
    address: "",
  });

  const [errors, setErrors] = useState({}); // Error state

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocationData((prev) => ({ ...prev, [name]: value }));
  };

  // Validation function
  const validate = () => {
    const { locationName, address } = locationData;
    const nameRegex = /^[A-Za-z\s]+$/;
    const newErrors = {};

    if (!locationName.trim()) newErrors.locationName = "Location Name is required";
    else if (!nameRegex.test(locationName.trim()))
      newErrors.locationName = "Only letters and spaces allowed";

    if (!address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = (e) => {
    e.preventDefault();

    if (!validate()) return;

    console.log("Creating new location:", locationData);
    alert("✅ Location created successfully!");
    setLocationData({ locationName: "", address: "" });
    setErrors({});
  };

  const handleCancel = () => {
    setLocationData({ locationName: "", address: "" });
    setErrors({});
  };

  return (
    <div className="locationmaster-content">
      <div className="form-card">
        <h2 className="form-title">Location Master</h2>
        <div className="line"></div>
        <form onSubmit={handleCreate}>
          <div className="form-grid">
            <div>
              <label className="form-label">Location Name *</label>
              <input
                type="text"
                name="locationName"
                value={locationData.locationName}
                onChange={handleInputChange}
                onBlur={validate}
                placeholder="Enter location name"
                className={`form-input ${errors.locationName ? "input-error" : ""}`}
              />
              {errors.locationName && (
                <span className="error">{errors.locationName}</span>
              )}
            </div>
            <div className="grid-full">
              <label className="form-label">Address *</label>
              <textarea
                name="address"
                value={locationData.address}
                onChange={handleInputChange}
                onBlur={validate}
                placeholder="Enter the address"
                className={`form-textarea ${errors.address ? "input-error" : ""}`}
                rows="3"
              ></textarea>
              {errors.address && <span className="error">{errors.address}</span>}
            </div>
          </div>
          <div className="button-group">
            <button type="submit" className="btn btn-primary">
              Create
            </button>
            <button type="button" onClick={handleCancel} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationMaster;
