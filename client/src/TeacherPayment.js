import React, { useState, useMemo } from "react";
import "./TeacherPayment.css";

// --- Inline SVG Icons ---
const DownloadIcon = (props) => (
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
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);
const SearchIcon = (props) => (
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
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
const CheckSquareIcon = (props) => (
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
    <polyline points="9 11 12 14 22 4"></polyline>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
  </svg>
);

// --- Mock Data ---
const MOCK_TEACHER_RATE = 500;
const MOCK_LECTURE_DATA = {
  "Jane Smith": 15,
  "John Doe": 12,
  "Emily Chen": 18,
};
const MOCK_TEACHER_PAYMENTS = [
  {
    name: "Jane Smith",
    totalLectures: 15,
    totalAmount: 7500,
    status: "Pending",
    reportDate: "2025-05",
  },
  {
    name: "John Doe",
    totalLectures: 12,
    totalAmount: 6000,
    status: "Paid",
    reportDate: "2025-04",
  },
  {
    name: "Emily Chen",
    totalLectures: 18,
    totalAmount: 9000,
    status: "Pending",
    reportDate: "2025-06",
  },
];

const TeacherPayment = () => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [paymentType, setPaymentType] = useState("Single Teacher Payment");
  const [fetchedLectures, setFetchedLectures] = useState(null);
  const [ratePerLecture, setRatePerLecture] = useState(MOCK_TEACHER_RATE);
  const [paymentSummary, setPaymentSummary] = useState([]);
  const [paymentReport, setPaymentReport] = useState(MOCK_TEACHER_PAYMENTS);
  const [loading, setLoading] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const totalPayableAmount = useMemo(() => {
    if (
      paymentType === "Single Teacher Payment" &&
      typeof fetchedLectures === "number"
    ) {
      return fetchedLectures * ratePerLecture;
    }
    if (paymentType === "Bulk Payment" && paymentSummary.length > 0) {
      return paymentSummary.reduce((sum, item) => sum + item.totalAmount, 0);
    }
    return null;
  }, [fetchedLectures, ratePerLecture, paymentType, paymentSummary]);

  const payableAmountText =
    totalPayableAmount !== null
      ? `₹${totalPayableAmount.toFixed(2)}`
      : "-- Total lectures x Rate --";

  const openModal = (title, message) => setModalContent({ title, message });
  const closeModal = () => setModalContent(null);

  const handleFetch = () => {
    if (!selectedMonth) {
      openModal(
        "Missing Data",
        "Please select a Month & Year before fetching."
      );
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (paymentType === "Single Teacher Payment") {
        const teacherName = "Jane Smith";
        const lectures = MOCK_LECTURE_DATA[teacherName] || 0;
        setFetchedLectures(lectures);
        setPaymentSummary([
          {
            name: teacherName,
            totalLectures: lectures,
            totalAmount: lectures * MOCK_TEACHER_RATE,
            status: "Pending",
          },
        ]);
      } else {
        const summary = Object.entries(MOCK_LECTURE_DATA).map(
          ([name, lectures]) => ({
            name,
            totalLectures: lectures,
            totalAmount: lectures * MOCK_TEACHER_RATE,
            status: "Pending",
          })
        );
        setFetchedLectures(summary.length);
        setPaymentSummary(summary);
      }
      setLoading(false);
    }, 1000);
  };

  const handleSavePayment = () => {
    if (paymentSummary.length === 0) {
      openModal(
        "Data Missing",
        "Please fetch payment details first before saving."
      );
      return;
    }

    const isSingle = paymentType === "Single Teacher Payment";
    const name = isSingle
      ? paymentSummary[0].name
      : `Bulk Payment for ${selectedMonth}`;
    const totalLectures = isSingle
      ? paymentSummary[0].totalLectures
      : paymentSummary.reduce((sum, item) => sum + item.totalLectures, 0);

    const newReportEntry = {
      name,
      totalLectures,
      totalAmount: totalPayableAmount,
      status: "Pending",
      reportDate: selectedMonth,
    };

    setPaymentReport((prev) => [newReportEntry, ...prev]);
    openModal(
      "Payment Saved",
      `Payment for ${newReportEntry.name} successfully saved.`
    );
    setPaymentSummary([]);
    setFetchedLectures(null);
    setSelectedMonth("");
    setPaymentType("Single Teacher Payment");
  };

  const handleMarkAsPaid = (index) => {
    setPaymentReport((prev) =>
      prev.map((item, i) => (i === index ? { ...item, status: "Paid" } : item))
    );
  };

  const handleViewDetails = (reportItem) => {
    openModal(
      `Payment Details: ${reportItem.name}`,
      `Period: ${reportItem.reportDate}\nLectures: ${
        reportItem.totalLectures
      }\nAmount: ₹${reportItem.totalAmount.toFixed(2)}\nStatus: ${
        reportItem.status
      }`
    );
  };

  const handleGeneratePdf = (reportItem) => {
    openModal(
      "PDF Generation",
      `Generating PDF for ${reportItem.name} (${reportItem.reportDate})`
    );
  };

  const CustomModal = ({ title, message }) => (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">{title}</div>
        <div className="modal-content">{message}</div>
        <div className="modal-footer">
          <button onClick={closeModal} className="btn-primary">
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="main-container">
      {/* --- Payment Details Card --- */}
      <div className="card">
        <h1 className="card-title">Payment Details</h1>

        <section className="input-section">
          <div className="form-row">
            <div className="form-group">
              <label>Month & Year:</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Payment Type:</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    checked={paymentType === "Single Teacher Payment"}
                    value="Single Teacher Payment"
                    onChange={(e) => setPaymentType(e.target.value)}
                  />{" "}
                  Single
                </label>
                <label>
                  <input
                    type="radio"
                    checked={paymentType === "Bulk Payment"}
                    value="Bulk Payment"
                    onChange={(e) => setPaymentType(e.target.value)}
                  />{" "}
                  Bulk
                </label>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>No of Lectures:</label>
              <input
                type="text"
                readOnly
                value={fetchedLectures ?? "--auto fetched--"}
              />
            </div>
            <div className="form-group">
              <label>Rate per Lecture:</label>
              <input
                type="text"
                readOnly
                value={ratePerLecture ?? "--auto fetched--"}
              />
            </div>
          </div>

          <div className="fetch-row">
            <button
              onClick={handleFetch}
              disabled={loading}
              className="btn-fetch"
            >
              {loading ? "Fetching..." : "Fetch"}
            </button>
            <div className="amount-display">
              <span>Payable Amount:</span>
              <strong>{payableAmountText}</strong>
            </div>
          </div>
        </section>
      </div>

      {/* --- Payment Summary & Report Card --- */}
      <div className="card">
        {/* Payment Summary */}
        <section>
          <h2 className="section-title">Payment Summary</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Teacher</th>
                  <th>Lectures</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paymentSummary.length > 0 ? (
                  paymentSummary.map((item, i) => (
                    <tr key={i}>
                      <td>{item.name}</td>
                      <td>{item.totalLectures}</td>
                      <td>₹{item.totalAmount.toFixed(2)}</td>
                      <td>Pending</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">
                      {loading ? "Fetching data..." : "No data yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {paymentSummary.length > 0 && (
            <button onClick={handleSavePayment} className="btn-save">
              Save Payment
            </button>
          )}
        </section>
      </div>
      <div className="card">
        {/* Report */}
        <section>
          <h2 className="section-title">Report</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Teacher</th>
                  <th>Lectures</th>
                  <th>Amount</th>
                  <th>View</th>
                  <th>PDF</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paymentReport.map((item, i) => (
                  <tr
                    key={i}
                    className={item.status === "Paid" ? "paid-row" : ""}
                  >
                    <td>{item.name}</td>
                    <td>{item.totalLectures}</td>
                    <td>₹{item.totalAmount.toFixed(2)}</td>
                    <td>
                      <button
                        onClick={() => handleViewDetails(item)}
                        className="icon-btn"
                      >
                        <SearchIcon />
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleGeneratePdf(item)}
                        className="icon-btn"
                      >
                        <DownloadIcon />
                      </button>
                    </td>
                    <td>
                      {item.status === "Paid" ? (
                        <CheckSquareIcon className="icon-green" />
                      ) : (
                        <button
                          onClick={() => handleMarkAsPaid(i)}
                          className="icon-btn"
                        >
                          <CheckSquareIcon />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Modal */}
      {modalContent && (
        <CustomModal
          title={modalContent.title}
          message={modalContent.message}
        />
      )}
    </div>
  );
};

export default TeacherPayment;
