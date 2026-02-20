import React, { useState, useEffect } from "react";
import axios from "axios";
import CollapsibleCard from "./CollapsibleCard";
import "./LocationMaster.css";

const API = "http://localhost:5000/api/locations";

const LocationMaster = () => {
  const [locationData, setLocationData] = useState({
    locationName: "",
    pincode: "",
    city: "",
  });

  const [errors, setErrors] = useState({});
  const [locations, setLocations] = useState([]);

  /* ---------------- FETCH LOCATIONS ---------------- */
  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    const res = await axios.get(API);
    setLocations(res.data);
  };

  /* ---------------- VALIDATION ---------------- */
  const validateField = (name, value) => {
    let message = "";

    const nameRegex = /^[A-Za-z\s]+$/;
    const pincodeRegex = /^[1-9][0-9]{5}$/;

    if (name === "locationName") {
      if (!value.trim()) message = "Location Name is required";
      else if (!nameRegex.test(value.trim()))
        message = "Only letters and spaces allowed";
    }

    if (name === "pincode") {
      if (!value.trim()) message = "Pincode is required";
      else if (!pincodeRegex.test(value))
        message = "Enter valid 6 digit Indian pincode";
    }

    if (name === "city") {
      if (!value.trim()) message = "City is required";
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const validate = () => {
    const { locationName, pincode, city } = locationData;

    const nameRegex = /^[A-Za-z\s]+$/;
    const pincodeRegex = /^[1-9][0-9]{5}$/;

    const newErrors = {};

    if (!locationName.trim())
      newErrors.locationName = "Location Name is required";
    else if (!nameRegex.test(locationName.trim()))
      newErrors.locationName = "Only letters and spaces allowed";

    if (!pincode.trim()) newErrors.pincode = "Pincode is required";
    else if (!pincodeRegex.test(pincode))
      newErrors.pincode = "Enter valid 6 digit Indian pincode";

    if (!city.trim()) newErrors.city = "City is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- HANDLERS ---------------- */
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const newValue = name === "pincode" ? value.replace(/\D/g, "") : value;

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
        locationName: "",
        pincode: "",
        city: "",
      });

      setErrors({});
    } catch (err) {
      console.error(err);
      alert("Error creating location");
    }
  };

  const handleCancel = () => {
    setLocationData({
      locationName: "",
      pincode: "",
      city: "",
    });
    setErrors({});
  };

  return (
    <div className="locationmaster-content">
      <CollapsibleCard title="Location Master" defaultOpen={false}>
        <form onSubmit={handleCreate}>
          <div className="form-grid">
            <div className="field">
              <label className="form-label">Location Name *</label>
              <input
                type="text"
                name="locationName"
                value={locationData.locationName}
                onChange={handleInputChange}
                onBlur={(e) => validateField("locationName", e.target.value)}
                className={`form-input ${errors.locationName ? "input-error" : ""}`}
              />
              {errors.locationName && (
                <span className="error">{errors.locationName}</span>
              )}
            </div>

            <div className="field">
              <label className="form-label">Pincode *</label>
              <input
                type="text"
                name="pincode"
                maxLength="6"
                value={locationData.pincode}
                onChange={handleInputChange}
                onBlur={(e) => validateField("pincode", e.target.value)}
                className={`form-input ${errors.pincode ? "input-error" : ""}`}
              />
              {errors.pincode && (
                <span className="error">{errors.pincode}</span>
              )}
            </div>

            <div className="grid-full">
              <label className="form-label">City *</label>
              <input
                type="text"
                name="city"
                value={locationData.city}
                onChange={handleInputChange}
                onBlur={(e) => validateField("city", e.target.value)}
                className={`form-input ${errors.city ? "input-error" : ""}`}
              />
              {errors.city && <span className="error">{errors.city}</span>}
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

      <div className="form-card">
        <h3 className="list-title">Saved Locations</h3>

        <div className="table-container">
          <table className="location-table">
            <thead>
              <tr>
                <th>Location ID</th>
                <th>Location Name</th>
                <th>Pincode</th>
                <th>City</th>
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
                    <td>{loc.pincode}</td>
                    <td>{loc.city}</td>
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
