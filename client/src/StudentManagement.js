import React, { useState, useEffect } from "react";
import CollapsibleCard from "./CollapsibleCard";
import StudentListScreen from "./StudentListScreen";
import "./StudentManagement.css";
import axios from "axios";

const API = "http://localhost:5000/api/students";

const StudentManagement = () => {
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [altMobile, setAltMobile] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [admissionDate, setAdmissionDate] = useState("");
  const [gender, setGender] = useState("");
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [fee, setFee] = useState("");
  const [feeOption, setFeeOption] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [documentFile, setDocumentFile] = useState(null);
  const [documentPreview, setDocumentPreview] = useState(null);
  const [studentPhoto, setStudentPhoto] = useState(null);

  const [students, setStudents] = useState([]);

  // Error state for on-page validations
  const [errors, setErrors] = useState({});

  const nextRollNumber = (students.length + 1).toString().padStart(2, "0");

  useEffect(() => {
    axios.get(API).then((res) => setStudents(res.data));
  }, []);

  // ---------------- FIELD-WISE VALIDATION ----------------
  const validateField = (field, value) => {
    let message = "";

    const nameRegex = /^[A-Za-z\s]+$/;
    const mobileRegex = /^[0-9]{10}$/;

    const today = new Date().toISOString().split("T")[0];
    const sixDaysAgo = new Date();
    sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
    const sixDaysAgoStr = sixDaysAgo.toISOString().split("T")[0];

    switch (field) {
      case "fullName":
        if (!value.trim()) message = "Full name is required";
        else if (!nameRegex.test(value)) message = "Only letters allowed";
        break;

      case "mobile":
        if (!value.trim()) message = "Mobile number is required";
        else if (!mobileRegex.test(value)) message = "Must be 10 digits";
        break;

      case "altMobile":
        if (value && !mobileRegex.test(value))
          message = "Alternate must be 10 digits";
        break;

      case "gender":
        if (!value) message = "Please select gender";
        break;

      case "address":
        if (!value.trim()) message = "Address cannot be empty";
        break;

      case "dob":
        if (!value) message = "Select Date of Birth";
        else if (value > today) message = "DOB cannot be in future";
        break;

      case "admissionDate":
        if (!value) message = "Select Admission Date";
        else if (value < sixDaysAgoStr || value > today)
          message = "Admission must be within last 6 days";
        break;

      case "className":
        if (!value) message = "Select class";
        break;

      case "section":
        if (!value) message = "Select section";
        break;

      case "fee":
        if (!value) message = "Enter fee amount";
        else if (value <= 0) message = "Fee must be positive";
        break;

      case "feeOption":
        if (!value) message = "Select fee option";
        break;

      case "documentNumber":
        if (!value) message = "Aadhar is required";
        else if (!/^[0-9]{12}$/.test(value))
          message = "Aadhar must be 12 digits";
        else if (/^[01]/.test(value))
          message = "Aadhar cannot start with 0 or 1";
        break;

      case "documentFile":
        if (!value) message = "Upload document";
        break;

      case "studentPhoto":
        if (!value) message = "Upload student photo";
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  // ---------------- FULL FORM VALIDATION ON SAVE ----------------
  const validate = () => {
    const newErrors = {};

    const nameRegex = /^[A-Za-z\s]+$/;
    const mobileRegex = /^[0-9]{10}$/;

    const today = new Date().toISOString().split("T")[0];
    const sixDaysAgo = new Date();
    sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
    const sixDaysAgoStr = sixDaysAgo.toISOString().split("T")[0];

    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    else if (!nameRegex.test(fullName))
      newErrors.fullName = "Only letters allowed";

    if (!mobile.trim()) newErrors.mobile = "Mobile number is required";
    else if (!mobileRegex.test(mobile)) newErrors.mobile = "Must be 10 digits";

    if (altMobile && !mobileRegex.test(altMobile))
      newErrors.altMobile = "Alternate must be 10 digits";

    if (!gender) newErrors.gender = "Please select gender";

    if (!address.trim()) newErrors.address = "Address cannot be empty";

    if (!dob) newErrors.dob = "Select Date of Birth";
    else if (dob > today) newErrors.dob = "DOB cannot be future";

    if (!admissionDate) newErrors.admissionDate = "Select Admission Date";
    else if (admissionDate < sixDaysAgoStr || admissionDate > today)
      newErrors.admissionDate =
        "Admission date must be between today and last 6 days";

    if (!className) newErrors.className = "Select class";
    if (!section) newErrors.section = "Select section";

    if (!fee) newErrors.fee = "Enter fee amount";
    else if (fee <= 0) newErrors.fee = "Fee must be positive";

    if (!feeOption) newErrors.feeOption = "Select fee option";

    if (!documentNumber) newErrors.documentNumber = "Aadhar is required";
    else if (!/^[0-9]{12}$/.test(documentNumber))
      newErrors.documentNumber = "Aadhar must be 12 digits";
    else if (/^[01]/.test(documentNumber))
      newErrors.documentNumber = "Aadhar cannot start with 0 or 1";

    if (!documentFile) newErrors.documentFile = "Upload document";
    if (!studentPhoto) newErrors.studentPhoto = "Upload student photo";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------- SAVE FUNCTION ----------------
  const handleSave = async () => {
    if (!validate()) return;

    const rollNumber = nextRollNumber;

    const formData = new FormData();
    formData.append("rollNumber", rollNumber);
    formData.append("fullName", fullName);
    formData.append("mobile", mobile);
    formData.append("altMobile", altMobile);
    formData.append("address", address);
    formData.append("dob", dob);
    formData.append("admissionDate", admissionDate);
    formData.append("gender", gender);
    formData.append("className", className);
    formData.append("section", section);
    formData.append("batch", `${className} - ${section}`);
    formData.append("fee", fee);
    formData.append("feeOption", feeOption);
    formData.append("documentNumber", documentNumber);

    // files
    formData.append("documentFile", documentFile);
    formData.append("studentPhoto", studentPhoto);

    const res = await axios.post(API, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setStudents((prev) => [...prev, res.data]);
    handleReset();
  };

  // ---------------- RESET FUNCTION ----------------
  const handleReset = () => {
    setFullName("");
    setMobile("");
    setAltMobile("");
    setAddress("");
    setDob("");
    setAdmissionDate("");
    setGender("");
    setClassName("");
    setSection("");
    setFee("");
    setFeeOption("");
    setDocumentNumber("");
    setDocumentFile(null);
    setDocumentPreview(null);
    setStudentPhoto(null);
    setErrors({});
  };

  return (
    <div className="student-content">
      <CollapsibleCard title="Student Management Form" defaultOpen={false}>
        <div className="form-group">
          {/* Roll Number */}
          <div>
            <label>Roll Number</label>
            <input type="text" value={nextRollNumber} disabled />
          </div>

          {/* Full Name */}
          <div>
            <label>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onBlur={() => validateField("fullName", fullName)}
            />
            {errors.fullName && (
              <span className="error">{errors.fullName}</span>
            )}
          </div>

          {/* Mobile */}
          <div>
            <label>Mobile Number</label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              onBlur={() => validateField("mobile", mobile)}
            />
            {errors.mobile && <span className="error">{errors.mobile}</span>}
          </div>

          {/* Alternate Mobile */}
          <div>
            <label>Alternate Contact</label>
            <input
              type="tel"
              value={altMobile}
              onChange={(e) => setAltMobile(e.target.value)}
              onBlur={() => validateField("altMobile", altMobile)}
            />
            {errors.altMobile && (
              <span className="error">{errors.altMobile}</span>
            )}
          </div>

          {/* Gender */}
          <div>
            <label>Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              onBlur={() => validateField("gender", gender)}
            >
              <option hidden>Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            {errors.gender && <span className="error">{errors.gender}</span>}
          </div>

          {/* Address */}
          <div>
            <label>Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows="2"
              onBlur={() => validateField("address", address)}
            />
            {errors.address && <span className="error">{errors.address}</span>}
          </div>

          {/* DOB */}
          <div>
            <label>Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              onBlur={() => validateField("dob", dob)}
            />
            {errors.dob && <span className="error">{errors.dob}</span>}
          </div>

          {/* Admission Date */}
          <div>
            <label>Date of Admission</label>
            <input
              type="date"
              value={admissionDate}
              onChange={(e) => setAdmissionDate(e.target.value)}
              onBlur={() => validateField("admissionDate", admissionDate)}
            />
            {errors.admissionDate && (
              <span className="error">{errors.admissionDate}</span>
            )}
          </div>

          {/* Class */}
          <div>
            <label>Class</label>
            <select
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              onBlur={() => validateField("className", className)}
            >
              <option hidden>Select Class</option>
              <option>Class 10</option>
              <option>Class 11</option>
              <option>Class 12</option>
            </select>
            {errors.className && (
              <span className="error">{errors.className}</span>
            )}
          </div>

          {/* Section */}
          <div>
            <label>Section</label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              onBlur={() => validateField("section", section)}
            >
              <option hidden>Select Section</option>
              <option>A</option>
              <option>B</option>
              <option>C</option>
              <option>D</option>
            </select>
            {errors.section && <span className="error">{errors.section}</span>}
          </div>

          {/* Fee */}
          <div>
            <label>Fee Amount</label>
            <input
              type="number"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              onBlur={() => validateField("fee", fee)}
            />
            {errors.fee && <span className="error">{errors.fee}</span>}
          </div>

          {/* Fee Option */}
          <div>
            <label>Fee Option</label>
            <select
              value={feeOption}
              onChange={(e) => setFeeOption(e.target.value)}
              onBlur={() => validateField("feeOption", feeOption)}
            >
              <option hidden>Select Fee Option</option>
              <option>Monthly</option>
              <option>Quarterly</option>
              <option>Yearly</option>
            </select>
            {errors.feeOption && (
              <span className="error">{errors.feeOption}</span>
            )}
          </div>
        </div>
      </CollapsibleCard>

      {/* ---------------- DOCUMENT SECTION ---------------- */}
      <CollapsibleCard title="Document Details" defaultOpen={false}>
        <div className="form-group">
          <div>
            <label>Aadhar Number</label>
            <input
              type="text"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              onBlur={() => validateField("documentNumber", documentNumber)}
            />
            {errors.documentNumber && (
              <span className="error">{errors.documentNumber}</span>
            )}
          </div>

          {/* Document Upload */}
          <div>
            <label>Document Upload</label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => {
                const file = e.target.files[0];
                setDocumentFile(file);
                validateField("documentFile", file);

                if (!file) return;

                setDocumentPreview(
                  file.type === "application/pdf"
                    ? "PDF"
                    : URL.createObjectURL(file)
                );
              }}
            />
            {errors.documentFile && (
              <span className="error">{errors.documentFile}</span>
            )}

            {documentPreview === "PDF" ? (
              <a
                href={URL.createObjectURL(documentFile)}
                target="_blank"
                rel="noreferrer"
                className="pdf-link"
              >
                📄 View Document
              </a>
            ) : (
              documentPreview && (
                <img
                  src={documentPreview}
                  className="photo-preview"
                  alt="Document"
                />
              )
            )}
          </div>

          {/* Student Photo */}
          <div>
            <label>Student Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                const preview = URL.createObjectURL(file);
                setStudentPhoto(preview);
                validateField("studentPhoto", preview);
              }}
            />
            {errors.studentPhoto && (
              <span className="error">{errors.studentPhoto}</span>
            )}

            {studentPhoto && (
              <img src={studentPhoto} className="photo-preview" alt="Preview" />
            )}
          </div>

          {/* Buttons */}
          <div className="button-group">
            <button onClick={handleSave} className="btn-save">
              Save
            </button>
            <button onClick={handleReset} className="btn-reset">
              Reset
            </button>
          </div>
        </div>
      </CollapsibleCard>

      <StudentListScreen students={students} setStudents={setStudents} />
    </div>
  );
};

export default StudentManagement;
