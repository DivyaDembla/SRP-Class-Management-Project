import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LocationMaster.css";

const API = "http://localhost:5000/api/locations";

const LocationMaster = () => {
  const [locationData, setLocationData] = useState({
    locationName: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [locations, setLocations] = useState([]); // fetched list

  // Fetch all locations on page load
  useEffect(() => {
    axios.get(API).then((res) => setLocations(res.data));
  }, []);

  // --- LIVE VALIDATION ---
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

  // --- FULL FORM VALIDATION ---
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

  // Input handler + validate live
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

      alert("✅ Location created successfully!");

      // Add new location to the list without reload
      setLocations((prev) => [res.data, ...prev]);

      // Reset form
      setLocationData({ locationName: "", address: "" });
      setErrors({});
    } catch (err) {
      alert("❌ Error creating location");
      console.log(err);
    }
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
                onBlur={(e) => validateField("locationName", e.target.value)}
                placeholder="Enter location name"
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
                placeholder="Enter the address"
                className={`form-textarea ${
                  errors.address ? "input-error" : ""
                }`}
                rows="3"
              ></textarea>
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

        {/* SHOW ALL LOCATIONS */}
        <h3 className="list-title">Saved Locations</h3>
        <ul className="location-list">
          {locations.map((loc) => (
            <li key={loc._id}>
              <strong>{loc.locationName}</strong> — {loc.address}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LocationMaster;
