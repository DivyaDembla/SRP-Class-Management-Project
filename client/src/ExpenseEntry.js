import React, { useState } from "react";
import "./ExpenseEntry.css";

// --- Inline SVG Icons ---
const EditIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);
const DeleteIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);
const FileIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
    <polyline points="13 2 13 9 20 9"></polyline>
  </svg>
);

// --- Mock Data ---
const MOCK_EXPENSE_TYPES = [
  "Travel",
  "Office Supplies",
  "Utilities",
  "Salaries",
  "Rent",
];
const MOCK_PAYMENT_MODES = ["Bank Transfer", "Cash", "Credit Card", "Cheque"];

const INITIAL_EXPENSES = [
  {
    id: 1,
    date: "2025-10-20",
    type: "Rent",
    amount: 35000,
    paidTo: "Landlord Co.",
    mode: "Bank Transfer",
    remarks: "Office space rent for October.",
  },
  {
    id: 2,
    date: "2025-10-21",
    type: "Travel",
    amount: 450,
    paidTo: "Uber",
    mode: "Credit Card",
    remarks: "Client visit transportation.",
  },
  {
    id: 3,
    date: "2025-10-22",
    type: "Office Supplies",
    amount: 1200,
    paidTo: "Staples",
    mode: "Cash",
    remarks: "New stationery and printer ink.",
  },
];

const initialFormState = {
  id: null,
  date: "",
  expenseType: "",
  amount: "",
  paidTo: "",
  paymentMode: "",
  remarks: "",
  fileName: "",
};

