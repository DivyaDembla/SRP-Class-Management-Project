import React, { useState, useMemo } from "react";
import "./ClassesGroupMaster.css";

// --- Class Group List Component ---
const ClassesGroupList = ({ groups, onEdit }) => (
    <div className="card list-card">
        <h3 className="card-subtitle">Class Groups List ({groups.length})</h3>
        <hr className="divider" />
        <table>
            <thead>
                <tr>
                    <th>Location</th>
                    <th>Class Name</th>
                    <th>City</th>
                    <th>Email ID</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {groups.length === 0 ? (
                    <tr><td colSpan="5" className="empty-row">No Class Groups found.</td></tr>
                ) : (
                    groups.map((group) => (
                        <tr key={`${group.location}-${group.className}`}>
                            <td>{group.location}</td>
                            <td>{group.className}</td>
                            <td>{group.city}</td>
                            <td>{group.emailId}</td>
                            <td><button onClick={() => onEdit(group)} className="btn-edit">✏️ Edit</button></td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    </div>
);
// -----------------------------------------------------

const initialFormData = {
    location: "",
    className: "",
    address1: "",
    address2: "",
    city: "",
    pinCode: "",
    fax: "",
    emailId: "",
    gst: "",
};

const ClassesGroupMaster = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  
  // State for CRUD operations
  const [groups, setGroups] = useState([]);
  const [editingGroup, setEditingGroup] = useState(null); 

  const editing = useMemo(() => editingGroup !== null, [editingGroup]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMsg = "";

    switch (name) {
      case "location":
        if (!value.trim()) errorMsg = "Location is required.";
        break;
      case "className":
        if (!value.trim()) errorMsg = "Class name is required.";
        break;
      case "emailId":
        if (value && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value))
          errorMsg = "Enter a valid email.";
        break;
      case "pinCode":
        if (value && !/^\d{6}$/.test(value))
          errorMsg = "Pin code must be 6 digits.";
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };
  
  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    setEditingGroup(null);
  };

  const handleEdit = (groupToEdit) => {
    setEditingGroup(groupToEdit);
    setFormData(groupToEdit);
    setErrors({});
  };

  const handleSaveOrUpdate = (e) => {
    e.preventDefault();
    
    // Check for required fields and validation errors
    const formErrors = Object.values(errors).filter(e => e).length > 0;
    if (formErrors || !formData.location || !formData.className) {
        alert("Please fix validation errors and fill in all required fields (Location, Class Name).");
        return;
    }

    if (editing) {
        // --- Update Logic ---
        setGroups(prev => prev.map(group => 
            // Use location and className as the unique key for updating
            (group.location === editingGroup.location && group.className === editingGroup.className) 
            ? formData 
            : group
        ));
        alert(`✅ Group updated: ${formData.className} at ${formData.location}`);
    } else {
        // --- Save Logic ---
        const isDuplicate = groups.some(g => 
            g.location === formData.location && g.className === formData.className
        );
        if (isDuplicate) {
            alert("This Class Group already exists at this location.");
            return;
        }
        setGroups(prev => [...prev, formData]);
        alert(`✅ New Group saved: ${formData.className} at ${formData.location}`);
    }
    
    handleReset();
  };


  return (
    <div className="classesgroupmaster-content">
      <div className="card">
        <h2 className="card-title">{editing ? 'Update Class Group' : 'Classes Group Master'}</h2>
        <hr className="divider" />
        <form onSubmit={handleSaveOrUpdate}>
          <div className="form-grid">
            {/* Location */}
            <div>
              <label className="label">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter Location"
                className="input"
                required
                disabled={editing} // Disable key field on edit
              />
               {errors.location && <p className="error">{errors.location}</p>}
            </div>

            {/* Class Name */}
            <div>
              <label className="label">Classes Name *</label>
              <input
                type="text"
                name="className"
                value={formData.className}
                onChange={handleInputChange}
                placeholder="Enter Class Name"
                className="input"
                required
                disabled={editing} // Disable key field on edit
              />
              {errors.className && <p className="error">{errors.className}</p>}
            </div>

            {/* Address 1 */}
            <div className="full-width">
              <label className="label">Address 1</label>
              <textarea
                name="address1"
                value={formData.address1}
                onChange={handleInputChange}
                placeholder="Enter address"
                className="textarea"
                rows="2"
              ></textarea>
            </div>

            {/* Address 2 */}
            <div className="full-width">
              <label className="label">Address 2</label>
              <textarea
                name="address2"
                value={formData.address2}
                onChange={handleInputChange}
                placeholder="Enter address"
                className="textarea"
                rows="2"
              ></textarea>
            </div>

            {/* City */}
            <div>
              <label className="label">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="input"
              />
            </div>

            {/* Pin Code */}
            <div>
              <label className="label">Pin Code</label>
              <input
                type="text"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleInputChange}
                placeholder="Numeric Value"
                className="input"
              />
              {errors.pinCode && <p className="error">{errors.pinCode}</p>}
            </div>

            {/* Fax */}
            <div>
              <label className="label">Fax</label>
              <input
                type="text"
                name="fax"
                value={formData.fax}
                onChange={handleInputChange}
                className="input"
              />
            </div>

            {/* Email */}
            <div>
              <label className="label">Email ID</label>
              <input
                type="email"
                name="emailId"
                value={formData.emailId}
                onChange={handleInputChange}
                placeholder="xyz@gmail.com"
                className="input"
              />
              {errors.emailId && <p className="error">{errors.emailId}</p>}
            </div>

            {/* GST */}
            <div className="full-width">
              <label className="label">GST</label>
              <input
                type="text"
                name="gst"
                value={formData.gst}
                onChange={handleInputChange}
                className="input"
              />
            </div>
          </div>
          
          {/* Dynamic Button Group */}
          <div className="button-group">
            {/* SAVE Button */}
            <button 
                type="submit" 
                className={`btn-form ${!editing ? 'btn-save-mode' : 'btn-reset-mode'}`}
                disabled={!!editing}
            >
                Save
            </button>
            
            {/* RESET Button */}
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
      
    </div>
  );
};

export default ClassesGroupMaster;