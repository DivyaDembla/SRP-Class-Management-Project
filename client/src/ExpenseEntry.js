import React, { useState, useEffect } from "react";
import "./ExpenseEntry.css";
import axios from "axios";

const API = "http://localhost:5000/api/expenses";

const ExpenseEntryScreen = () => {
  const [formData, setFormData] = useState({
    id: null,
    date: "",
    expenseType: "",
    amount: "",
    paidTo: "",
    paymentMode: "",
    remarks: "",
    fileName: "",
  });

  const [file, setFile] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const EXPENSE_TYPES = [
    "Travel",
    "Office Supplies",
    "Utilities",
    "Salaries",
    "Rent",
  ];
  const PAYMENT_MODES = ["Bank Transfer", "Cash", "Credit Card", "Cheque"];

  // ---------------------------
  // Load all expenses on mount
  // ---------------------------
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get(API);
        setExpenses(res.data);
      } catch (err) {
        console.error("Error fetching expenses:", err);
      }
    };
    fetchExpenses();
  }, []);

  // ---------------------------
  // Validation
  // ---------------------------
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
        else if (isNaN(value) || Number(value) <= 0)
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFormData((prev) => ({ ...prev, amount: value }));
      setErrors((prev) => ({
        ...prev,
        amount: validateField("amount", value),
      }));
    }
  };

  const handleFileUpload = (e) => {
    const f = e.target.files[0];
    setFile(f);
    if (f) {
      setFormData((prev) => ({
        ...prev,
        fileName: `${f.name} (${(f.size / 1024).toFixed(1)} KB)`,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    ["date", "expenseType", "amount", "paidTo", "paymentMode"].forEach(
      (field) => {
        const err = validateField(field, formData[field]);
        if (err) newErrors[field] = err;
      }
    );
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------------------
  // Save or Update Expense
  // ---------------------------
  const handleSaveChanges = async () => {
    if (!validateForm()) return;

    const formToSend = new FormData();
    Object.keys(formData).forEach((key) =>
      formToSend.append(key, formData[key])
    );

    if (file) formToSend.append("documentFile", file);

    try {
      if (isEditing) {
        const res = await axios.put(`${API}/${formData.id}`, formToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setExpenses((prev) =>
          prev.map((exp) => (exp._id === res.data._id ? res.data : exp))
        );
      } else {
        const res = await axios.post(API, formToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setExpenses((prev) => [res.data, ...prev]);
      }

      handleResetChanges();
    } catch (err) {
      console.error("Error saving expense:", err);
      alert("❌ Error saving expense");
    }
  };

  const handleEdit = (expense) => {
    setFormData({
      id: expense._id,
      date: expense.date,
      expenseType: expense.expenseType,
      amount: String(expense.amount),
      paidTo: expense.paidTo,
      paymentMode: expense.paymentMode,
      remarks: expense.remarks,
      fileName: expense.fileName || "",
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      setExpenses((prev) => prev.filter((exp) => exp._id !== id));
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  const handleResetChanges = () => {
    setFormData({
      id: null,
      date: "",
      expenseType: "",
      amount: "",
      paidTo: "",
      paymentMode: "",
      remarks: "",
      fileName: "",
    });
    setFile(null);
    setErrors({});
    setIsEditing(false);
  };

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <div className="expense-container">
      <div className="expense-card">
        <h1 className="expense-title">Expense Entry</h1>

        {/* FORM */}
        <div className="expense-form">
          <div className="form-group">
            <label>Date:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={errors.date ? "error-border" : ""}
            />
            {errors.date && <p className="error-text">{errors.date}</p>}
          </div>

          <div className="form-group">
            <label>Expense Type:</label>
            <select
              name="expenseType"
              value={formData.expenseType}
              onChange={handleChange}
              className={errors.expenseType ? "error-border" : ""}
            >
              <option value="">-- Select --</option>
              {EXPENSE_TYPES.map((t) => (
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
              className={errors.amount ? "error-border" : ""}
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
              className={errors.paidTo ? "error-border" : ""}
            />
            {errors.paidTo && <p className="error-text">{errors.paidTo}</p>}
          </div>

          <div className="form-group">
            <label>Payment Mode:</label>
            <select
              name="paymentMode"
              value={formData.paymentMode}
              onChange={handleChange}
              className={errors.paymentMode ? "error-border" : ""}
            >
              <option value="">-- Select Mode --</option>
              {PAYMENT_MODES.map((m) => (
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
            <input type="file" onChange={handleFileUpload} />
            <p>{formData.fileName || "No file uploaded"}</p>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="button-group">
          <button onClick={handleSaveChanges} className="save-btn">
            {isEditing ? "Update Expense" : "Save Expense"}
          </button>
          <button onClick={handleResetChanges} className="reset-btn">
            Reset
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="expense-card">
        <h2 className="summary-title">Expense Summary</h2>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Paid To</th>
              <th>Mode</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {expenses.map((ex) => (
              <tr key={ex._id}>
                <td>{ex.date}</td>
                <td>{ex.expenseType}</td>
                <td>₹{ex.amount}</td>
                <td>{ex.paidTo}</td>
                <td>{ex.paymentMode}</td>
                <td>{ex.remarks}</td>
                <td>
                  <button onClick={() => handleEdit(ex)}>Edit</button>
                  <button onClick={() => handleDelete(ex._id)}>Delete</button>
                </td>
              </tr>
            ))}

            {expenses.length === 0 && (
              <tr>
                <td colSpan="7">No expenses recorded.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseEntryScreen;
