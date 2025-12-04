import React, { useState } from "react";
import "./TeacherClassRate.css";

const TeacherClassRate = () => {
  const [teacherName, setTeacherName] = useState("");
  const [classValue, setClassValue] = useState("");
  const [sectionValue, setSectionValue] = useState("");
  const [subjectRates, setSubjectRates] = useState({});
  const [rates, setRates] = useState([]);

  // Validation errors
  const [errors, setErrors] = useState({
    teacherName: "",
    classValue: "",
    sectionValue: "",
    subjects: "",
  });

  // Filters
  const [filterTeacher, setFilterTeacher] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterSection, setFilterSection] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const allClasses = Array.from({ length: 12 }, (_, i) => `${i + 1}`);
  const allSections = ["A", "B", "C", "D"];
  const allTeachers = ["John Doe", "Jane Smith"];

  const subjects = [
    "Math",
    "Science",
    "English",
    "History",
    "Geography",
    "Computer",
    "Physics",
    "Chemistry",
    "Biology",
  ];

  const handleSubjectToggle = (subject) => {
    setSubjectRates((prev) => {
      const newRates = { ...prev };
      if (newRates[subject]) {
        delete newRates[subject];
      } else {
        newRates[subject] = "";
      }
      return newRates;
    });

    // Remove validation error when user selects
    setErrors((prev) => ({ ...prev, subjects: "" }));
  };

  const handleRateChange = (subject, rate) => {
    setSubjectRates((prev) => ({
      ...prev,
      [subject]: rate,
    }));
  };

  const validateForm = () => {
    let newErrors = {
      teacherName: "",
      classValue: "",
      sectionValue: "",
      subjects: "",
    };

    if (!teacherName) newErrors.teacherName = "Teacher name is required";
    if (!classValue) newErrors.classValue = "Class is required";
    if (!sectionValue) newErrors.sectionValue = "Section is required";
    if (Object.keys(subjectRates).length === 0)
      newErrors.subjects = "Please select at least one subject";

    setErrors(newErrors);

    return Object.values(newErrors).every((e) => e === "");
  };

  const handleAddRate = () => {
    if (!validateForm()) return;

    const newEntries = Object.entries(subjectRates).map(
      ([subject, rate]) => ({
        teacherName,
        classValue,
        sectionValue,
        subject,
        rate: rate || "0",
        status: "Active",
        createdDate: new Date().toLocaleDateString(),
      })
    );

    setRates([...rates, ...newEntries]);

    // Reset values
    setTeacherName("");
    setClassValue("");
    setSectionValue("");
    setSubjectRates({});
  };

  const handleToggleStatus = (index) => {
    const updatedRates = [...rates];
    updatedRates[index].status =
      updatedRates[index].status === "Active" ? "Inactive" : "Active";
    setRates(updatedRates);
  };

  // Filtering
  const filteredRates = rates.filter((rate) => {
    return (
      (filterTeacher === "" || rate.teacherName === filterTeacher) &&
      (filterClass === "" || rate.classValue === filterClass) &&
      (filterSection === "" || rate.sectionValue === filterSection) &&
      (filterStatus === "" || rate.status === filterStatus)
    );
  });

  return (
    <div className="classmaster-root">
      <div className="classmaster-container">
        <div className="tcr-content">
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />

          <div className="tcr-card">
            <h1 className="tcr-title">Teacher-Class Rate Management Screen</h1>
            <hr className="tcr-divider" />
            <h2 className="tcr-subtitle">Details</h2>

            {/* Form */}
            <div className="tcr-form-grid">
              <div>
                <label htmlFor="teacherName">Teacher's Name:</label>
                <select
                  id="teacherName"
                  value={teacherName}
                  onChange={(e) => {
                    setTeacherName(e.target.value);
                    setErrors((prev) => ({ ...prev, teacherName: "" }));
                  }}
                >
                  <option value="">Drop DownList</option>
                  {allTeachers.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {errors.teacherName && (
                  <span className="error-text">{errors.teacherName}</span>
                )}
              </div>

              <div>
                <label htmlFor="classValue">Class:</label>
                <select
                  id="classValue"
                  value={classValue}
                  onChange={(e) => {
                    setClassValue(e.target.value);
                    setErrors((prev) => ({ ...prev, classValue: "" }));
                  }}
                >
                  <option value="">Select Class</option>
                  {allClasses.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
                {errors.classValue && (
                  <span className="error-text">{errors.classValue}</span>
                )}
              </div>

              <div>
                <label htmlFor="sectionValue">Section:</label>
                <select
                  id="sectionValue"
                  value={sectionValue}
                  onChange={(e) => {
                    setSectionValue(e.target.value);
                    setErrors((prev) => ({ ...prev, sectionValue: "" }));
                  }}
                >
                  <option value="">Select Section</option>
                  {allSections.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
                {errors.sectionValue && (
                  <span className="error-text">{errors.sectionValue}</span>
                )}
              </div>
            </div>

            {/* Subjects */}
            {classValue && sectionValue && (
              <div className="tcr-subject-section">
                <h3>Select Subjects & Enter Rate:</h3>
                {errors.subjects && (
                  <span className="error-text">{errors.subjects}</span>
                )}

                <div className="tcr-subject-grid">
                  {subjects.map((subject) => (
                    <div key={subject} className="tcr-subject-item">
                      <label>
                        <input
                          type="checkbox"
                          checked={subjectRates.hasOwnProperty(subject)}
                          onChange={() => handleSubjectToggle(subject)}
                        />
                        {subject}
                      </label>

                      {subjectRates.hasOwnProperty(subject) && (
                        <input
                          type="number"
                          placeholder="Rate"
                          value={subjectRates[subject]}
                          onChange={(e) =>
                            handleRateChange(subject, e.target.value)
                          }
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button onClick={handleAddRate} className="tcr-add-btn">
              Add
            </button>

            {/* Filters */}
            <h2 className="tcr-subtitle">Filter Records</h2>
            <div className="tcr-filter-grid">
              <select
                value={filterTeacher}
                onChange={(e) => setFilterTeacher(e.target.value)}
              >
                <option value="">All Teachers</option>
                {allTeachers.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
              >
                <option value="">All Classes</option>
                {allClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>

              <select
                value={filterSection}
                onChange={(e) => setFilterSection(e.target.value)}
              >
                <option value="">All Sections</option>
                {allSections.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Table */}
            <h2 className="tcr-subtitle">Teacher-Class Rate Grid</h2>
            <div className="tcr-table-container">
              <table className="tcr-table">
                <thead>
                  <tr>
                    <th>Teacher</th>
                    <th>Class</th>
                    <th>Section</th>
                    <th>Subject</th>
                    <th>Rate</th>
                    <th>Status</th>
                    <th>Created Date</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRates.length > 0 ? (
                    filteredRates.map((rate, index) => (
                      <tr key={index}>
                        <td>{rate.teacherName}</td>
                        <td>{rate.classValue}</td>
                        <td>{rate.sectionValue}</td>
                        <td>{rate.subject}</td>
                        <td>{rate.rate}</td>
                        <td>{rate.status}</td>
                        <td>{rate.createdDate}</td>
                        <td>
                          <button
                            className={`tcr-status-btn ${
                              rate.status === "Active"
                                ? "deactivate"
                                : "activate"
                            }`}
                            onClick={() => handleToggleStatus(index)}
                          >
                            {rate.status === "Active"
                              ? "Deactivate"
                              : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="tcr-no-data">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherClassRate;
