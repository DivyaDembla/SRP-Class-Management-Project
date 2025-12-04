import React, { useState } from "react";
import CollapsibleCard from "./CollapsibleCard";
import "./ExpenseMaster.css";

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

  // --- Handle Input + Remove Error Instantly ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // remove error for this field
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // --- Validate Form ---
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

  const handleSave = () => {
    if (!validateForm()) return;

    const newExpense = { ...formData, id: Date.now() };
    setExpenseList((prev) => [...prev, newExpense]);

    // reset
    setFormData({
      expenseType: "",
      expenseDescription: "",
      status: "Active",
    });
  };

  const handleReset = () => {
    setFormData({
      expenseType: "",
      expenseDescription: "",
      status: "Active",
    });
    setErrors({});
  };

  const handleStatusToggle = (id) => {
    setExpenseList((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "Active" ? "Inactive" : "Active" }
          : item
      )
    );
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
                placeholder="Description"
              ></textarea>
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

      {/* List */}
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
              {expenseList.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.expenseType}</td>
                  <td>{expense.expenseDescription}</td>
                  <td>{expense.status}</td>
                  <td>
                    <button className="btn-edit">Edit</button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleStatusToggle(expense.id)}
                      className={`btn-toggle ${
                        expense.status === "Active"
                          ? "deactivate"
                          : "activate"
                      }`}
                    >
                      {expense.status === "Active" ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpenseMaster;
