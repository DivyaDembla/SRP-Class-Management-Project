import React, { useState, useEffect } from "react";
import axios from "axios";
import CollapsibleCard from "./CollapsibleCard";
import "./ExpenseMaster.css";

const API = "http://localhost:5000/api/expense-master";

const ExpenseMaster = () => {
  const [formData, setFormData] = useState({
    expenseType: "",
    expenseDescription: "",
    status: "Active",
  });

  const [errors, setErrors] = useState({
    expenseType: "",
    expenseDescription: "",
  });

  const [expenseList, setExpenseList] = useState([]);

  /* ---------------- FETCH EXPENSES ---------------- */
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(API);
      setExpenseList(res.data);
    } catch (err) {
      console.error("Error fetching expenses", err);
    }
  };

  /* ---------------- INPUT HANDLER ---------------- */
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /* ---------------- VALIDATION ---------------- */
  const validateForm = () => {
    let newErrors = {};

    if (!formData.expenseType.trim()) {
      newErrors.expenseType = "Expense Type is required";
    }

    if (!formData.expenseDescription.trim()) {
      newErrors.expenseDescription = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- SAVE EXPENSE ---------------- */
  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const res = await axios.post(API, formData);

      setExpenseList((prev) => [res.data, ...prev]);

      setFormData({
        expenseType: "",
        expenseDescription: "",
        status: "Active",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to save expense");
    }
  };

  /* ---------------- RESET ---------------- */
  const handleReset = () => {
    setFormData({
      expenseType: "",
      expenseDescription: "",
      status: "Active",
    });
    setErrors({});
  };

  /* ---------------- TOGGLE STATUS ---------------- */
  const handleStatusToggle = async (id) => {
    try {
      const res = await axios.put(`${API}/${id}/toggle-status`);

      setExpenseList((prev) =>
        prev.map((item) => (item._id === id ? res.data : item))
      );
    } catch (err) {
      console.error("Toggle error", err);
    }
  };

  return (
    <div className="expense-master-content">
      <CollapsibleCard title="Expense Master" defaultOpen={false}>
        <form>
          <div className="form-grid">
            <div>
              <label>Expense Type</label>
              <input
                type="text"
                name="expenseType"
                value={formData.expenseType}
                onChange={handleInputChange}
              />
              {errors.expenseType && (
                <p className="error-text">{errors.expenseType}</p>
              )}
            </div>

            <div>
              <label>Expense Description</label>
              <textarea
                name="expenseDescription"
                value={formData.expenseDescription}
                onChange={handleInputChange}
                rows="1"
              />
              {errors.expenseDescription && (
                <p className="error-text">{errors.expenseDescription}</p>
              )}
            </div>

            <div>
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="button-group">
            <button type="button" onClick={handleSave} className="btn-save">
              Save Changes
            </button>
            <button type="button" onClick={handleReset} className="btn-reset">
              Reset Changes
            </button>
          </div>
        </form>
      </CollapsibleCard>

      {/* ---------------- LIST ---------------- */}
      <div className="list-card">
        <h2>Expense Type List Grid</h2>
        <hr />

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Expense Type</th>
                <th>Description</th>
                <th>Status</th>
                <th>Edit</th>
                <th>Activate / Deactivate</th>
              </tr>
            </thead>

            <tbody>
              {expenseList.length > 0 ? (
                expenseList.map((expense) => (
                  <tr key={expense._id}>
                    <td>{expense.expenseType}</td>
                    <td>{expense.expenseDescription}</td>
                    <td>{expense.status}</td>
                    <td>
                      <button className="btn-edit">Edit</button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleStatusToggle(expense._id)}
                        className={`btn-toggle ${
                          expense.status === "Active"
                            ? "deactivate"
                            : "activate"
                        }`}
                      >
                        {expense.status === "Active"
                          ? "Deactivate"
                          : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No expenses found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpenseMaster;
