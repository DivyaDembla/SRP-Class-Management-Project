import React, { useState, useEffect } from "react";
import axios from "axios";
import CollapsibleCard from "./CollapsibleCard";
import "./LocationMaster.css";

const API = "http://localhost:5000/api/locations";

const LocationMaster = () => {
  const [locationData, setLocationData] = useState({
    locationId: "",
    locationName: "",
    locationCode: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [locations, setLocations] = useState([]);

  /* ---------------- FETCH LOCATIONS ---------------- */
  useEffect(() => {
    axios.get(API).then((res) => setLocations(res.data));
  }, []);

  /* ---------------- VALIDATION ---------------- */
  const validateField = (name, value) => {
    let message = "";

    const nameRegex = /^[A-Za-z\s]+$/;
    const codeRegex = /^[A-Z0-9]{2,10}$/;

    if (name === "locationId") {
      if (!value.trim()) message = "Location ID is required";
      else if (!codeRegex.test(value.trim()))
        message = "Use 2–10 characters (A–Z, 0–9 only)";
    }

    if (name === "locationName") {
      if (!value.trim()) message = "Location Name is required";
      else if (!nameRegex.test(value.trim()))
        message = "Only letters and spaces allowed";
    }

    if (name === "locationCode") {
      if (!value.trim()) message = "Location Code is required";
      else if (!codeRegex.test(value.trim()))
        message = "Use 2–10 characters (A–Z, 0–9 only)";
    }

    if (name === "address") {
      if (!value.trim()) message = "Address is required";
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const validate = () => {
    const { locationId, locationName, locationCode, address } =
      locationData;

    const nameRegex = /^[A-Za-z\s]+$/;
    const codeRegex = /^[A-Z0-9]{2,10}$/;

    const newErrors = {};

    if (!locationId.trim())
      newErrors.locationId = "Location ID is required";
    else if (!codeRegex.test(locationId.trim()))
      newErrors.locationId =
        "Use 2–10 characters (A–Z, 0–9 only)";

    if (!locationName.trim())
      newErrors.locationName = "Location Name is required";
    else if (!nameRegex.test(locationName.trim()))
      newErrors.locationName =
        "Only letters and spaces allowed";

    if (!locationCode.trim())
      newErrors.locationCode = "Location Code is required";
    else if (!codeRegex.test(locationCode.trim()))
      newErrors.locationCode =
        "Use 2–10 characters (A–Z, 0–9 only)";

    if (!address.trim())
      newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- HANDLERS ---------------- */
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const newValue =
      name === "locationId" || name === "locationCode"
        ? value.toUpperCase()
        : value;

    setLocationData((prev) => ({ ...prev, [name]: newValue }));
    validateField(name, newValue);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await axios.post(API, locationData);
      setLocations((prev) => [res.data, ...prev]);
      setLocationData({
        locationId: "",
        locationName: "",
        locationCode: "",
        address: "",
      });
      setErrors({});
      //alert("✅ Location created successfully!");
    } catch (err) {
      console.error(err);
    //  alert("❌ Error creating location");
    }
  };

  const handleCancel = () => {
    setLocationData({
      locationId: "",
      locationName: "",
      locationCode: "",
      address: "",
    });
    setErrors({});
  };

  return (
    <div className="locationmaster-content">
      {/* FORM CARD */}
      <CollapsibleCard title="Location Master" defaultOpen={false}>
        <form onSubmit={handleCreate}>
          <div className="form-grid">
            <div>
              <label className="form-label">Location ID *</label>
              <input
                type="text"
                name="locationId"
                value={locationData.locationId}
                onChange={handleInputChange}
                onBlur={(e) =>
                  validateField("locationId", e.target.value)
                }
                className={`form-input ${
                  errors.locationId ? "input-error" : ""
                }`}
              />
              {errors.locationId && (
                <span className="error">{errors.locationId}</span>
              )}

              <label className="form-label">Location Name *</label>
              <input
                type="text"
                name="locationName"
                value={locationData.locationName}
                onChange={handleInputChange}
                onBlur={(e) =>
                  validateField("locationName", e.target.value)
                }
                className={`form-input ${
                  errors.locationName ? "input-error" : ""
                }`}
              />
              {errors.locationName && (
                <span className="error">{errors.locationName}</span>
              )}

              <label className="form-label">Location Code *</label>
              <input
                type="text"
                name="locationCode"
                value={locationData.locationCode}
                onChange={handleInputChange}
                onBlur={(e) =>
                  validateField("locationCode", e.target.value)
                }
                className={`form-input ${
                  errors.locationCode ? "input-error" : ""
                }`}
              />
              {errors.locationCode && (
                <span className="error">{errors.locationCode}</span>
              )}
            </div>

            <div className="grid-full">
              <label className="form-label">Address *</label>
              <textarea
                name="address"
                value={locationData.address}
                onChange={handleInputChange}
                onBlur={(e) =>
                  validateField("address", e.target.value)
                }
                rows="3"
                className={`form-textarea ${
                  errors.address ? "input-error" : ""
                }`}
              />
              {errors.address && (
                <span className="error">{errors.address}</span>
              )}
            </div>
          </div>

          <div className="button-group">
            <button type="submit" className="btn btn-primary">
              Create
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </CollapsibleCard>

      {/* TABLE */}
      <div className="form-card">
        <h3 className="list-title">Saved Locations</h3>

        <div className="table-container">
          <table className="location-table">
            <thead>
              <tr>
                <th>Location ID</th>
                <th>Location Name</th>
                <th>Location Code</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {locations.length === 0 ? (
                <tr>
                  <td colSpan="4" className="no-data">
                    No locations added yet
                  </td>
                </tr>
              ) : (
                locations.map((loc) => (
                  <tr key={loc._id}>
                    <td>{loc.locationId}</td>
                    <td>{loc.locationName}</td>
                    <td>{loc.locationCode}</td>
                    <td>{loc.address}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LocationMaster;
