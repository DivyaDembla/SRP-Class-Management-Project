require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const AuthUser = require("./AuthUser");

/* CONNECT DATABASE */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("DB Connection Failed:", err);
    process.exit(1);
  });

/* CREATE ADMIN */
const createAdmin = async () => {
  try {
    const existing = await AuthUser.findOne({ username: "admin" });

    if (existing) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = new AuthUser({
      name: "Administrator",
      username: "admin",
      password: hashedPassword,
    });

    await admin.save();

    console.log("Admin user created successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

mongoose.connection.once("open", createAdmin);
