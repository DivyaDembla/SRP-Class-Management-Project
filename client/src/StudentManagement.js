import React, { useState } from "react";
import CollapsibleCard from "./CollapsibleCard";
import StudentListScreen from "./StudentListScreen";
import "./StudentManagement.css";

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

  // Validate all fields live
  const validate = () => {
  const newErrors = {};
  const nameRegex = /^[A-Za-z\s]+$/;
  const mobileRegex = /^[0-9]{10}$/;

  // Get today's date in YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  // Calculate 6 days before today
  const sixDaysAgo = new Date();
  sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
  const sixDaysAgoStr = sixDaysAgo.toISOString().split("T")[0];

  // Full Name
  if (!fullName.trim()) newErrors.fullName = "Full name is required";
  else if (!nameRegex.test(fullName)) newErrors.fullName = "Only letters allowed";

  // Mobile
  if (!mobile.trim()) newErrors.mobile = "Mobile number is required";
  else if (!mobileRegex.test(mobile)) newErrors.mobile = "Must be 10 digits";

  if (altMobile && !mobileRegex.test(altMobile))
    newErrors.altMobile = "Alternate must be 10 digits";

  // Gender
  if (!gender) newErrors.gender = "Please select gender";

  // Address
  if (!address.trim()) newErrors.address = "Address cannot be empty";

  // DOB
  if (!dob) newErrors.dob = "Select Date of Birth";
  else if (dob > today) newErrors.dob = "DOB cannot be in future";

  // --- ADMISSION DATE VALIDATION (your requirement) ---
  if (!admissionDate) {
    newErrors.admissionDate = "Select Admission Date";
  } else if (admissionDate < sixDaysAgoStr || admissionDate > today) {
    newErrors.admissionDate =
      "Admission date must be between today and the last 6 days";
  }

  // Class & Section
  if (!className) newErrors.className = "Select class";
  if (!section) newErrors.section = "Select section";

  // Fee
  if (!fee) newErrors.fee = "Enter fee amount";
  else if (fee <= 0) newErrors.fee = "Fee must be positive";

  if (!feeOption) newErrors.feeOption = "Select fee option";

  // --- AADHAR VALIDATION (your requirement) ---
  if (!documentNumber) {
    newErrors.documentNumber = "Aadhar is required";
  } else if (!/^[0-9]{12}$/.test(documentNumber)) {
    newErrors.documentNumber = "Aadhar must be 12 digits";
  } else if (/^[01]/.test(documentNumber)) {
    newErrors.documentNumber = "Aadhar cannot start with 0 or 1";
  }

  // Document & Photo
  if (!documentFile) newErrors.documentFile = "Upload document";
  if (!studentPhoto) newErrors.studentPhoto = "Upload student photo";

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  const handleSave = () => {
    if (!validate()) return;

    const rollNumber = nextRollNumber;

    const newStudent = {
      rollNumber,
      fullName,
      mobile,
      altMobile,
      address,
      dob,
      admissionDate,
      gender,
      className,
      section,
      batch: `${className} - ${section}`,
      fee,
      feeOption,
      documentNumber,
      documentFile,
      studentPhoto,
      status: "Active",
    };

    setStudents((prev) => [...prev, newStudent]);
    handleReset();
  };

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
          <div>
            <label>Roll Number</label>
            <input type="text" value={nextRollNumber} disabled />
          </div>

          <div>
            <label>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onBlur={validate}
            />
            {errors.fullName && <span className="error">{errors.fullName}</span>}
          </div>

          <div>
            <label>Mobile Number</label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              onBlur={validate}
            />
            {errors.mobile && <span className="error">{errors.mobile}</span>}
          </div>

          <div>
            <label>Alternate Contact</label>
            <input
              type="tel"
              value={altMobile}
              onChange={(e) => setAltMobile(e.target.value)}
              onBlur={validate}
            />
            {errors.altMobile && <span className="error">{errors.altMobile}</span>}
          </div>

          <div>
            <label>Gender</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} onBlur={validate}>
              <option hidden>Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            {errors.gender && <span className="error">{errors.gender}</span>}
          </div>

          <div>
            <label>Address</label>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} onBlur={validate} rows="2" />
            {errors.address && <span className="error">{errors.address}</span>}
          </div>

          <div>
            <label>Date of Birth</label>
            <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} onBlur={validate} />
            {errors.dob && <span className="error">{errors.dob}</span>}
          </div>

          <div>
            <label>Date of Admission</label>
            <input
              type="date"
              value={admissionDate}
              onChange={(e) => setAdmissionDate(e.target.value)}
              onBlur={validate}
            />
            {errors.admissionDate && <span className="error">{errors.admissionDate}</span>}
          </div>

          <div>
            <label>Class</label>
            <select value={className} onChange={(e) => setClassName(e.target.value)} onBlur={validate}>
              <option hidden>Select Class</option>
              <option>Class 10</option>
              <option>Class 11</option>
              <option>Class 12</option>
            </select>
            {errors.className && <span className="error">{errors.className}</span>}
          </div>

          <div>
            <label>Section</label>
            <select value={section} onChange={(e) => setSection(e.target.value)} onBlur={validate}>
              <option hidden>Select Section</option>
              <option>A</option>
              <option>B</option>
              <option>C</option>
              <option>D</option>
            </select>
            {errors.section && <span className="error">{errors.section}</span>}
          </div>

          <div>
            <label>Fee Amount</label>
            <input type="number" value={fee} onChange={(e) => setFee(e.target.value)} onBlur={validate} />
            {errors.fee && <span className="error">{errors.fee}</span>}
          </div>

          <div>
            <label>Fee Option</label>
            <select value={feeOption} onChange={(e) => setFeeOption(e.target.value)} onBlur={validate}>
              <option hidden>Select Fee Option</option>
              <option>Monthly</option>
              <option>Quarterly</option>
              <option>Yearly</option>
            </select>
            {errors.feeOption && <span className="error">{errors.feeOption}</span>}
          </div>
        </div>
      </CollapsibleCard>

      <CollapsibleCard title="Document Details" defaultOpen={false}>
        <div className="form-group">
          <div>
            <label>Aadhar Number</label>
            <input type="text" value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} onBlur={validate} />
            {errors.documentNumber && <span className="error">{errors.documentNumber}</span>}
          </div>

          <div>
            <label>Document Upload</label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => {
                const file = e.target.files[0];
                setDocumentFile(file);
                if (!file) return;
                setDocumentPreview(file.type === "application/pdf" ? "PDF" : URL.createObjectURL(file));
              }}
              onBlur={validate}
            />
            {errors.documentFile && <span className="error">{errors.documentFile}</span>}
            {documentPreview === "PDF" ? (
              <a href={URL.createObjectURL(documentFile)} target="_blank" rel="noreferrer" className="pdf-link">
                📄 View Document
              </a>
            ) : (
              documentPreview && <img src={documentPreview} className="photo-preview" alt="Document" />
            )}
          </div>

          <div>
            <label>Student Photo</label>
            <input type="file" accept="image/*" onChange={(e) => setStudentPhoto(URL.createObjectURL(e.target.files[0]))} onBlur={validate} />
            {errors.studentPhoto && <span className="error">{errors.studentPhoto}</span>}
            {studentPhoto && <img src={studentPhoto} className="photo-preview" alt="Preview" />}
          </div>

          <div className="button-group">
            <button onClick={handleSave} className="btn-save">Save</button>
            <button onClick={handleReset} className="btn-reset">Reset</button>
          </div>
        </div>
      </CollapsibleCard>

      <StudentListScreen students={students} setStudents={setStudents} />
    </div>
  );
};

export default StudentManagement;
