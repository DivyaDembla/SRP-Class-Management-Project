import React, { useState, useRef, useEffect } from "react";
import "./IncomeEntryScreen.css";
import axios from "axios";

const API = "http://localhost:5000/api/income-entries";
const STUDENT_API = "http://localhost:5000/api/students";

const IncomeEntryScreen = () => {
  const [incomeCategory, setIncomeCategory] = useState("Student Fee");
  const [date, setDate] = useState("");
  const [studentName, setStudentName] = useState("");
  const [fromName, setFromName] = useState("");
  const [feeType, setFeeType] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [physicalReceipt, setPhysicalReceipt] = useState("");
  const [remarks, setRemarks] = useState("");
  const [documentFile, setDocumentFile] = useState(null);
  const [incomeEntries, setIncomeEntries] = useState([]);
  const [errors, setErrors] = useState({});
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const classOptions = [...new Set(students.map((s) => s.className))];
  const sectionOptions = [
    ...new Set(
      students.filter((s) => s.className === className).map((s) => s.section),
    ),
  ];

  const fileInputRef = useRef(null);

  // -------------------------------
  // LIVE VALIDATION + ONBLUR LOGIC
  // -------------------------------
  const validateField = (field, value) => {
    let msg = "";

    if (field === "date" && !value) msg = "Date is required";
    if (field === "className" && !value) msg = "Class is required";
    if (field === "section" && !value) msg = "Section is required";

    if (field === "studentName" && !value && incomeCategory === "Student Fee")
      msg = "Student name is required";

    if (field === "amount" && !value) msg = "Amount is required";
    if (field === "paymentMode" && !value) msg = "Payment mode is required";
    if (field === "documentFile" && !value) msg = "Document upload is required";

    if (incomeCategory === "Other Income" && field === "remarks" && !value) {
      msg = "Remarks are required";
    }

    setErrors((prev) => ({
      ...prev,
      [field]: msg,
    }));
  };

  const resetForm = () => {
    setIncomeCategory("Student Fee");
    setDate("");
    setStudentName("");
    setFeeType("");
    setAmount("");
    setPaymentMode("");
    setPhysicalReceipt("");
    setRemarks("");
    setClassName("");
    setSection("");
    setDocumentFile(null);
    setErrors({});
  };

  const handleSave = async () => {
    const payload = {
      incomeCategory,
      date,
      studentName: incomeCategory === "Student Fee" ? studentName : fromName,
      className,
      section,
      feeType,
      amount: Number(amount),
      paymentMode,
      physicalReceipt,
      remarks,

      documentName: documentFile ? documentFile.name : "",
    };

    const newErrors = {};

    const requiredFields = ["date", "className", "section", "amount"];

    if (incomeCategory === "Student Fee") {
      requiredFields.push("studentName");
    }

    requiredFields.forEach((field) => {
      if (!payload[field]) {
        validateField(field, payload[field]);
        newErrors[field] = true;
      }
    });

    if (incomeCategory === "Other Income" && !remarks) {
      validateField("remarks", remarks);
      newErrors.remarks = true;
    }

    if (Object.keys(newErrors).length > 0) return;

    try {
      let res;

      if (editingId) {
        res = await axios.put(`${API}/${editingId}`, payload);

        setIncomeEntries((prev) =>
          prev.map((item) => (item._id === editingId ? res.data : item)),
        );

        setEditingId(null);
      } else {
        res = await axios.post(API, payload);

        const refreshed = await axios.get(API);
        setIncomeEntries(refreshed.data);
      }

      resetForm(); // reset form
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "An error occurred while saving the entry",
      );
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleEdit = (entry) => {
    setEditingId(entry._id);

    setIncomeCategory(entry.incomeCategory);
    setDate(entry.date.split("T")[0]);
    setStudentName(entry.studentName);
    setClassName(entry.className);
    setSection(entry.section);
    setAmount(entry.amount);
    setPaymentMode(entry.paymentMode);
    setPhysicalReceipt(entry.physicalReceipt);
    setRemarks(entry.remarks);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);

      setIncomeEntries((prev) => prev.filter((entry) => entry._id !== id));
    } catch (err) {
      alert("Failed to delete entry");
    }
  };

  useEffect(() => {
    // Load students
    axios.get(STUDENT_API).then((res) => {
      setStudents(res.data);
    });

    // Load saved income entries
    axios.get(API).then((res) => {
      setIncomeEntries(res.data);
    });
  }, []);

  return (
    <div className="income-container">
      <div className="income-card">
        <h1 className="income-title">Income Entry Screen</h1>
        <hr className="income-divider" />

        {/* Income Form */}
        <div className="income-form-grid">
          <div className="form-field">
            <label className="income-label">Income Category</label>

            <div className="income-radio-group">
              <label className="income-radio">
                <input
                  type="radio"
                  name="incomeCategory"
                  value="Student Fee"
                  checked={incomeCategory === "Student Fee"}
                  onChange={() => {
                    setIncomeCategory("Student Fee");
                    setErrors({});
                  }}
                />
                Student Fee
              </label>

              <label className="income-radio">
                <input
                  type="radio"
                  name="incomeCategory"
                  value="Other Income"
                  checked={incomeCategory === "Other Income"}
                  onChange={() => {
                    setIncomeCategory("Other Income");
                    setErrors({});
                  }}
                />
                Other Income
              </label>
            </div>
          </div>
          <div className="form-field">
            <label className="income-label">Date</label>

            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                validateField("date", e.target.value);
              }}
              onBlur={() => validateField("date", date)}
              className={`income-input ${errors.date ? "error-border" : ""}`}
            />
            {errors.date && <p className="error-text">{errors.date}</p>}
          </div>
          {incomeCategory === "Student Fee" && (
            <div className="form-field">
              <label className="income-label">Class</label>

              <select
                value={className}
                disabled={incomeCategory === "Other Income"}
                onChange={(e) => {
                  setClassName(e.target.value);
                  setSection("");
                  setStudentName("");
                }}
                onBlur={() => validateField("className", className)}
                className="income-input"
              >
                <option value="">Select Class</option>

                {classOptions.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
              {errors.className && (
                <p className="error-text">{errors.className}</p>
              )}
            </div>
          )}

          {incomeCategory === "Other Income" && (
            <div className="form-field">
              <label className="income-label">Name</label>

              <input
                type="text"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                className="income-input"
                placeholder="Enter source name"
              />
            </div>
          )}

          {incomeCategory === "Student Fee" && (
            <div className="form-field">
              <label className="income-label">Section</label>

              <select
                value={section}
                disabled={incomeCategory === "Other Income" || !className}
                onChange={(e) => {
                  setSection(e.target.value);
                  setStudentName("");
                }}
                onBlur={() => validateField("section", section)}
                className="income-input"
              >
                <option value="">Select Section</option>

                {sectionOptions.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
              {errors.section && <p className="error-text">{errors.section}</p>}
            </div>
          )}

          {incomeCategory === "Student Fee" && (
            <div className="form-field">
              <label className="income-label">Student Name</label>

              <select
                value={studentName}
                disabled={
                  incomeCategory === "Other Income" || !className || !section
                }
                onChange={(e) => {
                  setStudentName(e.target.value);
                  validateField("studentName", e.target.value);
                }}
                onBlur={() => validateField("studentName", studentName)}
                className={`income-input ${errors.studentName ? "error-border" : ""}`}
              >
                <option value="">Select Student</option>

                {students
                  .filter(
                    (student) =>
                      student.className === className &&
                      student.section === section,
                  )
                  .map((student) => (
                    <option key={student._id} value={student.fullName}>
                      {student.fullName}
                    </option>
                  ))}
              </select>
              {errors.studentName && (
                <p className="error-text">{errors.studentName}</p>
              )}
            </div>
          )}

          <div className="form-field">
            <label className="income-label">Amount</label>

            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => {
                const value = parseInt(e.target.value) || "";
                setAmount(value);
                validateField("amount", value);
              }}
              onBlur={() => validateField("amount", amount)}
              className={`income-input ${errors.amount ? "error-border" : ""}`}
            />
          </div>
          <div className="form-field">
            <label className="income-label">Physical Receipt No.</label>
            <input
              type="text"
              value={physicalReceipt}
              onChange={(e) => setPhysicalReceipt(e.target.value)}
              className="income-input"
            />
            {errors.physicalReceipt && (
              <p className="error-text">{errors.physicalReceipt}</p>
            )}
          </div>
          <div className="form-field">
            <label className="income-label">Payment Mode</label>

            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              onBlur={() => validateField("paymentMode", paymentMode)}
              className={`income-input ${errors.paymentMode ? "error-border" : ""}`}
            >
              <option value="">Select Mode</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>

            {errors.paymentMode && (
              <p className="error-text">{errors.paymentMode}</p>
            )}
          </div>
          <div className="form-field">
            <label className="income-label">Document Upload</label>
            <div className="income-upload-info">
              <span>{documentFile ? documentFile.name : "File Name"}</span>
              <span>
                {documentFile
                  ? documentFile.size > 1024
                    ? `${(documentFile.size / 1024).toFixed(2)} KB`
                    : `${documentFile.size} Bytes`
                  : "Size"}
              </span>
            </div>

            <div className="income-upload-btns">
              <input
                ref={fileInputRef}
                type="file"
                onChange={(e) => {
                  setDocumentFile(e.target.files[0]);
                  validateField("documentFile", e.target.files[0]);
                }}
                className="hidden"
              />

              <button
                onClick={handleUploadClick}
                className={`btn-secondary ${
                  errors.documentFile ? "error-border" : ""
                }`}
              >
                Upload File
              </button>

              <button
                onClick={() => {
                  setDocumentFile(null);
                  validateField("documentFile", null);
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>

            {errors.documentFile && (
              <p className="error-text">{errors.documentFile}</p>
            )}
          </div>
          <div className="form-field">
            <label className="income-label">Remarks</label>

            <textarea
              value={remarks}
              onChange={(e) => {
                setRemarks(e.target.value);
                validateField("remarks", e.target.value);
              }}
              onBlur={() => validateField("remarks", remarks)}
              rows="2"
              className={`income-input ${errors.remarks ? "error-border" : ""}`}
            />

            {errors.remarks && <p className="error-text">{errors.remarks}</p>}
          </div>
        </div>
      </div>

      <div className="btn-group">
        <button onClick={handleSave} className="btn-primary">
          Save
        </button>
      </div>

      <div className="income-card">
        <h2 className="income-subtitle">Income Summary Grid</h2>

        <div className="table-wrapper">
          <table className="income-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Student/From</th>
                <th>Head (if other)</th>
                <th>Amount</th>
                <th>Payment Mode</th>
                <th>Physical Receipt No.</th>
                <th>Remarks</th>
                <th>Voucher</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody>
              {incomeEntries.length > 0 ? (
                incomeEntries.map((entry, index) => (
                  <tr key={index}>
                    <td>{new Date(entry.date).toLocaleDateString()}</td>
                    <td>{entry.incomeCategory}</td>
                    <td>{entry.studentName}</td>
                    <td>
                      {entry.incomeCategory === "Other Income"
                        ? entry.remarks
                        : "-"}
                    </td>
                    <td>{entry.amount}</td>
                    <td>{entry.paymentMode}</td>
                    <td>{entry.physicalReceipt}</td>
                    <td>{entry.remarks}</td>
                    <td>{entry.documentName}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(entry)}
                        className="edit-btn"
                      >
                        ✏️
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(entry._id)}
                        className="delete-btn"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="no-data">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="btn-group">
          <button className="btn-primary">Export as PDF</button>
          <button className="btn-primary">Export as Excel</button>
        </div>
      </div>
    </div>
  );
};

export default IncomeEntryScreen;
