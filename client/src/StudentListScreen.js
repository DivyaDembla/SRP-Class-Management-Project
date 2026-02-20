import React, { useState } from "react";
import axios from "axios";
import "./StudentListScreen.css";

const StudentListScreen = ({ students, setStudents }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [batchFilter, setBatchFilter] = useState("");

  // ✅ FINAL FIX: OPTIMISTIC TOGGLE
  const toggleStatus = async (studentId) => {
    // 1️⃣ Immediately update UI
    setStudents((prev) =>
      prev.map((s) =>
        s._id === studentId
          ? {
              ...s,
              status: s.status === "Active" ? "Inactive" : "Active",
            }
          : s
      )
    );

    // 2️⃣ Sync with backend
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/students/${studentId}/toggle`
      );

      // 3️⃣ Replace with backend truth
      setStudents((prev) =>
        prev.map((s) => (s._id === res.data._id ? res.data : s))
      );
    } catch (error) {
      console.error("Toggle failed", error);
    }
  };

  // 🔍 Filter logic
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toString().includes(searchTerm);

    const matchesBatch = batchFilter ? student.batch === batchFilter : true;
    return matchesSearch && matchesBatch;
  });

  const batches = [...new Set(students.map((s) => s.batch))];

  return (
    <div className="student-container">
      <div className="student-card">
        <h3 className="student-title">Student List</h3>

        {/* Filters */}
        <div className="filter-section">
          <div>
            <label className="filter-label">Search</label>
            <input
              className="search-input"
              placeholder="Search by name or roll no..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <label className="filter-label">Batch</label>
            <select
              className="batch-select"
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
            >
              <option value="">All Batches</option>
              {batches.map((batch) => (
                <option key={batch} value={batch}>
                  {batch}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="student-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Batch</th>
                <th>Mobile</th>
                <th>Fee</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-results">
                    No results found
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr
                    key={student._id}
                    className={
                      student.status === "Inactive" ? "inactive-row" : ""
                    }
                  >
                    <td>{student.rollNumber}</td>
                    <td>{student.fullName}</td>
                    <td>{student.batch}</td>
                    <td>{student.mobile}</td>
                    <td>{student.fee ? `₹ ${student.fee}` : "-"}</td>

                    <td>
                      <button
                        className={
                          student.status === "Active"
                            ? "btn btn-deactivate"
                            : "btn btn-activate"
                        }
                        onClick={() => toggleStatus(student._id)}
                      >
                        {student.status === "Active"
                          ? "Deactivate"
                          : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentListScreen;