const ExpenseEntryScreen = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [isEditing, setIsEditing] = useState(false);

  // ⭐ ADDED: inline validation errors
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({ ...prev, [name]: value }));

  // LIVE validation for each field
  const errorMsg = validateField(name, value);
  setErrors((prev) => ({ ...prev, [name]: errorMsg }));
};

  const handleAmountChange = (e) => {
  const { name, value } = e.target;

  if (value === "" || /^\d*\.?\d*$/.test(value)) {
    setFormData((prev) => ({ ...prev, amount: value }));

    const errorMsg = validateField("amount", value);
    setErrors((prev) => ({ ...prev, amount: errorMsg }));
  }
};

  const handleResetChanges = () => {
    setFormData(initialFormState);
    setIsEditing(false);
    setErrors({}); // ⭐ clear errors
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        fileName: `${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
      }));
    }
  };

  const handleDeleteFile = () =>
    setFormData((prev) => ({ ...prev, fileName: "" }));
  const validateField = (name, value) => {
  let msg = "";

  switch (name) {
    case "date":
      if (!value) msg = "Date is required";
      break;

    case "expenseType":
      if (!value) msg = "Expense type is required";
      break;

    case "amount":
      if (!value) msg = "Amount is required";
      else if (isNaN(value) || parseFloat(value) <= 0)
        msg = "Enter a valid amount";
      break;

    case "paidTo":
      if (!value.trim()) msg = "Paid To is required";
      break;

    case "paymentMode":
      if (!value) msg = "Payment mode is required";
      break;

    default:
      break;
  }

  return msg;
};


  // ⭐ NEW INLINE VALIDATION
  const validateForm = () => {
    let newErrors = {};

    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.expenseType)
      newErrors.expenseType = "Expense type is required";
    if (!formData.amount) newErrors.amount = "Amount is required";
    else if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0)
      newErrors.amount = "Enter a valid amount";
    if (!formData.paidTo) newErrors.paidTo = "Paid To is required";
    if (!formData.paymentMode)
      newErrors.paymentMode = "Payment mode is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChanges = () => {
    if (!validateForm()) return; // ❌ stop save if errors

    const newExpense = { ...formData, amount: parseFloat(formData.amount) };

    if (isEditing) {
      setExpenses((prev) =>
        prev.map((exp) => (exp.id === newExpense.id ? newExpense : exp))
      );
    } else {
      newExpense.id = Date.now();
      setExpenses((prev) => [newExpense, ...prev]);
    }

    setFormData(initialFormState);
    setIsEditing(false);
    setErrors({});
  };

  const handleEdit = (expense) => {
    setFormData({ ...expense, amount: String(expense.amount) });
    setIsEditing(true);
  };

  const handleDelete = (id) =>
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));

  const handleExport = (type) => console.log("Export:", type);

  return (
    <div className="expense-container">
      <div className="expense-card">
        <h1 className="expense-title">Expense Entry</h1>

        <div className="expense-form">
          <div className="form-group">
            <label>Date:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
            {errors.date && <p className="error-text">{errors.date}</p>}
          </div>

          <div className="form-group">
            <label>Expense Type:</label>
            <select
              name="expenseType"
              value={formData.expenseType}
              onChange={handleChange}
            >
              <option value="">-- Select --</option>
              {MOCK_EXPENSE_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            {errors.expenseType && (
              <p className="error-text">{errors.expenseType}</p>
            )}
          </div>

          <div className="form-group">
            <label>Amount:</label>
            <input
              type="text"
              name="amount"
              placeholder="Numeric Value"
              value={formData.amount}
              onChange={handleAmountChange}
            />
            {errors.amount && <p className="error-text">{errors.amount}</p>}
          </div>

          <div className="form-group">
            <label>Paid To:</label>
            <input
              type="text"
              name="paidTo"
              value={formData.paidTo}
              onChange={handleChange}
            />
            {errors.paidTo && <p className="error-text">{errors.paidTo}</p>}
          </div>

          <div className="form-group">
            <label>Payment Mode:</label>
            <select
              name="paymentMode"
              value={formData.paymentMode}
              onChange={handleChange}
            >
              <option value="">-- Select Mode --</option>
              {MOCK_PAYMENT_MODES.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
            {errors.paymentMode && (
              <p className="error-text">{errors.paymentMode}</p>
            )}
          </div>

          <div className="form-group full-width">
            <label>Remarks:</label>
            <textarea
              name="remarks"
              rows="4"
              value={formData.remarks}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-group">
            <label>Document Upload:</label>
            <div className="file-upload">
              <input
                type="file"
                id="fileUpload"
                className="hidden"
                onChange={handleFileUpload}
              />
              <span>{formData.fileName || "File Name (Size)"}</span>
              <button
                onClick={
                  formData.fileName
                    ? handleDeleteFile
                    : () => document.getElementById("fileUpload").click()
                }
                className={formData.fileName ? "delete-btn" : "upload-btn"}
              >
                {formData.fileName ? "Cancel" : "Upload Files"}
              </button>
            </div>
          </div>
        </div>

        <div className="button-group">
          <button
            onClick={handleSaveChanges}
            className={isEditing ? "update-btn" : "save-btn"}
          >
            {isEditing ? "Update Changes" : "Save Changes"}
          </button>
          <button onClick={handleResetChanges} className="reset-btn">
            Reset Changes
          </button>
        </div>
      </div>

      <div className="expense-card">
        <h2 className="summary-title">Expense Summary</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Paid To</th>
                <th>Mode</th>
                <th>Remarks</th>
                <th colSpan="3">Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length ? (
                expenses.map((item) => (
                  <tr key={item.id}>
                    <td>{item.date}</td>
                    <td>{item.type}</td>
                    <td>₹{item.amount.toFixed(2)}</td>
                    <td>{item.paidTo}</td>
                    <td>{item.mode}</td>
                    <td>{item.remarks}</td>
                    <td>
                      <button onClick={() => handleEdit(item)}>
                        <EditIcon />
                      </button>
                    </td>
                    <td>
                      <button onClick={() => handleDelete(item.id)}>
                        <DeleteIcon />
                      </button>
                    </td>
                    <td>
                      <button onClick={() => console.log("Preview Bill")}>
                        <FileIcon />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9">No expenses recorded.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="export-buttons">
          <button onClick={() => handleExport("PDF")}>Export as PDF</button>
          <button onClick={() => handleExport("Excel")}>Export as Excel</button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseEntryScreen;
