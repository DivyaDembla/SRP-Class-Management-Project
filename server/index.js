require("dotenv").config(); // Load .env first

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Make uploaded files accessible (for documents & photos)
app.use("/uploads", express.static("uploads"));

// ----------- MongoDB Connection -----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err.message));

// ----------- Routes -----------
app.use("/api/classes", require("./routes/classRoutes"));
app.use("/api/students", require("./routes/studentRoutes")); // added

//role master
app.use("/api/roles", require("./routes/roleRoutes"));

//user master
app.use("/api/users", require("./routes/userRoutes"));

//assign roles to users
app.use("/api/permissions", require("./routes/permissionRoutes"));

//location master
app.use("/api/locations", require("./routes/locationRoutes"));

//class group master
app.use("/api/class-groups", require("./routes/classGroupRoutes"));

//Teacher master
app.use("/api/teachers", require("./routes/teacherRoutes"));

//Expense 
app.use("/api/expenses", require("./routes/expenseRoutes"));

//Teacher Payment master
app.use("/api/teacher-payments", require("./routes/teacherPaymentRoutes"));

//Expense Master
app.use("/api/expense-master", require("./routes/expenseMasterRoutes"));

//Income Entry
app.use("/api/income-entries", require("./routes/incomeEntryRoutes"));

//Teacher Class Rate
app.use("/api/teacher-class-rates", require("./routes/teacherClassRateRoutes"));



// ----------- Server Start -----------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
