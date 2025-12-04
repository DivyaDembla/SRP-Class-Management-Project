import React, { useState, useRef } from "react";
import "./IncomeEntryScreen.css";

const IncomeEntryScreen = () => {
  const [incomeCategory, setIncomeCategory] = useState("Student Fee");
  const [date, setDate] = useState("");
  const [studentName, setStudentName] = useState("");
  const [classSection, setClassSection] = useState("");
  const [feeType, setFeeType] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [physicalReceipt, setPhysicalReceipt] = useState("");
  const [remarks, setRemarks] = useState("");
  const [documentFile, setDocumentFile] = useState(null);
  const [incomeEntries, setIncomeEntries] = useState([]);
  const [errors, setErrors] = useState({});

  const fileInputRef = useRef(null);

  const handleSave = () => {
    const newErrors = {};

    if (!date) newErrors.date = "Date is required.";
    if (!amount) newErrors.amount = "Amount is required.";
    if (!paymentMode) newErrors.paymentMode = "Payment mode is required.";
    if (!documentFile) newErrors.documentFile = "Document upload is required.";

    // For Student Fee
    if (incomeCategory === "Student Fee") {
      if (!studentName) newErrors.studentName = "Student name is required.";
      if (!feeType) newErrors.feeType = "Fee type is required.";
    }

    // For Other Income
    if (incomeCategory === "Other Income") {
      if (!remarks) newErrors.remarks = "Remarks are required for Other Income.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const newEntry = {
      date,
      type: incomeCategory,
      student: studentName || "N/A",
      head: incomeCategory === "Other Income" ? remarks : "N/A",
      amount,
      paymentMode,
      physicalReceipt,
      remarks,
      voucher: "N/A",
    };

    setIncomeEntries([...incomeEntries, newEntry]);

    // Reset form
    setIncomeCategory("Student Fee");
    setDate("");
    setStudentName("");
    setClassSection("");
    setFeeType("");
    setAmount("");
    setPaymentMode("");
    setPhysicalReceipt("");
    setRemarks("");
    setDocumentFile(null);
    setErrors({});
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleDelete = (index) => {
    setIncomeEntries(incomeEntries.filter((_, i) => i !== index));
  };

  return (
    <div className="income-container">
      <div className="income-card">
        <h1 className="income-title">Income Entry Screen</h1>
        <hr className="income-divider" />

        {/* Income Details Form */}
        <div className="income-form">
          <div className="income-col">
            <div>
              <label className="income-label">Income Category:</label>
              <div className="income-radio-group">
                <label className="income-radio">
                  <input
                    type="radio"
                    name="incomeCategory"
                    value="Student Fee"
                    checked={incomeCategory === "Student Fee"}
                    onChange={() => setIncomeCategory("Student Fee")}
                  />
                  <span>Student Fee</span>
                </label>
                <label className="income-radio">
                  <input
                    type="radio"
                    name="incomeCategory"
                    value="Other Income"
                    checked={incomeCategory === "Other Income"}
                    onChange={() => setIncomeCategory("Other Income")}
                  />
                  <span>Other Income</span>
                </label>
              </div>
            </div>

            <div>
              <label className="income-label">Date:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="income-input"
              />
              {errors.date && <p className="error-text">{errors.date}</p>}
            </div>

            <div>
              <label className="income-label">Class & Section:</label>
              <input
                type="text"
                value={classSection}
                placeholder="-- Auto fetched --"
                disabled
                className="income-input disabled"
              />
            </div>

            <div>
              <label className="income-label">Amount:</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Numeric Value"
                className="income-input"
              />
              {errors.amount && <p className="error-text">{errors.amount}</p>}
            </div>

            <div>
              <label className="income-label">Payment Mode:</label>
              <input
                type="text"
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                placeholder="-- Drop DownList --"
                className="income-input"
              />
              {errors.paymentMode && (
                <p className="error-text">{errors.paymentMode}</p>
              )}
            </div>

            <div>
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
                  onChange={(e) => setDocumentFile(e.target.files[0])}
                  className="hidden"
                />
                <button onClick={handleUploadClick} className="btn-secondary">
                  Upload File
                </button>
                <button
                  onClick={() => setDocumentFile(null)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
              {errors.documentFile && (
                <p className="error-text">{errors.documentFile}</p>
              )}
            </div>
          </div>

          <div className="income-col">
            <div>
              <label className="income-label">Student Name:</label>
              <select
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="income-input"
              >
                <option value="">-- Drop Down From Student Master --</option>
                <option value="John Doe">John Doe</option>
                <option value="Jane Smith">Jane Smith</option>
              </select>
              {errors.studentName && (
                <p className="error-text">{errors.studentName}</p>
              )}
            </div>

            <div>
              <label className="income-label">Fee Type:</label>
              <select
                value={feeType}
                onChange={(e) => setFeeType(e.target.value)}
                className="income-input"
              >
                <option value="">-- Drop DownList --</option>
                <option value="Tuition Fee">Tuition Fee</option>
                <option value="Exam Fee">Exam Fee</option>
              </select>
              {errors.feeType && <p className="error-text">{errors.feeType}</p>}
            </div>

            <div>
              <label className="income-label">Physical Receipt No.</label>
              <input
                type="text"
                value={physicalReceipt}
                onChange={(e) => setPhysicalReceipt(e.target.value)}
                className="income-input"
              />
            </div>

            {incomeCategory === "Other Income" && (
              <div>
                <label className="income-label">Remarks:</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows="3"
                  className="income-input"
                ></textarea>
                {errors.remarks && (
                  <p className="error-text">{errors.remarks}</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="btn-group">
          <button onClick={handleSave} className="btn-primary">
            Save
          </button>
        </div>
      </div>

      {/* Table Section */}
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
                    <td>{entry.date}</td>
                    <td>{entry.type}</td>
                    <td>{entry.student}</td>
                    <td>{entry.head}</td>
                    <td>{entry.amount}</td>
                    <td>{entry.paymentMode}</td>
                    <td>{entry.physicalReceipt}</td>
                    <td>{entry.remarks}</td>
                    <td>{entry.voucher}</td>
                    <td>
                      <button className="edit-btn">✏️</button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(index)}
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

        {/* Export buttons */}
        <div className="btn-group">
          <button className="btn-primary">Export as PDF</button>
          <button className="btn-primary">Export as Excel</button>
        </div>
      </div>
    </div>
  );
};

export default IncomeEntryScreen;