import React, { useEffect, useMemo, useState } from "react";
import "./TeacherPayment.css";
import axios from "axios";

const TEACHER_API = "http://localhost:5000/api/teachers";
const PAYMENT_API = "http://localhost:5000/api/teacher-payments";
const CLASS_API = "http://localhost:5000/api/classes";
const LECTURE_COUNT_API = "http://localhost:5000/api/lecture-counts";

const TeacherPayment = () => {
  /* ===== MASTER DATA ===== */
  const [teachers, setTeachers] = useState([]);
  const [classList, setClassList] = useState([]);

  /* ===== FORM ===== */
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [selectedStandard, setSelectedStandard] = useState("");
  const [section, setSection] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [ratePerLecture, setRatePerLecture] = useState("");

  /* ===== VALIDATION ===== */
  const [touched, setTouched] = useState({});

  const markTouched = (field) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const hasError = (field, value) => touched[field] && (!value || value === "");

  /* ===== LECTURES ===== */
  const [fetchedLectures, setFetchedLectures] = useState(null);
  const [loadingLectures, setLoadingLectures] = useState(false);

  /* ===== TABLE DATA ===== */
  const [paymentSummary, setPaymentSummary] = useState([]);
  const [paymentReport, setPaymentReport] = useState([]);

  /* ===== LOAD MASTER DATA ===== */
  useEffect(() => {
    axios.get(TEACHER_API).then((res) => setTeachers(res.data));
    axios
      .get(CLASS_API)
      .then((res) =>
        setClassList(res.data.filter((c) => c.status === "Active"))
      );
  }, []);

  useEffect(() => {
    axios.get(PAYMENT_API).then((res) => {
      setPaymentReport(res.data);

      // ✅ Show latest payment in summary after refresh
      if (res.data.length > 0) {
        const latest = res.data[0]; // assuming latest is first
        setPaymentSummary([
          {
            teacherName: latest.teacherName,
            subject: latest.subject,
            totalLectures: latest.totalLectures,
            ratePerLecture: latest.ratePerLecture,
            totalAmount: latest.totalAmount,
            status: latest.status,
          },
        ]);
      }
    });
  }, []);

  const selectedTeacher = useMemo(
    () => teachers.find((t) => t._id === selectedTeacherId),
    [teachers, selectedTeacherId]
  );

  /* ===== FETCH LECTURES ===== */
  useEffect(() => {
    if (!selectedTeacher || !selectedSubject || !selectedMonth) {
      setFetchedLectures(0);
      return;
    }

    const fetchLectures = async () => {
      try {
        setLoadingLectures(true);
        const res = await axios.get(LECTURE_COUNT_API, {
          params: {
            teacher: selectedTeacher.fullName,
            subject: selectedSubject,
            month: selectedMonth,
          },
        });
        setFetchedLectures(Number(res.data?.totalLectures || 0));
      } catch {
        setFetchedLectures(0);
      } finally {
        setLoadingLectures(false);
      }
    };

    fetchLectures();
  }, [selectedTeacher, selectedSubject, selectedMonth]);

  /* ===== SAVE ===== */
  const handleSave = async () => {
    setTouched({
      selectedMonth: true,
      selectedTeacherId: true,
      selectedStandard: true,
      selectedSubject: true,
      ratePerLecture: true,
    });

    if (
      !selectedMonth ||
      !selectedTeacher ||
      !selectedStandard ||
      !section ||
      !selectedSubject ||
      !ratePerLecture
    ) {
      return;
    }

    const rate = parseInt(ratePerLecture, 10);
    const lectures = parseInt(fetchedLectures, 10);
    const totalAmount = rate * lectures;

    const payload = {
      teacherId: selectedTeacher._id,
      teacherName: selectedTeacher.fullName,
      standard: selectedStandard,
      section,
      subject: selectedSubject,
      month: selectedMonth,
      totalLectures: lectures,
      ratePerLecture: rate,
      totalAmount,
      status: "Paid",
    };

    const res = await axios.post(PAYMENT_API, payload);

    setPaymentSummary([
      {
        teacherName: selectedTeacher.fullName,
        subject: selectedSubject,
        totalLectures: lectures,
        ratePerLecture: rate,
        totalAmount,
        status: "Paid",
      },
    ]);

    setPaymentReport((prev) => [res.data, ...prev]);
    setRatePerLecture("");
    alert("Payment saved successfully");
  };

  return (
    <div className="main-container">
      <div className="card">
        <h1 className="card-title">Payment Details</h1>

        <div className="form-row">
          <div className="form-group">
            <label>Month & Year</label>
            <input
              type="month"
              value={selectedMonth}
              onBlur={() => markTouched("selectedMonth")}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
            {hasError("selectedMonth", selectedMonth) && (
              <small className="error">Month is required</small>
            )}
          </div>

          <div className="form-group">
            <label>Teacher</label>
            <select
              value={selectedTeacherId}
              onBlur={() => markTouched("selectedTeacherId")}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
            >
              <option value="" hidden>
                Select Teacher
              </option>
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.fullName}
                </option>
              ))}
            </select>
            {hasError("selectedTeacherId", selectedTeacherId) && (
              <small className="error">Teacher is required</small>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Standard</label>
            <select
              onBlur={() => markTouched("selectedStandard")}
              onChange={(e) => {
                const cls = classList.find((c) => c._id === e.target.value);
                setSelectedStandard(cls?.name || "");
                setSection(cls?.section || "");
              }}
            >
              <option value="" hidden>
                Select Standard
              </option>
              {classList.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name} ({cls.section})
                </option>
              ))}
            </select>
            {hasError("selectedStandard", selectedStandard) && (
              <small className="error">Standard is required</small>
            )}
          </div>

          <div className="form-group">
            <label>Section</label>
            <input readOnly value={section} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Subject</label>
            <select
              value={selectedSubject}
              onBlur={() => markTouched("selectedSubject")}
              onChange={(e) => setSelectedSubject(e.target.value)}
              disabled={!selectedTeacher}
            >
              <option value="" hidden>
                Select Subject
              </option>
              {selectedTeacher?.subjects?.map((sub, i) => (
                <option key={i} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
            {hasError("selectedSubject", selectedSubject) && (
              <small className="error">Subject is required</small>
            )}
          </div>

          <div className="form-group">
            <label>Rate per Lecture</label>
            <input
              type="number"
              value={ratePerLecture}
              onBlur={() => markTouched("ratePerLecture")}
              onChange={(e) => setRatePerLecture(e.target.value)}
            />
            {hasError("ratePerLecture", ratePerLecture) && (
              <small className="error">Rate is required</small>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>No of Lectures</label>
            <input
              readOnly
              value={loadingLectures ? "Fetching..." : fetchedLectures ?? "--"}
            />
          </div>
        </div>

        <button className="btn-fetch" onClick={handleSave}>
          Save
        </button>
      </div>

      {/* ===== SUMMARY ===== */}
      <div className="card">
        <h2 className="section-title">Payment Summary</h2>
        <table>
          <thead>
            <tr>
              <th>Teacher</th>
              <th>Subject</th>
              <th>Lectures</th>
              <th>Rate</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paymentSummary.length ? (
              paymentSummary.map((p, i) => (
                <tr key={i}>
                  <td>{p.teacherName}</td>
                  <td>{p.subject}</td>
                  <td>{p.totalLectures}</td>
                  <td>₹{p.ratePerLecture}</td>
                  <td>₹{p.totalAmount}</td>
                  <td>{p.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No data yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherPayment;
