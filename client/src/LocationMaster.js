import React, { useState, useEffect } from "react";
import axios from "axios";
import CollapsibleCard from "./CollapsibleCard";
import "./LocationMaster.css";

const API = "http://localhost:5000/api/locations";

const LocationMaster = () => {
  const [locationData, setLocationData] = useState({
    locationName: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [locations, setLocations] = useState([]);

  // Fetch locations on load
  useEffect(() => {
    axios.get(API).then((res) => setLocations(res.data));
  }, []);

  /* ---------------- VALIDATION ---------------- */
  const validateField = (name, value) => {
    let message = "";
    const nameRegex = /^[A-Za-z\s]+$/;

    if (name === "locationName") {
      if (!value.trim()) message = "Location Name is required";
      else if (!nameRegex.test(value.trim()))
        message = "Only letters and spaces allowed";
    }

    if (name === "address") {
      if (!value.trim()) message = "Address is required";
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const validate = () => {
    const { locationName, address } = locationData;
    const nameRegex = /^[A-Za-z\s]+$/;
    const newErrors = {};

    if (!locationName.trim())
      newErrors.locationName = "Location Name is required";
    else if (!nameRegex.test(locationName.trim()))
      newErrors.locationName = "Only letters and spaces allowed";

    if (!address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- HANDLERS ---------------- */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocationData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await axios.post(API, locationData);
      setLocations((prev) => [res.data, ...prev]);
      setLocationData({ locationName: "", address: "" });
      setErrors({});
      alert("✅ Location created successfully!");
    } catch (err) {
      alert("❌ Error creating location");
      console.error(err);
    }
  };

  const handleCancel = () => {
    setLocationData({ locationName: "", address: "" });
    setErrors({});
  };

  return (
    <div className="locationmaster-content">
      {/* 🔽 FORM CARD (COLLAPSIBLE & DEFAULT CLOSED) */}
      <CollapsibleCard title="Location Master" defaultOpen={false}>
        <form onSubmit={handleCreate}>
          <div className="form-grid">
            <div>
              <label className="form-label">Location Name *</label>
              <input
                type="text"
                name="locationName"
                value={locationData.locationName}
                onChange={handleInputChange}
                onBlur={(e) => validateField("locationName", e.target.value)}
                className={`form-input ${
                  errors.locationName ? "input-error" : ""
                }`}
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
                onBlur={(e) => validateField("address", e.target.value)}
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

      {/* 📊 TABLE CARD (NORMAL CARD, NOT COLLAPSIBLE) */}
      <div className="form-card">
        <h3 className="list-title">Saved Locations</h3>

        <div className="table-container">
          <table className="location-table">
            <thead>
              <tr>
                <th>Location Name</th>
                <th>Address</th>
              </tr>
            </thead>

            <tbody>
              {locations.length === 0 ? (
                <tr>
                  <td colSpan="2" className="no-data">
                    No locations added yet
                  </td>
                </tr>
              ) : (
                locations.map((loc) => (
                  <tr key={loc._id}>
                    <td>{loc.locationName}</td>
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
