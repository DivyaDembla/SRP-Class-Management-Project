import React, { useState } from "react";
import { Upload, Download, AlertTriangle, CheckCircle } from "lucide-react";
import "./ExcelManager.css";

const ExcelManager = ({
  data,
  setData,
  tableName,
  columns,
  fieldMap,
  allData,
  setAllData,
}) => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const showMessage = (type, text) => {
    setMessageType(type);
    setMessage(text);
    setTimeout(() => setMessage(""), 5000);
  };

  // ✅ Convert Excel row → app object
  const mapRowToObject = (row, index) => {
    const obj = { id: Date.now() + index };
    for (const col in fieldMap) {
      const key = fieldMap[col];
      obj[key] = row[col] || "";
    }
    return obj;
  };

  // ✅ Convert app object → Excel row
  const mapObjectToRow = (obj) => {
    const row = {};
    for (const col in fieldMap) {
      const key = fieldMap[col];
      if (key === "subjects" && Array.isArray(obj[key])) {
        row[col] = obj[key].join(", ");
      } else {
        row[col] = obj[key] ?? "";
      }
    }
    return row;
  };

  // --- IMPORT FUNCTIONALITY ---
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const ext = file.name.split(".").pop().toLowerCase();
    if (ext !== "xlsx" && ext !== "xls") {
      showMessage("error", "Please upload a valid .xlsx or .xls file.");
      event.target.value = null;
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const XLSX = window.XLSX;
        if (!XLSX)
          throw new Error("XLSX library not loaded. Add CDN in index.html.");

        const bytes = new Uint8Array(e.target.result);
        const workbook = XLSX.read(bytes, { type: "array" });
        const sheet = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheet];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (!json.length || !json[0]) {
          showMessage("error", "Empty or invalid Excel file.");
          return;
        }

        const headers = json[0].map((h) => String(h).trim());
        const missing = columns.filter((col) => !headers.includes(col));
        if (missing.length > 0) {
          showMessage(
            "error",
            `Missing columns: ${missing.join(", ")}. Expected: ${columns.join(", ")}`
          );
          return;
        }

        const newData = XLSX.utils.sheet_to_json(worksheet);
        if (!newData.length) {
          showMessage("error", "No records found.");
          return;
        }

        // ✅ Map Excel rows to JS objects using fieldMap
        const mappedData = newData.map(mapRowToObject);

        if (setAllData) setAllData((prev) => [...prev, ...mappedData]);
        else setData((prev) => [...prev, ...mappedData]);

        showMessage("success", `Imported ${mappedData.length} ${tableName} records.`);
      } catch (err) {
        console.error(err);
        showMessage("error", "Error reading Excel file.");
      }
      event.target.value = null;
    };

    reader.readAsArrayBuffer(file);
  };

  // --- EXPORT FUNCTIONALITY ---
  const handleExport = () => {
    const XLSX = window.XLSX;
    if (!XLSX) return showMessage("error", "XLSX library not loaded.");

    if (!data.length) {
      showMessage("error", "No data to export.");
      return;
    }

    // ✅ Convert objects back to Excel rows
    const formattedData = data.map(mapObjectToRow);

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, tableName);

    const fileName = `${tableName}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);

    showMessage("success", `Exported ${data.length} records to ${fileName}.`);
  };

  return (
    <div className="excel-controls">
      <div className="excel-buttons">
        {/* Import */}
        <label htmlFor="file-upload" className="excel-btn excel-import">
          <Upload className="icon" />
          Import {tableName}
          <input
            id="file-upload"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleImport}
            style={{ display: "none" }}
          />
        </label>

        {/* Export */}
        <button onClick={handleExport} className="excel-btn excel-export">
          <Download className="icon" />
          Export {tableName} ({data.length})
        </button>
      </div>

      {message && (
        <div
          className={`excel-message ${messageType === "error" ? "error" : "success"}`}
        >
          {messageType === "error" ? (
            <AlertTriangle className="icon" />
          ) : (
            <CheckCircle className="icon" />
          )}
          {message}
        </div>
      )}
    </div>
  );
};

export default ExcelManager;
